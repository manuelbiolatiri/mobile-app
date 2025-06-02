import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
}

export interface PomodoroStats {
  completedPomodoros: number;
  totalFocusTime: number;
  dailyStats: {
    [date: string]: {
      pomodoros: number;
      focusTime: number;
    };
  };
}

interface PomodoroState {
  isRunning: boolean;
  currentPhase: 'work' | 'shortBreak' | 'longBreak';
  timeRemaining: number;
  pomodorosUntilLongBreak: number;
  selectedTaskId: string | null;
  settings: PomodoroSettings;
  stats: PomodoroStats;
}

const initialState: PomodoroState = {
  isRunning: false,
  currentPhase: 'work',
  timeRemaining: 25 * 60, // 25 minutes in seconds
  pomodorosUntilLongBreak: 4,
  selectedTaskId: null,
  settings: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: true,
    autoStartPomodoros: true,
    soundEnabled: true,
  },
  stats: {
    completedPomodoros: 0,
    totalFocusTime: 0,
    dailyStats: {},
  },
};

const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState,
  reducers: {
    startTimer: (state) => {
      state.isRunning = true;
    },
    pauseTimer: (state) => {
      state.isRunning = false;
    },
    resetTimer: (state) => {
      state.isRunning = false;
      state.timeRemaining = state.currentPhase === 'work' 
        ? state.settings.workDuration * 60
        : state.currentPhase === 'shortBreak'
          ? state.settings.shortBreakDuration * 60
          : state.settings.longBreakDuration * 60;
    },
    tick: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
    completePomodoro: (state) => {
      const today = new Date().toISOString().split('T')[0];
      
      // Update stats
      state.stats.completedPomodoros += 1;
      state.stats.totalFocusTime += state.settings.workDuration * 60;
      
      if (!state.stats.dailyStats[today]) {
        state.stats.dailyStats[today] = {
          pomodoros: 0,
          focusTime: 0,
        };
      }
      state.stats.dailyStats[today].pomodoros += 1;
      state.stats.dailyStats[today].focusTime += state.settings.workDuration * 60;
      
      // Update phase
      if (state.pomodorosUntilLongBreak === 1) {
        state.currentPhase = 'longBreak';
        state.pomodorosUntilLongBreak = state.settings.longBreakInterval;
      } else {
        state.currentPhase = 'shortBreak';
        state.pomodorosUntilLongBreak -= 1;
      }
      
      state.timeRemaining = state.currentPhase === 'longBreak'
        ? state.settings.longBreakDuration * 60
        : state.settings.shortBreakDuration * 60;
    },
    completeBreak: (state) => {
      state.currentPhase = 'work';
      state.timeRemaining = state.settings.workDuration * 60;
    },
    selectTask: (state, action: PayloadAction<string>) => {
      state.selectedTaskId = action.payload;
    },
    updateSettings: (state, action: PayloadAction<Partial<PomodoroSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
      
      // Update timeRemaining based on new settings if timer is not running
      if (!state.isRunning) {
        state.timeRemaining = state.currentPhase === 'work'
          ? state.settings.workDuration * 60
          : state.currentPhase === 'shortBreak'
            ? state.settings.shortBreakDuration * 60
            : state.settings.longBreakDuration * 60;
      }
    },
  },
});

export const {
  startTimer,
  pauseTimer,
  resetTimer,
  tick,
  completePomodoro,
  completeBreak,
  selectTask,
  updateSettings,
} = pomodoroSlice.actions;

export default pomodoroSlice.reducer; 