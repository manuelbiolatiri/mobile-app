import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, updateTodo, deleteTodo } from '../store/slices/todoSlice';
import { AppDispatch, RootState } from '../store';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, isLoading, error } = useSelector((state: RootState) => state.todos);
  
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);
  
  const activeTodos = todos.filter(todo => !todo.completed);
  
  const handleToggleComplete = (id: string, completed: boolean) => {
    dispatch(updateTodo({ id, completed: !completed }));
  };
  
  const handleDelete = (id: string) => {
    dispatch(deleteTodo(id));
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const renderItem = ({ item }: { item: TodoItem }) => (
    <View style={styles.todoItem}>
      <View style={styles.todoContent}>
        <View style={styles.todoLeftSection}>
          <TouchableOpacity
            onPress={() => handleToggleComplete(item.id, item.completed)}
            style={styles.checkboxContainer}
          >
            <View style={[
              styles.checkbox,
              item.completed && styles.checkboxCompleted
            ]}>
              {item.completed && <FontAwesome name="check" size={16} color="white" />}
            </View>
          </TouchableOpacity>
          <View style={styles.todoTextContainer}>
            <Text 
              style={[
                styles.todoTitle,
                item.completed && styles.todoTitleCompleted
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={styles.todoDescription} numberOfLines={1}>{item.description}</Text>
            <Text style={styles.todoDate}>Created: {formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.todoActions}>
          <TouchableOpacity 
            onPress={() => router.push({
              pathname: '/edit-task',
              params: { id: item.id }
            })}
            style={styles.editButton}
          >
            <FontAwesome name="pencil" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handleDelete(item.id)}
            style={styles.deleteButton}
          >
            <FontAwesome name="trash-o" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>My Tasks</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/create-task')}
          >
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
        
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        
        {isLoading && todos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={[styles.emptyTitle, { marginTop: 16 }]}>Loading tasks...</Text>
          </View>
        ) : activeTodos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome name="clipboard" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No tasks yet</Text>
            <Text style={styles.emptySubtitle}>
              Add a new task by tapping the + button
            </Text>
          </View>
        ) : (
          <FlatList
            data={activeTodos}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#991B1B',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  todoItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  todoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todoLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  todoTextContainer: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  todoTitleCompleted: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  todoDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  todoDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  todoActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    marginRight: 16,
  },
  deleteButton: {
    marginLeft: 'auto',
  },
});
