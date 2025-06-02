import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { updateSettings } from '../../store/slices/pomodoroSlice';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

export default function PomodoroSettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.pomodoro.settings);

  const handleSettingChange = (key: keyof typeof settings, value: number | boolean) => {
    dispatch(updateSettings({ [key]: value }));
  };

  const SettingItem = ({ 
    title, 
    value, 
    onValueChange, 
    type = 'toggle'
  }: { 
    title: string; 
    value: number | boolean; 
    onValueChange: (value: number | boolean) => void;
    type?: 'toggle' | 'duration';
  }) => (
    <View style={styles.settingItem}>
      <Text style={styles.settingTitle}>{title}</Text>
      {type === 'toggle' ? (
        <Switch
          value={value as boolean}
          onValueChange={onValueChange}
          trackColor={{ false: '#D1D5DB', true: '#93C5FD' }}
          thumbColor={value ? '#2563EB' : '#F3F4F6'}
        />
      ) : (
        <View style={styles.durationControl}>
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => onValueChange(Math.max(1, (value as number) - 1))}
          >
            <FontAwesome name="minus" size={16} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.durationValue}>{value} min</Text>
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => onValueChange((value as number) + 1)}
          >
            <FontAwesome name="plus" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timer</Text>
          <View style={styles.card}>
            <SettingItem
              title="Work Duration"
              value={settings.workDuration}
              onValueChange={(value) => handleSettingChange('workDuration', value)}
              type="duration"
            />
            <SettingItem
              title="Short Break Duration"
              value={settings.shortBreakDuration}
              onValueChange={(value) => handleSettingChange('shortBreakDuration', value)}
              type="duration"
            />
            <SettingItem
              title="Long Break Duration"
              value={settings.longBreakDuration}
              onValueChange={(value) => handleSettingChange('longBreakDuration', value)}
              type="duration"
            />
            <SettingItem
              title="Long Break Interval"
              value={settings.longBreakInterval}
              onValueChange={(value) => handleSettingChange('longBreakInterval', value)}
              type="duration"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Automation</Text>
          <View style={styles.card}>
            <SettingItem
              title="Auto-start Breaks"
              value={settings.autoStartBreaks}
              onValueChange={(value) => handleSettingChange('autoStartBreaks', value)}
            />
            <SettingItem
              title="Auto-start Pomodoros"
              value={settings.autoStartPomodoros}
              onValueChange={(value) => handleSettingChange('autoStartPomodoros', value)}
            />
            <SettingItem
              title="Sound Enabled"
              value={settings.soundEnabled}
              onValueChange={(value) => handleSettingChange('soundEnabled', value)}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingTitle: {
    fontSize: 16,
    color: '#111827',
  },
  durationControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationValue: {
    fontSize: 16,
    color: '#111827',
    marginHorizontal: 12,
    minWidth: 60,
    textAlign: 'center',
  },
}); 