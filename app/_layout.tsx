import { Stack, Redirect } from 'expo-router';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RootState } from './store';
import { useEffect } from 'react';
import { initializeAuth } from './store/slices/authSlice';
import { AppDispatch } from './store';
import CustomErrorBoundary from './components/ErrorBoundary';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <CustomErrorBoundary>
        <RootLayoutNav />
      </CustomErrorBoundary>
    </Provider>
  );
}

function RootLayoutNav() {
  const dispatch = useDispatch<AppDispatch>();
  const { token, isInitialized, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Show loading screen while initializing auth state
  if (!isInitialized || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#ffffff' }
        }}
      >
        {/* Public routes */}
        <Stack.Screen 
          name="(public)" 
          options={{ 
            headerShown: false,
            animation: 'fade'
          }} 
        />
        
        {/* Auth routes */}
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }} 
        />
        
        {/* Protected routes */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            gestureEnabled: false
          }}
        />

        {/* Handle authentication redirect */}
        {!token && <Redirect href="/" />}
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
