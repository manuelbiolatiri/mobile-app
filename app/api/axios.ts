import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/Config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized) - could implement token refresh here
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Could implement token refresh logic here
      // For now, we'll just log the user out
      await AsyncStorage.removeItem('token');
      // In a real app, you might want to redirect to login screen here
    }
    
    return Promise.reject(error);
  }
);

export default api;