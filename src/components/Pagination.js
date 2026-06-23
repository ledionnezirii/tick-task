// Page navigator shown under the list when there are more tasks than fit on
// one page. Prev / Next with a mono "PAGE x / y" tally, matching the pad style.
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function Pagination({ page, totalPages, onPrev, onNext }) {
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPrev}
        disabled={atStart}
        style={[styles.btn, atStart && styles.btnDisabled]}
      >
        <Text style={[styles.btnText, atStart && styles.btnTextDisabled]}>← Prev</Text>
      </Pressable>

      <Text style={styles.label}>
        PAGE {page} / {totalPages}
      </Text>

      <Pressable
        onPress={onNext}
        disabled={atEnd}
        style={[styles.btn, atEnd && styles.btnDisabled]}
      >
        <Text style={[styles.btnText, atEnd && styles.btnTextDisabled]}>Next →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  btn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderRadius: 8,
  },
  btnDisabled: {
    borderColor: colors.line,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
  },
  btnTextDisabled: {
    color: colors.muted,
  },
  label: {
    fontSize: 12,
    letterSpacing: 1,
    color: colors.inkSoft,
    fontFamily: fonts.monoBold,
  },
});
