// Bottom toast / snackbar. Slides up, auto-dismisses, and can carry one action
// (e.g. "Undo"). Driven by ToastContext; not used directly by screens.
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function Toast({ toast, onHide }) {
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef(null);
  const insets = useSafeAreaInsets();

  const dismiss = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onHide();
    });
  };

  useEffect(() => {
    if (!toast) return undefined;
    anim.setValue(0);
    Animated.spring(anim, {
      toValue: 1,
      friction: 8,
      tension: 80,
      useNativeDriver: true,
    }).start();

    clearTimeout(timer.current);
    timer.current = setTimeout(dismiss, toast.actionLabel ? 4000 : 2600);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast?.id]);

  if (!toast) return null;

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [90, 0],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        { bottom: insets.bottom + 18, opacity: anim, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.toast}>
        <Text style={styles.message} numberOfLines={2}>
          {toast.message}
        </Text>
        {toast.actionLabel ? (
          <Pressable
            hitSlop={10}
            onPress={() => {
              if (toast.onAction) toast.onAction();
              dismiss();
            }}
          >
            <Text style={styles.action}>{toast.actionLabel.toUpperCase()}</Text>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 18,
    right: 18,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    backgroundColor: colors.ink,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  message: {
    flex: 1,
    color: colors.paper,
    fontSize: 15,
  },
  action: {
    color: colors.amber,
    fontSize: 12,
    letterSpacing: 1,
    fontFamily: fonts.monoBold,
  },
});
