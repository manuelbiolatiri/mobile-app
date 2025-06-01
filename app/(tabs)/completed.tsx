import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
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
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity
            onPress={() => handleToggleComplete(item.id, item.completed)}
            className="mr-3"
          >
            <View className={`w-6 h-6 rounded-full border-2 ${item.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'} justify-center items-center`}>
              {item.completed && <FontAwesome name="check" size={16} color="white" />}
            </View>
          </TouchableOpacity>
          <View className="flex-1">
            <Text 
              className={`text-lg font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text className="text-gray-500 text-sm" numberOfLines={1}>{item.description}</Text>
            <Text className="text-gray-400 text-xs mt-1">Completed: {formatDate(item.updatedAt)}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <FontAwesome name="trash-o" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  if (isLoading && todos.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar style="auto" />
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Completed Tasks</Text>
        
        {error ? (
          <View className="bg-red-100 p-4 rounded-md mb-4">
            <Text className="text-red-700">{error}</Text>
          </View>
        ) : null}
        
        {completedTodos.length === 0 && !isLoading ? (
          <View className="justify-center items-center py-16">
            <FontAwesome name="check-circle" size={64} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg mt-4">No completed tasks</Text>
            <Text className="text-gray-400 text-center mt-2">
              Tasks you complete will appear here
            </Text>
          </View>
        ) : (
          <FlatList
            data={completedTodos}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}