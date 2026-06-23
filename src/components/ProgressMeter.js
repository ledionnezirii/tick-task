// Signature element: a highlighter-style progress meter for the masthead.
// A thin ruled track that an amber bar sweeps across as tasks get completed,
// labelled in mono like a tally ("3 / 8 DONE"). The fill animates smoothly
// whenever the completed count changes.
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function ProgressMeter({ done, total }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const widthAnim = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: pct,
      duration: 450,
      useNativeDriver: false, // width % can't use the native driver
    }).start();
  }, [pct, widthAnim]);

  const width = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width }]} />
      </View>
      <Text style={styles.label}>
        {done} / {total} DONE
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.line,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.amber,
  },
  label: {
    fontSize: 11,
    letterSpacing: 1,
    color: colors.inkSoft,
    fontFamily: fonts.monoBold,
  },
});
