import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Button, ProgressBar, Chip } from 'react-native-paper';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { fetchTasks, completeTask } from '../store/actions/tasks';
import { AppDispatch } from '../store';
import EmptyState from '../components/EmptyState';
import TaskCard from '../components/TaskCard';

export default function MyTasksScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, isLoading } = useSelector((state: RootState) => state.tasks);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    await dispatch(fetchTasks());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  const handleTaskComplete = async (taskId: string) => {
    await dispatch(completeTask(taskId));
  };

  // Filter tasks
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  const upcomingTasks = activeTasks.slice(0, 3); // Show only next 3 tasks

  // Calculate metrics
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? completedTasks.length / totalTasks : 0;
  const currentStreak = 7; // This should be calculated from your backend
  const weeklyGoal = 20; // This should be configurable by user
  const weeklyCompleted = 12; // This should be calculated from your backend

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Stack.Screen
        options={{
          title: 'My Tasks',
          headerLargeTitle: true,
        }}
      />

      {/* Metrics Section */}
      <View style={styles.metricsContainer}>
        <Card style={styles.streakCard}>
          <Card.Content>
            <View style={styles.streakHeader}>
              <MaterialCommunityIcons name="fire" size={24} color="#F59E0B" />
              <Text variant="titleMedium" style={styles.streakText}>
                {currentStreak} Day Streak!
              </Text>
            </View>
            <Text variant="bodySmall" style={styles.streakSubtext}>
              Keep it up! You're doing great.
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.metricsGrid}>
          <Card style={styles.metricCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.metricValue}>
                {completedTasks.length}
              </Text>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Completed
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.metricValue}>
                {activeTasks.length}
              </Text>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Active
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.metricCard}>
            <Card.Content>
              <Text variant="titleLarge" style={styles.metricValue}>
                {Math.round(completionRate * 100)}%
              </Text>
              <Text variant="bodySmall" style={styles.metricLabel}>
                Success Rate
              </Text>
            </Card.Content>
          </Card>
        </View>
      </View>

      {/* Weekly Progress Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Weekly Progress
        </Text>
        <Card style={styles.progressCard}>
          <Card.Content>
            <View style={styles.progressHeader}>
              <Text variant="bodyMedium">
                {weeklyCompleted} of {weeklyGoal} tasks
              </Text>
              <Text variant="bodyMedium" style={styles.progressPercentage}>
                {Math.round((weeklyCompleted / weeklyGoal) * 100)}%
              </Text>
            </View>
            <ProgressBar
              progress={weeklyCompleted / weeklyGoal}
              color="#2563EB"
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>
      </View>

      {/* Upcoming Tasks Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Upcoming Tasks
          </Text>
          <Chip icon="calendar" style={styles.chip}>
            Next 3
          </Chip>
        </View>
        
        <Card style={styles.upcomingCard}>
          {upcomingTasks.length > 0 ? (
            <View>
              {upcomingTasks.map((task) => (
                <View key={`upcoming-${task.id}`}>
                  <View style={styles.upcomingTask}>
                    <View style={styles.upcomingTaskLeft}>
                      <Text variant="bodyLarge" style={styles.upcomingTaskTitle} numberOfLines={1}>
                        {task.title}
                      </Text>
                      {task.description && (
                        <Text variant="bodySmall" style={styles.upcomingTaskDescription} numberOfLines={1}>
                          {task.description.length > 30 
                            ? `${task.description.substring(0, 30)}...` 
                            : task.description}
                        </Text>
                      )}
                      {task.startDate && (
                        <Text variant="bodySmall" style={styles.upcomingTaskDate}>
                          {new Date(task.startDate).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                    <View style={styles.upcomingTaskRight}>
                      <Chip 
                        style={[
                          styles.priorityChip, 
                          { backgroundColor: task.priority === 'HIGH' ? '#FEE2E2' : 
                                          task.priority === 'MEDIUM' ? '#E0F2FE' : 
                                          '#F0FDF4' }
                        ]}
                        textStyle={[
                          styles.priorityText,
                          { color: task.priority === 'HIGH' ? '#991B1B' :
                                  task.priority === 'MEDIUM' ? '#075985' :
                                  '#166534' }
                        ]}
                      >
                        {task.priority.charAt(0)}
                      </Chip>
                      <Button
                        mode="text"
                        compact
                        onPress={() => handleTaskComplete(task.id)}
                        style={styles.completeButton}
                      >
                        <MaterialCommunityIcons name="check-circle-outline" size={20} color="#2563EB" />
                      </Button>
                    </View>
                  </View>
                  {upcomingTasks.indexOf(task) < upcomingTasks.length - 1 && (
                    <View style={styles.upcomingTaskDivider} />
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyUpcoming}>
              <Text variant="bodyMedium" style={styles.emptyText}>All caught up!</Text>
              <Text variant="bodySmall" style={styles.emptySubtext}>No upcoming tasks</Text>
            </View>
          )}
        </Card>
      </View>

      {/* All Tasks Section */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          All Tasks
        </Text>
        
        <Card style={styles.upcomingCard}>
          {activeTasks.length > 0 ? (
            <View>
              {activeTasks.map((task) => (
                <View key={`all-${task.id}`}>
                  <View style={styles.upcomingTask}>
                    <View style={styles.upcomingTaskLeft}>
                      <Text variant="bodyLarge" style={styles.upcomingTaskTitle} numberOfLines={1}>
                        {task.title}
                      </Text>
                      {task.description && (
                        <Text variant="bodySmall" style={styles.upcomingTaskDescription} numberOfLines={1}>
                          {task.description.length > 30 
                            ? `${task.description.substring(0, 30)}...` 
                            : task.description}
                        </Text>
                      )}
                      {task.startDate && (
                        <Text variant="bodySmall" style={styles.upcomingTaskDate}>
                          {new Date(task.startDate).toLocaleDateString()}
                        </Text>
                      )}
                    </View>
                    <View style={styles.upcomingTaskRight}>
                      <Chip 
                        style={[
                          styles.priorityChip, 
                          { backgroundColor: task.priority === 'HIGH' ? '#FEE2E2' : 
                                          task.priority === 'MEDIUM' ? '#E0F2FE' : 
                                          '#F0FDF4' }
                        ]}
                        textStyle={[
                          styles.priorityText,
                          { color: task.priority === 'HIGH' ? '#991B1B' :
                                  task.priority === 'MEDIUM' ? '#075985' :
                                  '#166534' }
                        ]}
                      >
                        {task.priority.charAt(0)}
                      </Chip>
                      <Button
                        mode="text"
                        compact
                        onPress={() => handleTaskComplete(task.id)}
                        style={styles.completeButton}
                      >
                        <MaterialCommunityIcons name="check-circle-outline" size={20} color="#2563EB" />
                      </Button>
                    </View>
                  </View>
                  {activeTasks.indexOf(task) < activeTasks.length - 1 && (
                    <View style={styles.upcomingTaskDivider} />
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyUpcoming}>
              <Text variant="bodyMedium" style={styles.emptyText}>No Active Tasks</Text>
              <Text variant="bodySmall" style={styles.emptySubtext}>Add a new task to get started</Text>
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  metricsContainer: {
    padding: 16,
  },
  streakCard: {
    backgroundColor: '#FEF3C7',
    marginBottom: 16,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  streakText: {
    marginLeft: 8,
    color: '#92400E',
    fontWeight: '600',
  },
  streakSubtext: {
    color: '#92400E',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'white',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  metricLabel: {
    color: '#6B7280',
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#374151',
    fontWeight: '600',
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: 'white',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressPercentage: {
    color: '#2563EB',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  chip: {
    backgroundColor: '#EEF2FF',
  },
  upcomingCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  upcomingTask: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  upcomingTaskLeft: {
    flex: 1,
    marginRight: 12,
  },
  upcomingTaskTitle: {
    color: '#111827',
    fontWeight: '500',
  },
  upcomingTaskDate: {
    color: '#6B7280',
    marginTop: 2,
  },
  upcomingTaskRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  upcomingTaskDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  priorityChip: {
    height: 24,
    width: 24,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    marginVertical: 0,
    marginHorizontal: 0,
  },
  completeButton: {
    margin: 0,
    minWidth: 32,
  },
  emptyUpcoming: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#374151',
    fontWeight: '500',
  },
  emptySubtext: {
    color: '#6B7280',
    marginTop: 4,
  },
  upcomingTaskDescription: {
    color: '#6B7280',
    marginTop: 2,
    fontSize: 12,
  },
});
