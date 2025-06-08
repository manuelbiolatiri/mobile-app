import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type RepeatOption = 'daily' | 'weekly' | 'monthly' | 'custom';
type WeekDay = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';

interface CronBuilderProps {
  value?: string;
  onChange: (cronExpression: string) => void;
}

export default function CronBuilder({ value, onChange }: CronBuilderProps) {
  const [repeatOption, setRepeatOption] = useState<RepeatOption>('daily');
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedDate, setSelectedDate] = useState(1);

  const weekDays: WeekDay[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  useEffect(() => {
    let cronExp = '';
    switch (repeatOption) {
      case 'daily':
        cronExp = `${selectedMinute} ${selectedHour} * * *`;
        break;
      case 'weekly':
        if (selectedDays.length > 0) {
          const days = selectedDays.map(day => weekDays.indexOf(day)).join(',');
          cronExp = `${selectedMinute} ${selectedHour} * * ${days}`;
        }
        break;
      case 'monthly':
        cronExp = `${selectedMinute} ${selectedHour} ${selectedDate} * *`;
        break;
      case 'custom':
        // For custom, we'll just use daily for now
        cronExp = `${selectedMinute} ${selectedHour} * * *`;
        break;
    }
    onChange(cronExp);
  }, [repeatOption, selectedDays, selectedHour, selectedMinute, selectedDate]);

  const toggleDay = (day: WeekDay) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Repeat</Text>
      
      <View style={styles.optionsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['daily', 'weekly', 'monthly', 'custom'] as RepeatOption[]).map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                repeatOption === option && styles.optionButtonActive
              ]}
              onPress={() => setRepeatOption(option)}
            >
              <Text style={[
                styles.optionText,
                repeatOption === option && styles.optionTextActive
              ]}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {repeatOption === 'weekly' && (
        <View style={styles.weekDaysContainer}>
          <Text style={styles.sublabel}>Select Days</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  selectedDays.includes(day) && styles.dayButtonActive
                ]}
                onPress={() => toggleDay(day)}
              >
                <Text style={[
                  styles.dayText,
                  selectedDays.includes(day) && styles.dayTextActive
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {repeatOption === 'monthly' && (
        <View style={styles.datePickerContainer}>
          <Text style={styles.sublabel}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateButton,
                  selectedDate === date && styles.dateButtonActive
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text style={[
                  styles.dateText,
                  selectedDate === date && styles.dateTextActive
                ]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.timeContainer}>
        <Text style={styles.sublabel}>Select Time</Text>
        <View style={styles.timePickerContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hours.map((hour) => (
              <TouchableOpacity
                key={hour}
                style={[
                  styles.timeButton,
                  selectedHour === hour && styles.timeButtonActive
                ]}
                onPress={() => setSelectedHour(hour)}
              >
                <Text style={[
                  styles.timeText,
                  selectedHour === hour && styles.timeTextActive
                ]}>
                  {hour.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.timeSeparator}>:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {minutes.map((minute) => (
              <TouchableOpacity
                key={minute}
                style={[
                  styles.timeButton,
                  selectedMinute === minute && styles.timeButtonActive
                ]}
                onPress={() => setSelectedMinute(minute)}
              >
                <Text style={[
                  styles.timeText,
                  selectedMinute === minute && styles.timeTextActive
                ]}>
                  {minute.toString().padStart(2, '0')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 8,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  optionButtonActive: {
    backgroundColor: '#2563EB',
  },
  optionText: {
    fontSize: 14,
    color: '#4B5563',
  },
  optionTextActive: {
    color: 'white',
  },
  weekDaysContainer: {
    marginBottom: 16,
  },
  dayButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dayButtonActive: {
    backgroundColor: '#2563EB',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  dayTextActive: {
    color: 'white',
  },
  datePickerContainer: {
    marginBottom: 16,
  },
  dateButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dateButtonActive: {
    backgroundColor: '#2563EB',
  },
  dateText: {
    fontSize: 14,
    color: '#4B5563',
  },
  dateTextActive: {
    color: 'white',
  },
  timeContainer: {
    marginBottom: 16,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  timeButtonActive: {
    backgroundColor: '#2563EB',
  },
  timeText: {
    fontSize: 16,
    color: '#4B5563',
  },
  timeTextActive: {
    color: 'white',
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4B5563',
    marginHorizontal: 8,
  },
}); 