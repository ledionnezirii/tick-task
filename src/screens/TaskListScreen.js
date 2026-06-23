// Main screen: a personal task pad. A masthead shows today's date, the title,
// and a highlighter progress meter; below it, search + status filter and the
// list of task rows. Handles loading, API-error, and two empty states.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import FilterTabs from '../components/FilterTabs';
import Pagination from '../components/Pagination';
import ProgressMeter from '../components/ProgressMeter';
import SearchBar from '../components/SearchBar';
import TaskItem from '../components/TaskItem';
import { useTasks } from '../context/TasksContext';
import { useToast } from '../context/ToastContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

const PAGE_SIZE = 10; // tasks shown per page

// Today's date as a tracked eyebrow, e.g. "MONDAY · 22 JUNE".
function todayEyebrow() {
  const now = new Date();
  const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
  const day = now.getDate();
  const month = now.toLocaleDateString(undefined, { month: 'long' });
  return `${weekday} · ${day} ${month}`.toUpperCase();
}

export default function TaskListScreen({ navigation }) {
  const { tasks, loading, error, toggleTask, deleteTask, restoreTask, retrySeed } =
    useTasks();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [page, setPage] = useState(1);
  const listRef = useRef(null);

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(query);
      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && !task.completed) ||
        (filter === 'completed' && task.completed);
      return matchesSearch && matchesFilter;
    });
  }, [tasks, search, filter]);

  const completedCount = tasks.filter((t) => t.completed).length;

  // Pagination derived from the filtered list.
  const totalPages = Math.max(1, Math.ceil(visibleTasks.length / PAGE_SIZE));
  const pageTasks = visibleTasks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Jump back to the first page whenever the search or filter changes.
  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  // Keep the current page in range if the list shrinks (e.g. after deletes).
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const goToPage = (next) => {
    setPage(next);
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  // Animate the list reflow (rows sliding/fading) around any change.
  const withAnimation = (fn) => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        240,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
    fn();
  };

  const handleToggle = (id) => withAnimation(() => toggleTask(id));

  const handleConfirmDelete = () => {
    if (pendingDelete) {
      const task = pendingDelete;
      const index = tasks.findIndex((t) => t.id === task.id);
      withAnimation(() => deleteTask(task.id));
      showToast('Task deleted', {
        actionLabel: 'Undo',
        onAction: () => withAnimation(() => restoreTask(task, index)),
      });
    }
    setPendingDelete(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={colors.amber} />
        <Text style={styles.loadingText}>Opening your task pad…</Text>
      </SafeAreaView>
    );
  }

  const renderEmpty = () => {
    if (error && tasks.length === 0) {
      return (
        <View style={styles.emptyWrap}>
          <EmptyState
            kicker="Offline start"
            title="Couldn't load starter tasks"
            message={error}
          />
          <Button title="Try again" onPress={retrySeed} />
        </View>
      );
    }

    if (tasks.length > 0) {
      return (
        <EmptyState
          kicker="Nothing here"
          title="No matching tasks"
          message="Try a different search or filter."
        />
      );
    }

    return (
      <EmptyState
        kicker="Clean slate"
        title="Your pad is empty"
        message="Tap the + button to write your first task."
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        ref={listRef}
        data={pageTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.brand}>
              <Image
                source={require('../../assets/icon.png')}
                style={styles.logo}
              />
              <Text style={styles.brandName}>TickTask</Text>
            </View>
            <Text style={styles.eyebrow}>{todayEyebrow()}</Text>
            <Text style={styles.title}>My Tasks</Text>

            <View style={styles.meterWrap}>
              <ProgressMeter done={completedCount} total={tasks.length} />
            </View>

            <SearchBar value={search} onChangeText={setSearch} />

            <View style={styles.controlsRow}>
              <FilterTabs value={filter} onChange={setFilter} />
              <Pressable
                style={styles.addBtn}
                onPress={() => navigation.navigate('AddTask')}
              >
                <Text style={styles.addBtnText}>＋ Add</Text>
              </Pressable>
            </View>

            <View style={styles.rule} />
          </View>
        }
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          pageTasks.length > 0 && totalPages > 1 ? (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => goToPage(page - 1)}
              onNext={() => goToPage(page + 1)}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onPress={() => navigation.navigate('TaskDetails', { id: item.id })}
            onToggle={() => handleToggle(item.id)}
            onDelete={() => setPendingDelete(item)}
          />
        )}
      />

      <ConfirmDialog
        visible={!!pendingDelete}
        title="Delete task?"
        message={
          pendingDelete
            ? `"${pendingDelete.title}" will be removed for good.`
            : ''
        }
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  loadingText: {
    marginTop: 14,
    color: colors.muted,
    fontSize: 14,
    fontFamily: fonts.mono,
    letterSpacing: 0.5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    paddingTop: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  logo: {
    width: 30,
    height: 30,
  },
  brandName: {
    fontSize: 20,
    color: colors.ink,
    fontFamily: fonts.displayBold,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.amberInk,
    fontFamily: fonts.mono,
    marginTop: 16,
  },
  title: {
    marginTop: 6,
    fontSize: 40,
    lineHeight: 44,
    color: colors.ink,
    fontFamily: fonts.displayBold,
  },
  meterWrap: {
    marginTop: 18,
    marginBottom: 22,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  addBtn: {
    backgroundColor: colors.ink,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 15,
  },
  addBtnText: {
    color: colors.paper,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  rule: {
    height: 1,
    backgroundColor: colors.line,
    marginTop: 16,
    marginBottom: 16,
  },
  emptyWrap: {
    paddingHorizontal: 4,
  },
});
