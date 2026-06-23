// A single line in the task pad. A colored left "spine" signals status at a
// glance (amber = to do, sage = done). Tapping the row opens details; the
// checkbox toggles completion; the × deletes. Completed tasks are struck
// through and faded, like a crossed-off item on paper.
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { formatDate } from '../utils/date';

export default function TaskItem({ task, onPress, onToggle, onDelete }) {
  const done = task.completed;
  const scale = useRef(new Animated.Value(1)).current;

  // Give the checkbox a quick pop when toggled, then call the real handler.
  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.8, duration: 90, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    onToggle();
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {/* Status spine */}
      <View style={[styles.spine, { backgroundColor: done ? colors.sage : colors.amber }]} />

      <View style={styles.inner}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Pressable
            onPress={handleToggle}
            hitSlop={10}
            style={[styles.checkbox, done && styles.checkboxDone]}
          >
            {done ? <Text style={styles.check}>✓</Text> : null}
          </Pressable>
        </Animated.View>

        <View style={styles.body}>
          <Text style={[styles.title, done && styles.titleDone]} numberOfLines={1}>
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.description} numberOfLines={1}>
              {task.description}
            </Text>
          ) : null}
          <Text style={styles.date}>{formatDate(task.createdAt).toUpperCase()}</Text>
        </View>

        <Pressable onPress={onDelete} hitSlop={10} style={styles.delete}>
          <Text style={styles.deleteText}>✕</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: 10,
    overflow: 'hidden',
  },
  pressed: {
    backgroundColor: colors.paper,
  },
  spine: {
    width: 5,
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checkboxDone: {
    backgroundColor: colors.sage,
    borderColor: colors.sage,
  },
  check: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: colors.ink,
    fontWeight: '600',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.muted,
    fontWeight: '500',
  },
  description: {
    marginTop: 3,
    fontSize: 13,
    color: colors.muted,
  },
  date: {
    marginTop: 8,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.muted,
    fontFamily: fonts.mono,
  },
  delete: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginLeft: 6,
  },
  deleteText: {
    fontSize: 15,
    color: colors.muted,
  },
});
