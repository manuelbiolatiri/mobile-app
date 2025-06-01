import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { AppDispatch, RootState } from '../store';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => {
            dispatch(logout());
            router.replace('/login');
          },
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar style="auto" />
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Profile</Text>
        
        <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <View className="items-center mb-4">
            <View className="w-20 h-20 bg-blue-500 rounded-full justify-center items-center mb-3">
              <Text className="text-white text-2xl font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <Text className="text-xl font-bold">{user?.name || 'User'}</Text>
            <Text className="text-gray-500">{user?.email || 'user@example.com'}</Text>
          </View>
        </View>
        
        <View className="bg-white rounded-lg shadow-sm mb-6">
          <TouchableOpacity 
            className="p-4 border-b border-gray-100 flex-row items-center"
            onPress={() => router.push('/settings')}
          >
            <FontAwesome name="cog" size={20} color="#6B7280" className="mr-3" />
            <Text className="text-gray-800 ml-3">Settings</Text>
            <FontAwesome name="chevron-right" size={16} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="p-4 border-b border-gray-100 flex-row items-center"
            onPress={() => {/* Open help/support */}}
          >
            <FontAwesome name="question-circle" size={20} color="#6B7280" className="mr-3" />
            <Text className="text-gray-800 ml-3">Help & Support</Text>
            <FontAwesome name="chevron-right" size={16} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="p-4 border-b border-gray-100 flex-row items-center"
            onPress={() => {/* Open privacy policy */}}
          >
            <FontAwesome name="lock" size={20} color="#6B7280" className="mr-3" />
            <Text className="text-gray-800 ml-3">Privacy Policy</Text>
            <FontAwesome name="chevron-right" size={16} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="p-4 flex-row items-center"
            onPress={() => {/* Open terms of service */}}
          >
            <FontAwesome name="file-text-o" size={20} color="#6B7280" className="mr-3" />
            <Text className="text-gray-800 ml-3">Terms of Service</Text>
            <FontAwesome name="chevron-right" size={16} color="#9CA3AF" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          className="bg-red-500 p-4 rounded-md"
          onPress={handleLogout}
        >
          <Text className="text-white text-center font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}