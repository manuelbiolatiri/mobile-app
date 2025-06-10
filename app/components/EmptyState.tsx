import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export default function EmptyState({ title, message, icon = 'clipboard-text-outline' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={64} color="#9CA3AF" />
      <Text variant="titleLarge" style={styles.title}>{title}</Text>
      <Text variant="bodyMedium" style={styles.message}>{message}</Text>
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
    color: '#6B7280',
    textAlign: 'center',
  },
}); 