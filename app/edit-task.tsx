import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { updateTodo } from './store/slices/todoSlice';
import { AppDispatch, RootState } from './store';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

type TaskFormData = {
  title: string;
  description: string;
};

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { todos, isLoading } = useSelector((state: RootState) => state.todos);
  
  const task = todos.find(todo => todo.id === id);
  
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<TaskFormData>({
    defaultValues: {
      title: '',
      description: ''
    }
  });
  
  useEffect(() => {
    if (task) {
      setValue('title', task.title);
      setValue('description', task.description);
    }
  }, [task, setValue]);
  
  const onSubmit = (data: TaskFormData) => {
    if (!id) return;
    
    dispatch(updateTodo({ id, ...data })).unwrap()
      .then(() => {
        router.back();
      })
      .catch((err) => {
        console.error('Failed to update task:', err);
      });
  };
  
  if (!task) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-gray-500">Task not found</Text>
        <TouchableOpacity 
          className="mt-4 bg-blue-500 px-4 py-2 rounded-md"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-gray-100">
      <StatusBar style="auto" />
      <View className="p-4 flex-row items-center border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <FontAwesome name="arrow-left" size={20} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Edit Task</Text>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Task Title</Text>
          <Controller
            control={control}
            rules={{
              required: 'Title is required',
              minLength: {
                value: 3,
                message: 'Title must be at least 3 characters'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-white p-4 rounded-md border border-gray-300"
                placeholder="Enter task title"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="title"
          />
          {errors.title && <Text className="text-red-500 mt-1">{errors.title.message}</Text>}
        </View>
        
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Description</Text>
          <Controller
            control={control}
            rules={{
              required: 'Description is required'
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-white p-4 rounded-md border border-gray-300"
                placeholder="Enter task description"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={4}
                style={{ height: 120, textAlignVertical: 'top' }}
              />
            )}
            name="description"
          />
          {errors.description && <Text className="text-red-500 mt-1">{errors.description.message}</Text>}
        </View>
        
        <TouchableOpacity 
          className="bg-blue-500 p-4 rounded-md"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold">Update Task</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}