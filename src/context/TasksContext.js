// Single source of truth for tasks.
//
// We keep all task state and the actions that change it in one Context so any
// screen (list, details, add) can read or update tasks without prop-drilling.
// Persistence (AsyncStorage) and the first-run API seed live here too, so the
// screens stay focused purely on UI.
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { fetchSeedTasks } from '../api/tasksApi';
import { loadTasks, saveTasks } from '../utils/storage';

const TasksContext = createContext(null);

// Creates a brand new task object from user input.
function createTask({ title, description }) {
  return {
    id: `task-${Date.now()}`,
    title: title.trim(),
    description: (description || '').trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On first mount: load from device, and if nothing is stored yet, seed the
  // list from the public API. This is what satisfies the "fetch + use it"
  // requirement in a way that actually adds value.
  useEffect(() => {
    let active = true;

    async function bootstrap() {
      setLoading(true);
      setError(null);

      const stored = await loadTasks();
      if (stored && stored.length > 0) {
        if (active) {
          setTasks(stored);
          setLoading(false);
        }
        return;
      }

      // No saved tasks -> first launch -> seed from the API.
      try {
        const seeded = await fetchSeedTasks();
        if (active) {
          setTasks(seeded);
          saveTasks(seeded);
        }
      } catch (err) {
        if (active) {
          setError('Could not load starter tasks from the API.');
          setTasks([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  // Persist tasks whenever they change (but not during the initial load).
  useEffect(() => {
    if (!loading) {
      saveTasks(tasks);
    }
  }, [tasks, loading]);

  const addTask = useCallback((input) => {
    const task = createTask(input);
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  // Re-insert a previously deleted task at its original position (used by Undo).
  const restoreTask = useCallback((task, index = 0) => {
    setTasks((prev) => {
      const next = [...prev];
      const at = Math.max(0, Math.min(index, next.length));
      next.splice(at, 0, task);
      return next;
    });
  }, []);

  const getTaskById = useCallback(
    (id) => tasks.find((task) => task.id === id),
    [tasks]
  );

  // Retry the API seed when the first launch failed and the list is empty.
  const retrySeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const seeded = await fetchSeedTasks();
      setTasks(seeded);
      saveTasks(seeded);
    } catch (err) {
      setError('Could not load starter tasks from the API.');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      loading,
      error,
      addTask,
      toggleTask,
      deleteTask,
      restoreTask,
      getTaskById,
      retrySeed,
    }),
    [
      tasks,
      loading,
      error,
      addTask,
      toggleTask,
      deleteTask,
      restoreTask,
      getTaskById,
      retrySeed,
    ]
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

// Convenience hook so screens just call useTasks() and get everything typed.
export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used inside a TasksProvider');
  }
  return context;
}
