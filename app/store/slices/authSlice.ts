import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../constants/Config';

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
}

// Dummy user for testing
const DUMMY_USER = {
  id: '1',
  email: 'test@mypadi.com',
  name: 'Test User',
  password: 'test123456', // This is just for mock authentication
};

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Mock API calls (replace with real API calls once backend is ready)
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Mock authentication logic
      if (credentials.email === DUMMY_USER.email && credentials.password === DUMMY_USER.password) {
        return {
          user: {
            id: DUMMY_USER.id,
            email: DUMMY_USER.email,
            name: DUMMY_USER.name,
          },
          token: 'mock_token_123456',
        };
      } else {
        return rejectWithValue('Invalid email or password');
      }
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
      
      // Mock successful registration
      const mockResponse = {
        user: {
          id: '2', // Different ID from dummy user
          email: userData.email,
          name: userData.name,
        },
        token: 'mock_token_123456',
      };
      
      return mockResponse;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
      }
      return rejectWithValue('Registration failed');
    }
  }
);

export const googleAuth = createAsyncThunk(
  'auth/google',
  async (token: string, { rejectWithValue }) => {
    try {
      // In a real app, this would be an actual API call
      // const response = await axios.post(`${API_URL}/auth/google`, { token });
      
      // Mock response
      const mockResponse = {
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Google User',
        },
        token: 'mock_google_token_123456',
      };
      
      return mockResponse;
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