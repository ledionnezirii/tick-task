// App entry point. Loads the brand fonts, then wraps the navigation tree with
// the providers it needs: safe-area handling, the status bar, and our tasks
// state provider. We hold rendering on a plain paper-colored view until the
// fonts are ready so the UI never flashes in the system font first.
import React, { useState } from 'react';
import { Platform, UIManager, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Fraunces_600SemiBold,
  Fraunces_700Bold,
} from '@expo-google-fonts/fraunces';
import {
  SpaceMono_400Regular,
  SpaceMono_700Bold,
  useFonts,
} from '@expo-google-fonts/space-mono';

import AppNavigator from './src/navigation/AppNavigator';
import SplashIntro from './src/components/SplashIntro';
import { TasksProvider } from './src/context/TasksContext';
import { ToastProvider } from './src/context/ToastContext';
import { colors } from './src/theme/colors';

// Enable smooth LayoutAnimation on older Android (no-op on the new architecture).
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [fontsLoaded] = useFonts({
    Fraunces_600SemiBold,
    Fraunces_700Bold,
    SpaceMono_400Regular,
    SpaceMono_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.ink }} />;
  }

  return (
    <SafeAreaProvider>
      <TasksProvider>
        <ToastProvider>
          <StatusBar style={introDone ? 'dark' : 'light'} />
          <AppNavigator />
          {!introDone && <SplashIntro onFinish={() => setIntroDone(true)} />}
        </ToastProvider>
      </TasksProvider>
    </SafeAreaProvider>
  );
}
