// Status marker for the details screen. A "live"-style dot — the core gently
// breathes (shrinks and grows) while a halo expands and fades around it — with
// the label in pure green (completed) or red (not completed).
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { fonts } from '../theme/fonts';

const GREEN = '#16a34a';
const RED = '#e5342b';

export default function StatusBadge({ completed }) {
  const tint = completed ? GREEN : RED;
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(t, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [t]);

  // Core "breathes": full -> shrunk -> full each cycle.
  const coreScale = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.65, 1],
  });
  // Halo expands outward and fades, like a live ping.
  const haloScale = t.interpolate({ inputRange: [0, 1], outputRange: [1, 2.6] });
  const haloOpacity = t.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] });

  return (
    <View style={styles.row}>
      <View style={styles.dotWrap}>
        <Animated.View
          style={[
            styles.dot,
            styles.halo,
            { backgroundColor: tint, opacity: haloOpacity, transform: [{ scale: haloScale }] },
          ]}
        />
        <Animated.View
          style={[styles.dot, { backgroundColor: tint, transform: [{ scale: coreScale }] }]}
        />
      </View>
      <Text style={[styles.label, { color: tint }]}>
        {completed ? 'COMPLETED' : 'NOT COMPLETED'}
      </Text>
    </View>
  );
}

const DOT = 10;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotWrap: {
    width: DOT,
    height: DOT,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
  },
  halo: {
    position: 'absolute',
  },
  label: {
    fontSize: 12,
    letterSpacing: 1.5,
    fontFamily: fonts.mono,
  },
});
