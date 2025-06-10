import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Simple, clear base URL - change this to your actual API URL
const BASE_URL = 'http://localhost:9000/v1';

const AUTH_TOKEN_KEY = '@MyPadi:authToken';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string | null;
  profilePicture: string | null;
  role: UserRole;
  active: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  token: string;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  repeat?: boolean;
  cronExpression?: string;
  snooze?: boolean;
  snoozeCount?: number;
  startDate?: Date;
  endDate?: Date;
  priority?: TaskPriority;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  repeat: boolean;
  cronExpression?: string;
  snooze: boolean;
  snoozeCount?: number;
  startDate?: Date;
  endDate?: Date;
  priority: TaskPriority;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  perPage: number;
  total: number;
  count: number;
  currentPage: number;
  totalPages: number;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
  timeoutErrorMessage: 'Request timed out',
});

// Add request interceptor for logging
api.interceptors.request.use(
  async (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`, {
      data: config.data,
      headers: config.headers
    });
    
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `JWT ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Handle token expiration and errors
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response from ${response.config.url}:`, {
      status: response.status,
      data: response.data
    });
    return response.data;
  },
  async (error) => {
    // Log the full error for debugging
    console.error('API Error:', {
      config: error.config,
      code: error.code,
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.config.url);
      throw new Error('Request timed out. Please try again.');
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }

    // Handle unauthorized errors
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, '@MyPadi:userData']);
      throw new Error('Session expired. Please login again.');
    }

    // Extract error message from response
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';

    throw new Error(errorMessage);
  }
);

const setAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    // Update axios default headers
    api.defaults.headers.common['Authorization'] = `JWT ${token}`;
  } catch (error) {
    console.error('Error setting auth token:', error);
    throw new Error('Failed to set authentication token');
  }
};

const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    // Remove auth header
    delete api.defaults.headers.common['Authorization'];
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

interface LoginResponse {
  user: User;
  accessToken: string;
}

interface DirectUserResponse extends User {
  accessToken: string;
}

export const authApi = {
  login: async (payload: LoginDto): Promise<AuthResponse> => {
    console.log("👤 Attempting login with:", { email: payload.email });
    try {
      const res = await api.post('/auth/login', payload);

      const data = res;
      
      // Log the raw response for debugging
      console.log('Raw login response:', data);

      // Handle direct user response
      if ('id' in data) {
        if (!data.accessToken) {
          throw new Error('No authentication token received');
        }

        await setAuthToken(data.accessToken);
        console.log("✅ Login successful (direct user response)");

        return {
          user: data,
          token: data.accessToken
        };
      }

      // Handle wrapped response
    //   const typedResponse = response as LoginResponse;
      if (!data || !data.accessToken) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid server response');
      }

      await setAuthToken(data.accessToken);
      console.log("✅ Login successful (wrapped response)");

      return {
        user: data,
        token: data.accessToken
      };
    } catch (error: any) {
      console.error("❌ Login error:", {
        message: error.message,
        cause: error.cause,
        stack: error.stack
      });

      // Re-throw with a user-friendly message
      throw new Error(error.message || 'Login failed');
    }
  },

  logout: async (): Promise<void> => {
    try {
      // Call logout endpoint if your API has one
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clear local auth data, even if the API call fails
      await clearAuthToken();
      await AsyncStorage.removeItem('@MyPadi:userData');
    }
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    try {
      const responseData = await api.post<LoginResponse>('/auth/register', data);
      const response = responseData.data;
      
      if (!response || !response.user) {
        throw new Error('No response data or user object received');
      }

      const user = response.user;
      const token = user.accessToken || response.accessToken;
      
      if (!token) {
        throw new Error('No authentication token received');
      }

      // Set the auth token for future requests
      await setAuthToken(token);

      return {
        user: {
          ...user,
          token: token
        },
        token: token
      };
    } catch (error: any) {
      throw {
        message: error.message || 'Registration failed',
        status: error.status
      };
    }
  },

  forgotPassword: async (email: string): Promise<void> => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (error: any) {
      throw {
        message: error.message || 'Password reset failed',
        status: error.status
      };
    }
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    try {
      await api.post('/auth/reset-password', { token, password });
    } catch (error: any) {
      throw {
        message: error.message || 'Password reset failed',
        status: error.status
      };
    }
  },
};

export const taskApi = {
  createTask: async (data: CreateTaskDto): Promise<Task> => {
    const response = await api.post('/tasks/create', data);
    return response.data;
  },

  getTasks: async (params?: {
    page?: number;
    perPage?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    status?: 'all' | 'active' | 'completed';
    priority?: TaskPriority;
  }): Promise<PaginatedResponse<Task>> => {
    return await api.get('/tasks', {
      params: {
        page: params?.page || 1,
        pageSize: params?.perPage || 10,
        sort: params?.sort,
        order: params?.order,
        status: params?.status,
        priority: params?.priority,
      }
    });
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  updateTask: async (id: string, data: Partial<CreateTaskDto>): Promise<Task> => {
    const response = await api.patch(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  completeTask: async (id: string): Promise<Task> => {
    const response = await api.post(`/tasks/${id}/complete`);
    return response.data;
  },
};

// Test login function
export const testLogin = async () => {
  try {
    console.log('Starting test login...');
    const credentials = {
      email: 'manuel@gmail.com',
      password: 'qwerty123',
    };

    console.log('Using credentials:', credentials);
    const response = await authApi.login(credentials);
    console.log('Login successful:', {
      hasUser: !!response.user,
      hasToken: !!response.accessToken,
      userData: response.user
    });
    return response;
  } catch (error) {
    console.error('Test login failed:', error);
    throw error;
  }
};

export default api; 