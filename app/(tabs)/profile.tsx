import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
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
          },
          style: "destructive"
        }
      ]
    );
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const firstLetter = user?.firstName ? user.firstName[0].toUpperCase() : 'U';

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <FontAwesome name="user-circle" size={80} color="#4B5563" />
          </View>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome name="user" size={20} color="#4B5563" />
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <FontAwesome name="chevron-right" size={14} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome name="bell" size={20} color="#4B5563" />
            <Text style={styles.menuItemText}>Notifications</Text>
            <FontAwesome name="chevron-right" size={14} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome name="lock" size={20} color="#4B5563" />
            <Text style={styles.menuItemText}>Privacy</Text>
            <FontAwesome name="chevron-right" size={14} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome name="question-circle" size={20} color="#4B5563" />
            <Text style={styles.menuItemText}>Help & Support</Text>
            <FontAwesome name="chevron-right" size={14} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <FontAwesome name="sign-out" size={20} color="#DC2626" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginTop: 'auto',
  },
  logoutButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
});