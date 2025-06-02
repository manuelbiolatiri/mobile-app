import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, updateTodo, deleteTodo } from '../store/slices/todoSlice';
import { AppDispatch, RootState } from '../store';
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

export default function CompletedScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, isLoading, error } = useSelector((state: RootState) => state.todos);
  
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);
  
  const completedTodos = todos.filter(todo => todo.completed);
  
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
            <Text style={styles.todoDate}>Completed: {formatDate(item.updatedAt)}</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <FontAwesome name="trash-o" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Completed Tasks</Text>
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
        ) : completedTodos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome name="check-circle" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No completed tasks</Text>
            <Text style={styles.emptySubtitle}>
              Tasks you complete will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={completedTodos}
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
  deleteButton: {
    marginLeft: 16,
  },
});