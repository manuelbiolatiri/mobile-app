import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

export default function LoadingState() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text variant="bodyLarge" style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  text: {
    marginTop: 16,
    color: '#6B7280',
  },
}); 