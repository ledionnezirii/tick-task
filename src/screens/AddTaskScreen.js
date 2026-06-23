// Screen with the form to create a new task. Runs validation before saving
// and shows inline errors next to each field.
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import Input from '../components/Input';
import { useTasks } from '../context/TasksContext';
import { useToast } from '../context/ToastContext';
import { colors } from '../theme/colors';
import {
  DESCRIPTION_MAX,
  TITLE_MAX,
  isValid,
  validateTask,
} from '../utils/validation';

export default function AddTaskScreen({ navigation }) {
  const { addTask } = useTasks();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  const handleSave = () => {
    const nextErrors = validateTask({ title, description });
    setErrors(nextErrors);
    if (!isValid(nextErrors)) return;

    addTask({ title, description });
    navigation.goBack();
    showToast('Task added');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Input
            label="TITLE"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) setErrors((e) => ({ ...e, title: undefined }));
            }}
            placeholder="e.g. Buy groceries"
            error={errors.title}
            maxLength={TITLE_MAX}
            showCounter
          />

          <Input
            label="DESCRIPTION"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description)
                setErrors((e) => ({ ...e, description: undefined }));
            }}
            placeholder="Add a short description (optional)"
            error={errors.description}
            multiline
            maxLength={DESCRIPTION_MAX}
            showCounter
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title="Cancel"
            variant="secondary"
            onPress={() => navigation.goBack()}
            style={styles.footerBtn}
          />
          <Button title="Save task" onPress={handleSave} style={styles.footerBtn} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 22,
    paddingTop: 24,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 22,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.paper,
  },
  footerBtn: {
    flex: 1,
  },
});
