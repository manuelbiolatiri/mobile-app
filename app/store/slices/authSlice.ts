import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, AuthResponse, LoginDto, RegisterDto, User } from '../../services/api';
import { router } from 'expo-router';

// Constants
const AUTH_TOKEN_KEY = '@MyPadi:authToken';
const USER_DATA_KEY = '@MyPadi:userData';

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
        const user = JSON.parse(userData) as User;
        if (!user.id || !user.email) {
          await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
          return { token: null, user: null };
        }
        return { token, user };
      }

      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      return { token: null, user: null };
    } catch (error) {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      return rejectWithValue('Failed to initialize auth state');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginDto, { rejectWithValue }) => {
    try {
      console.log('🔑 Starting login process...');
      const response = await authApi.login(credentials);
      
      if (!response.user || !response.token) {
        throw new Error('Invalid response from server');
      }

      // Store user data
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
      console.log('✅ Login successful, redirecting...');

      return response;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      
      // Extract the most user-friendly error message
      const errorMessage = error.message === 'Network Error' 
        ? 'Unable to connect to server. Please check your internet connection.'
        : error.message || 'Login failed';
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterDto, { rejectWithValue }) => {
    try {
      console.log('📝 Starting registration process...');
      const response = await authApi.register(userData);
      
      if (!response.user || !response.token) {
        throw new Error('Invalid response from server');
      }

      // Store user data
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
      console.log('✅ Registration successful, redirecting...');

      return response;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🚪 Starting logout process...');
      await authApi.logout();
      return true;
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      return rejectWithValue(error.message || 'Logout failed');
    } finally {
      // Always clear local storage on logout attempt
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize cases
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isInitialized = true;
        state.error = null;

        // Redirect based on auth state
        if (action.payload.token && action.payload.user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)/login');
        }
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        router.replace('/(auth)/login');
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
        state.error = null;
        
        // Use setTimeout to ensure state is updated before navigation
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 100);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
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
        state.error = null;
        
        // Use setTimeout to ensure state is updated before navigation
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 100);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
      })
      
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isLoading = false;
        state.error = null;
        router.replace('/(auth)/login');
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        // Still clear the state even if the API call fails
        state.user = null;
        state.token = null;
        router.replace('/(auth)/login');
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;