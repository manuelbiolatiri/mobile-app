import React, { useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import {
  startTimer,
  pauseTimer,
  resetTimer,
  tick,
  completePomodoro,
  completeBreak,
} from '../../store/slices/pomodoroSlice';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const TIMER_SIZE = width * 0.7;
const STROKE_WIDTH = 10;
const RADIUS = (TIMER_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function PomodoroScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isRunning,
    currentPhase,
    timeRemaining,
    pomodorosUntilLongBreak,
    settings,
  } = useSelector((state: RootState) => state.pomodoro);

  const totalTime = currentPhase === 'work'
    ? settings.workDuration * 60
    : currentPhase === 'shortBreak'
      ? settings.shortBreakDuration * 60
      : settings.longBreakDuration * 60;

  const progress = 1 - (timeRemaining / totalTime);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTimerComplete = useCallback(() => {
    if (currentPhase === 'work') {
      dispatch(completePomodoro());
    } else {
      dispatch(completeBreak());
    }
  }, [currentPhase, dispatch]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch(tick());
      }, 1000);
    } else if (timeRemaining === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, dispatch, handleTimerComplete]);

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'work':
        return '#2563EB';
      case 'shortBreak':
        return '#10B981';
      case 'longBreak':
        return '#8B5CF6';
      default:
        return '#2563EB';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Pomodoro Timer</Text>
          <View style={styles.headerButtons}>
            <Link href="/(tabs)/pomodoro/stats" asChild>
              <TouchableOpacity style={styles.headerButton}>
                <FontAwesome name="bar-chart" size={24} color="#6B7280" />
              </TouchableOpacity>
            </Link>
            <Link href="/(tabs)/pomodoro/settings" asChild>
              <TouchableOpacity style={styles.headerButton}>
                <FontAwesome name="cog" size={24} color="#6B7280" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <View style={styles.phaseContainer}>
          <Text style={[styles.phaseText, { color: getPhaseColor() }]}>
            {currentPhase === 'work' ? 'Focus Time' : currentPhase === 'shortBreak' ? 'Short Break' : 'Long Break'}
          </Text>
          {currentPhase === 'work' && (
            <Text style={styles.pomodoroCount}>
              Pomodoro #{settings.longBreakInterval - pomodorosUntilLongBreak + 1}
            </Text>
          )}
        </View>

        <View style={styles.timerContainer}>
          <Svg width={TIMER_SIZE} height={TIMER_SIZE}>
            {/* Background circle */}
            <Circle
              cx={TIMER_SIZE / 2}
              cy={TIMER_SIZE / 2}
              r={RADIUS}
              stroke="#E5E7EB"
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            {/* Progress circle */}
            <Circle
              cx={TIMER_SIZE / 2}
              cy={TIMER_SIZE / 2}
              r={RADIUS}
              stroke={getPhaseColor()}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              transform={`rotate(-90 ${TIMER_SIZE / 2} ${TIMER_SIZE / 2})`}
            />
          </Svg>
          <View style={styles.timerTextContainer}>
            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.resetButton]}
            onPress={() => dispatch(resetTimer())}
          >
            <FontAwesome name="refresh" size={24} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.mainButton]}
            onPress={() => dispatch(isRunning ? pauseTimer() : startTimer())}
          >
            <FontAwesome
              name={isRunning ? "pause" : "play"}
              size={32}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.skipButton]}
            onPress={handleTimerComplete}
          >
            <FontAwesome name="step-forward" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 16,
  },
  phaseContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  pomodoroCount: {
    fontSize: 16,
    color: '#6B7280',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#111827',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  mainButton: {
    backgroundColor: '#2563EB',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  resetButton: {
    backgroundColor: '#F3F4F6',
  },
  skipButton: {
    backgroundColor: '#F3F4F6',
  },
}); 