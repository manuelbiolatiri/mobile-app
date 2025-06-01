import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser, googleAuth } from '../store/slices/authSlice';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_CLIENT_ID } from '../constants/Config';
import { AppDispatch, RootState } from '../store';

WebBrowser.maybeCompleteAuthSession();

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    scopes: ['profile', 'email'],
  });
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  
  const password = watch('password');
  
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
  
  const onSubmit = (data: RegisterFormData) => {
    const { name, email, password } = data;
    dispatch(registerUser({ name, email, password })).unwrap()
      .then(() => {
        router.replace('/(tabs)/');
      })
      .catch((err) => {
        console.error('Registration failed:', err);
      });
  };
  
  const handleGoogleSignup = async () => {
    await promptAsync();
  };
  
  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold mb-6 text-center">Create Account</Text>
      <Text className="text-gray-500 text-center mb-8">Sign up to get started</Text>
      
      <View className="mb-4">
        <Text className="text-gray-700 mb-2 font-medium">Name</Text>
        <Controller
          control={control}
          rules={{
            required: 'Name is required',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-gray-100 p-4 rounded-md"
              placeholder="Enter your name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="name"
        />
        {errors.name && <Text className="text-red-500 mt-1">{errors.name.message}</Text>}
      </View>
      
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
      
      <View className="mb-4">
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
              placeholder="Create a password"
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
      
      <View className="mb-6">
        <Text className="text-gray-700 mb-2 font-medium">Confirm Password</Text>
        <Controller
          control={control}
          rules={{
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-gray-100 p-4 rounded-md"
              placeholder="Confirm your password"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="confirmPassword"
        />
        {errors.confirmPassword && <Text className="text-red-500 mt-1">{errors.confirmPassword.message}</Text>}
      </View>
      
      <TouchableOpacity 
        className="mb-4 bg-blue-500 p-4 rounded-md"
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-bold">Sign Up</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        className="mb-6 bg-white border border-gray-300 p-4 rounded-md flex-row justify-center items-center"
        onPress={handleGoogleSignup}
        disabled={!request || isLoading}
      >
        <Text className="text-center font-medium">Sign up with Google</Text>
      </TouchableOpacity>
      
      <View className="flex-row justify-center">
        <Text className="text-gray-600">Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text className="text-blue-500 font-bold">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}