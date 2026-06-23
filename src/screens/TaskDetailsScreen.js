// Read-only details for a single task, with actions to toggle status or delete.
// Title is set in the display serif; field labels are tracked mono captions.
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import { useTasks } from '../context/TasksContext';
import { useToast } from '../context/ToastContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { formatDateTime } from '../utils/date';

export default function TaskDetailsScreen({ route, navigation }) {
  const { id } = route.params;
  const { getTaskById, toggleTask, deleteTask, restoreTask } = useTasks();
  const { showToast } = useToast();
  const task = getTaskById(id);
  const [confirmVisible, setConfirmVisible] = useState(false);

  if (!task) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <EmptyState
          kicker="Gone"
          title="Task not found"
          message="This task may have been deleted."
        />
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    const removed = task;
    setConfirmVisible(false);
    deleteTask(removed.id);
    navigation.goBack();
    showToast('Task deleted', {
      actionLabel: 'Undo',
      onAction: () => restoreTask(removed, 0),
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <StatusBadge completed={task.completed} />

        <Text style={styles.title}>{task.title}</Text>

        <View style={styles.rule} />

        <View style={styles.section}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <Text style={styles.value}>
            {task.description ? task.description : 'No description provided.'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>CREATED</Text>
          <Text style={styles.meta}>{formatDateTime(task.createdAt)}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={task.completed ? 'Mark as not completed' : 'Mark as completed'}
          variant="secondary"
          onPress={() => toggleTask(task.id)}
        />
        <Button
          title="Delete task"
          variant="danger"
          onPress={() => setConfirmVisible(true)}
        />
      </View>

      <ConfirmDialog
        visible={confirmVisible}
        title="Delete task?"
        message={`"${task.title}" will be removed for good.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    padding: 22,
  },
  title: {
    marginTop: 16,
    fontSize: 30,
    lineHeight: 36,
    color: colors.ink,
    fontFamily: fonts.displayBold,
  },
  rule: {
    height: 1,
    backgroundColor: colors.line,
    marginTop: 22,
  },
  section: {
    marginTop: 26,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.muted,
    fontFamily: fonts.mono,
  },
  value: {
    marginTop: 10,
    fontSize: 16,
    color: colors.ink,
    lineHeight: 23,
  },
  meta: {
    marginTop: 10,
    fontSize: 14,
    color: colors.inkSoft,
    fontFamily: fonts.mono,
  },
  footer: {
    padding: 22,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
