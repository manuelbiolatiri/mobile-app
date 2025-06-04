import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../constants/Config';

// Constants
const AUTH_TOKEN_KEY = '@MyPadi:authToken';
const USER_DATA_KEY = '@MyPadi:userData';

// Dummy user for testing
const DUMMY_USER = {
  id: '1',
  email: 'test@mypadi.com',
  name: 'Test User',
  password: 'test123456',
};

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Initialize auth state from storage
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(AUTH_TOKEN_KEY),
        AsyncStorage.getItem(USER_DATA_KEY),
      ]);

      if (token && userData) {
        return {
          token,
          user: JSON.parse(userData),
        };
      }

      return { token: null, user: null };
    } catch (error) {
      return rejectWithValue('Failed to initialize auth state');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Mock authentication logic
      if (credentials.email === DUMMY_USER.email && credentials.password === DUMMY_USER.password) {
        const response = {
          user: {
            id: DUMMY_USER.id,
            email: DUMMY_USER.email,
            name: DUMMY_USER.name,
          },
          token: 'dummy_token_123456',
        };

        // Store auth data
        await Promise.all([
          AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token),
          AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user)),
        ]);

        return response;
      }

      return rejectWithValue('Invalid email or password');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
      }
      return rejectWithValue('Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      // Mock registration logic
      if (userData.email === DUMMY_USER.email) {
        return rejectWithValue('Email already exists');
      }

      const response = {
        user: {
          id: Math.random().toString(36).substr(2, 9),
          email: userData.email,
          name: userData.name,
        },
        token: 'dummy_token_' + Math.random().toString(36).substr(2, 9),
      };

      // Store auth data
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user)),
      ]);

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
      }
      return rejectWithValue('Registration failed');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      // Mock password reset
      if (email === DUMMY_USER.email) {
        return true;
      }
      return rejectWithValue('Email not found');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Password reset failed');
      }
      return rejectWithValue('Password reset failed');
    }
  }
);

export const googleAuth = createAsyncThunk(
  'auth/google',
  async (token: string, { rejectWithValue }) => {
    try {
      // Mock Google auth
      const response = {
        user: {
          id: 'google_' + Math.random().toString(36).substr(2, 9),
          email: 'google_user@example.com',
          name: 'Google User',
        },
        token: 'google_token_' + Math.random().toString(36).substr(2, 9),
      };

      // Store auth data
      await Promise.all([
        AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token),
        AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user)),
      ]);

      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Google authentication failed');
      }
      return rejectWithValue('Google authentication failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      // Clear storage
      AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize cases
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isInitialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
      })
      
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Reset password cases
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Google auth cases
      .addCase(googleAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;