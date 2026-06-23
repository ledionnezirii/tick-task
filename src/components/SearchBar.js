// Search input for filtering tasks by title. Crisp, paper-like field that
// matches the rest of the pad.
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';

export default function SearchBar({ value, onChangeText }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⌕</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search by title"
        placeholderTextColor={colors.muted}
        returnKeyType="search"
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Text style={styles.clear}>✕</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.line,
    paddingHorizontal: 14,
    height: 48,
  },
  icon: {
    fontSize: 20,
    color: colors.muted,
    marginRight: 10,
    marginTop: -2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
  },
  clear: {
    fontSize: 14,
    color: colors.muted,
    paddingHorizontal: 4,
  },
});
