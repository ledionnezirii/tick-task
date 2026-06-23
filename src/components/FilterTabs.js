// Status filter rendered as small underlined mono tabs (bonus feature).
// The active tab carries an amber highlighter underline.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'To do' },
  { key: 'completed', label: 'Done' },
];

export default function FilterTabs({ value, onChange }) {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => {
        const active = filter.key === value;
        return (
          <Pressable
            key={filter.key}
            onPress={() => onChange(filter.key)}
            style={styles.tab}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {filter.label.toUpperCase()}
            </Text>
            <View style={[styles.underline, active && styles.underlineActive]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 22,
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: colors.muted,
    fontFamily: fonts.mono,
    paddingBottom: 6,
  },
  labelActive: {
    color: colors.ink,
  },
  underline: {
    height: 3,
    width: '100%',
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  underlineActive: {
    backgroundColor: colors.amber,
  },
});
