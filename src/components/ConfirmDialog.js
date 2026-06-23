// On-brand confirmation sheet that slides up from the bottom, replacing the
// generic system alert. Used for destructive actions like deleting a task.
// Built with the core Modal + Animated APIs — no extra dependencies.
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Button from './Button';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) {
  const anim = useRef(new Animated.Value(0)).current; // 0 hidden -> 1 shown
  const [rendered, setRendered] = useState(visible);
  // Snapshot the text on open so it stays put during the close animation.
  const [content, setContent] = useState({ title, message, confirmLabel });

  useEffect(() => {
    if (visible) {
      setContent({ title, message, confirmLabel });
      setRendered(true);
      Animated.spring(anim, {
        toValue: 1,
        friction: 9,
        tension: 70,
        useNativeDriver: true,
      }).start();
    } else if (rendered) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setRendered(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!rendered) return null;

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [320, 0],
  });

  return (
    <Modal transparent visible={rendered} onRequestClose={onCancel} animationType="none">
      <View style={styles.root}>
        {/* Tap the dimmed backdrop to cancel */}
        <Animated.View style={[styles.scrim, { opacity: anim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.grabber} />
          <Text style={styles.title}>{content.title}</Text>
          {content.message ? (
            <Text style={styles.message}>{content.message}</Text>
          ) : null}

          <View style={styles.actions}>
            <Button
              title={cancelLabel}
              variant="secondary"
              onPress={onCancel}
              style={styles.btn}
            />
            <Button
              title={content.confirmLabel}
              variant="danger"
              onPress={onConfirm}
              style={styles.btn}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(32, 29, 26, 0.55)',
  },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderColor: colors.line,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    color: colors.ink,
    fontFamily: fonts.displayBold,
  },
  message: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  btn: {
    flex: 1,
  },
});
