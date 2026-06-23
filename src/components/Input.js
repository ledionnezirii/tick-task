// Reusable labelled text input. The label is a small tracked mono caption (the
// "data face"), and the field shows an inline error and optional counter.
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  maxLength,
  showCounter = false,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {showCounter && maxLength ? (
          <Text style={styles.counter}>
            {(value || '').length}/{maxLength}
          </Text>
        ) : null}
      </View>

      <TextInput
        style={[
          styles.input,
          multiline && styles.multiline,
          focused && styles.inputFocused,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        maxLength={maxLength}
        textAlignVertical={multiline ? 'top' : 'center'}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: colors.inkSoft,
    fontFamily: fonts.mono,
  },
  counter: {
    fontSize: 11,
    color: colors.muted,
    fontFamily: fonts.mono,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    color: colors.ink,
  },
  multiline: {
    minHeight: 120,
    paddingTop: 13,
  },
  inputFocused: {
    borderColor: colors.amber,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    marginTop: 7,
    fontSize: 13,
    color: colors.danger,
  },
});
