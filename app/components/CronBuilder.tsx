import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

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
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [customRepeatInterval, setCustomRepeatInterval] = useState(1);
  const [customRepeatUnit, setCustomRepeatUnit] = useState('day');
  const [customMonthDay, setCustomMonthDay] = useState(1);
  const [customYearMonth, setCustomYearMonth] = useState(1);

  const weekDays: WeekDay[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const customUnits = [
    { label: 'Day(s)', value: 'day' },
    { label: 'Week(s)', value: 'week' },
    { label: 'Month(s)', value: 'month' },
    { label: 'Year(s)', value: 'year' },
  ];

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
        } else {
          cronExp = `${selectedMinute} ${selectedHour} * * *`;
        }
        break;
      case 'monthly':
        if (selectedDates.length > 0) {
          const dates = selectedDates.sort((a, b) => a - b).join(',');
          cronExp = `${selectedMinute} ${selectedHour} ${dates} * *`;
        } else {
          cronExp = `${selectedMinute} ${selectedHour} * * *`;
        }
        break;
      case 'custom': {
        const interval = customRepeatInterval > 0 ? customRepeatInterval : 1;
        switch (customRepeatUnit) {
          case 'day':
            cronExp = `${selectedMinute} ${selectedHour} */${interval} * *`;
            break;
          case 'week': {
            // Every X weeks, on the selected days (if any, otherwise any day)
            if (selectedDays.length > 0) {
              const days = selectedDays.map(day => weekDays.indexOf(day)).join(',');
              cronExp = `${selectedMinute} ${selectedHour} * * ${days}`;
            } else {
              cronExp = `${selectedMinute} ${selectedHour} * * *`;
            }
            // Note: Standard cron does not support "every X weeks" natively, so this is a best effort.
            break;
          }
          case 'month': {
            // Every X months, on the selected day of the month
            const day = customMonthDay > 0 && customMonthDay <= 31 ? customMonthDay : 1;
            cronExp = `${selectedMinute} ${selectedHour} ${day} */${interval} *`;
            break;
          }
          case 'year': {
            // Every X years, on the selected day of the month and month of the year
            const day = customMonthDay > 0 && customMonthDay <= 31 ? customMonthDay : 1;
            const month = customYearMonth > 0 && customYearMonth <= 12 ? customYearMonth : 1;
            cronExp = `${selectedMinute} ${selectedHour} ${day} ${month} *`;
            break;
          }
          default:
            cronExp = `${selectedMinute} ${selectedHour} * * *`;
            break;
        }
        break;
      }
    }
    onChange(cronExp);
  }, [repeatOption, selectedDays, selectedHour, selectedMinute, selectedDates, customRepeatInterval, customRepeatUnit, customMonthDay, customYearMonth]);

  const toggleDay = (day: WeekDay) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedHour(date.getHours());
      setSelectedMinute(date.getMinutes());
      setShowTimePicker(false);
    }
  };

  const formatTime = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
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
          <Text style={styles.sublabel}>Select Dates</Text>
          <View style={styles.dateGridContainer}>
            {dates.map((date) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateGridButton,
                  selectedDates.includes(date) && styles.dateGridButtonActive
                ]}
                onPress={() => {
                  setSelectedDates(prev => 
                    prev.includes(date) 
                      ? prev.filter(d => d !== date)
                      : [...prev, date]
                  );
                }}
              >
                <Text style={[
                  styles.dateGridText,
                  selectedDates.includes(date) && styles.dateGridTextActive
                ]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {repeatOption === 'custom' && (
        <View style={styles.inputContainer}>
          <Text style={styles.sublabel}>Repeat Every</Text>
          <View style={styles.customRepeatRow}>
            <TextInput
              style={styles.customRepeatInput}
              keyboardType="numeric"
              maxLength={4}
              onChangeText={(text) => {
                const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
                setCustomRepeatInterval(isNaN(num) || num <= 0 ? 1 : num);
              }}
              value={customRepeatInterval.toString()}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: 8 }}>
              {customUnits.map((unit) => (
                <TouchableOpacity
                  key={unit.value}
                  style={[
                    styles.customUnitButton,
                    customRepeatUnit === unit.value && styles.customUnitButtonActive
                  ]}
                  onPress={() => setCustomRepeatUnit(unit.value)}
                >
                  <Text style={[
                    styles.customUnitText,
                    customRepeatUnit === unit.value && styles.customUnitTextActive
                  ]}>
                    {unit.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* For week: select days */}
          {customRepeatUnit === 'week' && (
            <View style={styles.weekDaysContainer}>
              <Text style={styles.sublabel}>On Days</Text>
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

          {/* For month: select day of month */}
          {customRepeatUnit === 'month' && (
            <View style={styles.datePickerContainer}>
              <Text style={styles.sublabel}>On Day</Text>
              <View style={styles.dropdownContainer}>
                <Picker
                  selectedValue={dates.includes(customMonthDay) ? customMonthDay : 1}
                  onValueChange={(itemValue: number) => setCustomMonthDay(itemValue)}
                  dropdownIconColor="#2563EB"
                >
                  <Picker.Item label="Select..." value={0} />
                  {dates.map((date) => (
                    <Picker.Item key={date} label={date.toString()} value={date} />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {/* For year: select day of month and month */}
          {customRepeatUnit === 'year' && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sublabel}>On Day</Text>
                <View style={styles.dropdownContainer}>
                  <Picker
                    selectedValue={dates.includes(customMonthDay) ? customMonthDay : 1}
                    onValueChange={(itemValue: number) => setCustomMonthDay(itemValue)}
                    dropdownIconColor="#2563EB"
                  >
                    <Picker.Item label="Select..." value={0} />
                    {dates.map((date) => (
                      <Picker.Item key={date} label={date.toString()} value={date} />
                    ))}
                  </Picker>
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.sublabel}>Of Month</Text>
                <View style={styles.dropdownContainer}>
                  <Picker
                    selectedValue={customYearMonth >= 1 && customYearMonth <= 12 ? customYearMonth : 1}
                    onValueChange={(itemValue: number) => setCustomYearMonth(itemValue)}
                    dropdownIconColor="#2563EB"
                  >
                    <Picker.Item label="Select..." value={0} />
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <Picker.Item key={month} label={month.toString()} value={month} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.timeContainer}>
        <Text style={styles.sublabel}>Select Time</Text>
        <TouchableOpacity
          style={styles.timeButtonLarge}
          onPress={() => setShowTimePicker(true)}
        >
          <FontAwesome name="clock-o" size={20} color="#4B5563" />
          <Text style={styles.timeButtonText}>
            {formatTime(selectedHour, selectedMinute)}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={new Date(2000, 0, 1, selectedHour, selectedMinute)}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
            is24Hour={true}
          />
        )}
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
  dateGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 4,
  },
  dateGridButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  dateGridButtonActive: {
    backgroundColor: '#2563EB',
  },
  dateGridText: {
    fontSize: 14,
    color: '#4B5563',
  },
  dateGridTextActive: {
    color: 'white',
  },
  timeContainer: {
    marginBottom: 16,
  },
  timeButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#4B5563',
  },
  inputContainer: {
    marginBottom: 16,
  },
  customRepeatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  customRepeatInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    textAlign: 'right',
    paddingRight: 8,
  },
  customUnitButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  customUnitButtonActive: {
    backgroundColor: '#2563EB',
  },
  customUnitText: {
    fontSize: 14,
    color: '#4B5563',
  },
  customUnitTextActive: {
    color: 'white',
  },
  dropdownContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
}); 