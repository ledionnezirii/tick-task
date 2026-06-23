// Friendly placeholder shown when there are no tasks to display. The heading is
// set in the display serif; the supporting line stays quiet.
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function EmptyState({ kicker, title, message }) {
  return (
    <View style={styles.container}>
      {kicker ? <Text style={styles.kicker}>{kicker.toUpperCase()}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 28,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 2,
    color: colors.amberInk,
    fontFamily: fonts.mono,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    color: colors.ink,
    fontFamily: fonts.display,
    textAlign: 'center',
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 21,
  },
});
