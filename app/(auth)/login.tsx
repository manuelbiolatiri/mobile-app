import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, googleAuth } from '../store/slices/authSlice';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_CLIENT_ID } from '../constants/Config';
import { AppDispatch, RootState } from '../store';

WebBrowser.maybeCompleteAuthSession();

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    scopes: ['profile', 'email'],
  });
  
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  
  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);
  
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        dispatch(googleAuth(authentication.accessToken));
      }
    }
  }, [response, dispatch]);
  
  const onSubmit = (data: LoginFormData) => {
    dispatch(login(data)).unwrap()
      .then(() => {
        router.replace('/(tabs)/');
      })
      .catch((err) => {
        console.error('Login failed:', err);
      });
  };
  
  const handleGoogleLogin = async () => {
    await promptAsync();
  };
  
  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold mb-6 text-center">Welcome Back</Text>
      <Text className="text-gray-500 text-center mb-8">Login to continue using the app</Text>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-2 font-medium">Email</Text>
        <Controller
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Invalid email address'
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-gray-100 p-4 rounded-md"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="email"
        />
        {errors.email && <Text className="text-red-500 mt-1">{errors.email.message}</Text>}
      </View>
      
      <View className="mb-6">
        <Text className="text-gray-700 mb-2 font-medium">Password</Text>
        <Controller
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-gray-100 p-4 rounded-md"
              placeholder="Enter your password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="password"
        />
        {errors.password && <Text className="text-red-500 mt-1">{errors.password.message}</Text>}
      </View>
      
      <TouchableOpacity 
        className="mb-4 bg-blue-500 p-4 rounded-md"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-bold">Login</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="mb-6 bg-white border border-gray-300 p-4 rounded-md flex-row justify-center items-center"
        onPress={handleGoogleLogin}
        disabled={!request || isLoading}
      >
        <Text className="text-center font-medium">Sign in with Google</Text>
      </TouchableOpacity>
      
      <View className="flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text className="text-blue-500 font-bold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}