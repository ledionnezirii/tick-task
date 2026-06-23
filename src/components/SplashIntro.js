// Cinematic opening sequence, shown once when the app launches.
//
// The wordmark fades and springs up on an ink backdrop, a marigold highlighter
// sweeps across it (the app's signature motif), it holds for a beat, then the
// whole thing zooms and fades out to reveal the task pad underneath.
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function SplashIntro({ onFinish }) {
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameScale = useRef(new Animated.Value(0.82)).current;
  const sweep = useRef(new Animated.Value(0)).current; // highlighter 0 -> 1
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const exitScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Wordmark fades + springs in
      Animated.parallel([
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(nameScale, {
          toValue: 1,
          friction: 6,
          tension: 55,
          useNativeDriver: true,
        }),
      ]),
      // 2. Highlighter sweeps across the name
      Animated.timing(sweep, {
        toValue: 1,
        duration: 460,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      // 3. Tagline appears
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      // 4. Hold
      Animated.delay(520),
      // 5. Zoom + fade out to reveal the app
      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 460,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(exitScale, {
          toValue: 1.18,
          duration: 460,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start(({ finished }) => {
      if (finished) onFinish();
    });
  }, []);

  const sweepWidth = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View
      style={[styles.container, { opacity: containerOpacity }]}
      pointerEvents="none"
    >
      <Animated.View
        style={{
          opacity: nameOpacity,
          transform: [{ scale: Animated.multiply(nameScale, exitScale) }],
          alignItems: 'center',
        }}
      >
        <View style={styles.wordWrap}>
          {/* Highlighter stroke behind the wordmark */}
          <Animated.View style={[styles.highlight, { width: sweepWidth }]} />
          <Text style={styles.word}>TickTask</Text>
        </View>

        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          YOUR PERSONAL TASK PAD
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  wordWrap: {
    justifyContent: 'center',
  },
  highlight: {
    position: 'absolute',
    left: 0,
    bottom: 8,
    height: 22,
    borderRadius: 3,
    backgroundColor: colors.amber,
  },
  word: {
    fontSize: 46,
    color: colors.paper,
    fontFamily: fonts.displayBold,
    paddingHorizontal: 4,
  },
  tagline: {
    marginTop: 18,
    fontSize: 12,
    letterSpacing: 3,
    color: colors.amber,
    fontFamily: fonts.mono,
  },
});
