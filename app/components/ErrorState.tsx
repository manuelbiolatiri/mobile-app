import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#EF4444" />
      <Text variant="titleLarge" style={styles.title}>Oops!</Text>
      <Text variant="bodyMedium" style={styles.message}>{message}</Text>
      <Button
        mode="contained"
        onPress={onRetry}
        style={styles.button}
      >
        Try Again
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    minHeight: 300,
  },
  title: {
    marginTop: 16,
    color: '#374151',
    fontWeight: '600',
  },
  message: {
    marginTop: 8,
    marginBottom: 24,
    color: '#6B7280',
    textAlign: 'center',
  },
  button: {
    minWidth: 120,
  },
}); 