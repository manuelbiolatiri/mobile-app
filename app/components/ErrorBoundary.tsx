import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => {
  const { token } = useSelector((state: RootState) => state.auth);

  const handleGoHome = () => {
    if (token) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops! Something went wrong</Text>
      <Text style={styles.subtitle}>Don't worry, it's not your fault</Text>
      <Text style={styles.error}>{error.message}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.resetButton]} 
          onPress={resetError}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.homeButton]} 
          onPress={handleGoHome}
        >
          <Text style={styles.buttonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CustomErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const handleError = (error: Error) => {
    // Log the error to your error reporting service
    console.error('Caught error:', error);
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  error: {
    fontSize: 14,
    color: '#DC2626',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#2563EB',
  },
  homeButton: {
    backgroundColor: '#4B5563',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CustomErrorBoundary; 