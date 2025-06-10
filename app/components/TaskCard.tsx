import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { Task, TaskPriority } from '../services/api';

interface TaskCardProps {
  task: Task;
  onComplete: () => void;
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.HIGH:
      return '#EF4444'; // red
    case TaskPriority.MEDIUM:
      return '#F59E0B'; // amber
    case TaskPriority.LOW:
      return '#10B981'; // green
    default:
      return '#6B7280'; // gray
  }
};

export default function TaskCard({ task, onComplete }: TaskCardProps) {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.titleContainer}>
          <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
          <Text variant="titleMedium" style={styles.title}>{task.title}</Text>
        </View>
        {task.description && (
          <Text variant="bodyMedium" style={styles.description}>
            {task.description}
          </Text>
        )}
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <IconButton
          icon="check-circle-outline"
          onPress={onComplete}
          mode="contained"
          containerColor="#E5E7EB"
        />
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  priorityIndicator: {
    width: 4,
    height: 16,
    borderRadius: 2,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontWeight: '600',
  },
  description: {
    color: '#6B7280',
    marginLeft: 12,
  },
  actions: {
    justifyContent: 'flex-end',
    paddingRight: 8,
  },
}); 