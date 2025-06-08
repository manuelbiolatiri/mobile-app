import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Switch, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from './store/slices/taskSlice';
import { AppDispatch, RootState } from './store';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import CronBuilder from './components/CronBuilder';
import { TaskPriority } from './services/api';

type TaskFormData = {
  title: string;
  description: string;
  repeat: boolean;
  cronExpression?: string;
  snooze: boolean;
  snoozeCount?: number;
  startDate?: Date;
  endDate?: Date;
  priority: TaskPriority;
};

export default function CreateTaskScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.tasks);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  
  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: '',
      repeat: false,
      snooze: false,
      snoozeCount: 0,
      priority: TaskPriority.MEDIUM,
    }
  });
  
  const repeat = watch('repeat');
  const snooze = watch('snooze');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  
  const onSubmit = (data: TaskFormData) => {
    dispatch(createTask(data)).unwrap()
      .then(() => {
        router.back();
      })
      .catch((err) => {
        console.error('Failed to create task:', err);
      });
  };
  
  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Task</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Task Title</Text>
            <Controller
              control={control}
              rules={{
                required: 'Title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters'
                }
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Enter task title"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholderTextColor="#9CA3AF"
                />
              )}
              name="title"
            />
            {errors.title && (
              <Text style={styles.errorMessage}>{errors.title.message}</Text>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <Controller
              control={control}
              rules={{
                required: 'Description is required'
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter task description"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor="#9CA3AF"
                />
              )}
              name="description"
            />
            {errors.description && (
              <Text style={styles.errorMessage}>{errors.description.message}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Priority</Text>
            <Controller
              control={control}
              name="priority"
              render={({ field: { value, onChange } }) => (
                <View style={styles.priorityContainer}>
                  {Object.values(TaskPriority).map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityButton,
                        value === priority && styles.priorityButtonActive,
                        { backgroundColor: getPriorityColor(priority, value === priority) }
                      ]}
                      onPress={() => onChange(priority)}
                    >
                      <Text style={[
                        styles.priorityText,
                        value === priority && styles.priorityTextActive
                      ]}>
                        {priority}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Repeat Task</Text>
              <Controller
                control={control}
                name="repeat"
                render={({ field: { value, onChange } }) => (
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                    thumbColor={value ? '#2563EB' : '#9CA3AF'}
                  />
                )}
              />
            </View>
          </View>

          {repeat && (
            <Controller
              control={control}
              name="cronExpression"
              render={({ field: { onChange } }) => (
                <CronBuilder onChange={onChange} />
              )}
            />
          )}

          <View style={styles.inputContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Allow Snooze</Text>
              <Controller
                control={control}
                name="snooze"
                render={({ field: { value, onChange } }) => (
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                    thumbColor={value ? '#2563EB' : '#9CA3AF'}
                  />
                )}
              />
            </View>
          </View>

          {snooze && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Snooze Count</Text>
              <Controller
                control={control}
                name="snoozeCount"
                rules={{
                  min: {
                    value: 1,
                    message: 'Snooze count must be at least 1'
                  },
                  max: {
                    value: 5,
                    message: 'Maximum snooze count is 5'
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <View style={styles.snoozeContainer}>
                    {[1, 2, 3, 4, 5].map((count) => (
                      <TouchableOpacity
                        key={count}
                        style={[
                          styles.snoozeButton,
                          value === count && styles.snoozeButtonActive
                        ]}
                        onPress={() => onChange(count)}
                      >
                        <Text style={[
                          styles.snoozeText,
                          value === count && styles.snoozeTextActive
                        ]}>
                          {count}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowStartDate(true)}
            >
              <FontAwesome name="calendar" size={20} color="#4B5563" />
              <Text style={styles.dateButtonText}>
                {startDate ? startDate.toLocaleDateString() : 'Select start date'}
              </Text>
            </TouchableOpacity>
            {showStartDate && (
              <Controller
                control={control}
                name="startDate"
                render={({ field: { value, onChange } }) => (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event: DateTimePickerEvent, date?: Date) => {
                      setShowStartDate(false);
                      if (date) {
                        onChange(date);
                      }
                    }}
                    minimumDate={new Date()}
                  />
                )}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowEndDate(true)}
            >
              <FontAwesome name="calendar" size={20} color="#4B5563" />
              <Text style={styles.dateButtonText}>
                {endDate ? endDate.toLocaleDateString() : 'Select end date'}
              </Text>
            </TouchableOpacity>
            {showEndDate && (
              <Controller
                control={control}
                name="endDate"
                render={({ field: { value, onChange } }) => (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event: DateTimePickerEvent, date?: Date) => {
                      setShowEndDate(false);
                      if (date) {
                        onChange(date);
                      }
                    }}
                    minimumDate={startDate || new Date()}
                  />
                )}
              />
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Create Task</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getPriorityColor = (priority: TaskPriority, isActive: boolean) => {
  switch (priority) {
    case TaskPriority.HIGH:
      return isActive ? '#DC2626' : '#FEE2E2';
    case TaskPriority.MEDIUM:
      return isActive ? '#F59E0B' : '#FEF3C7';
    case TaskPriority.LOW:
      return isActive ? '#10B981' : '#D1FAE5';
    default:
      return isActive ? '#2563EB' : '#F3F4F6';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  errorMessage: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  priorityButtonActive: {
    borderWidth: 0,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityTextActive: {
    color: 'white',
  },
  snoozeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  snoozeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: '#F3F4F6',
  },
  snoozeButtonActive: {
    backgroundColor: '#2563EB',
  },
  snoozeText: {
    fontSize: 16,
    color: '#4B5563',
  },
  snoozeTextActive: {
    color: 'white',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#4B5563',
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 