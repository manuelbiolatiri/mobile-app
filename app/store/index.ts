import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import todoReducer from './slices/todoSlice';
import pomodoroReducer from './slices/pomodoroSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    pomodoro: pomodoroReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const storeExports = {
  store,
};

export default storeExports;