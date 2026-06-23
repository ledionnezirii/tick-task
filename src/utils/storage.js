// Thin wrapper around AsyncStorage so the rest of the app talks to a tiny,
// task-specific API instead of dealing with JSON parsing and keys directly.
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@pritech_tasks';

export async function loadTasks() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Failed to load tasks from storage', error);
    return null;
  }
}

export async function saveTasks(tasks) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn('Failed to save tasks to storage', error);
  }
}
