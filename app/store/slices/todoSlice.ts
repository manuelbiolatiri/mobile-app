import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../constants/Config';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  isLoading: false,
  error: null,
};

// Mock API calls (replace with real API calls once backend is ready)
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue, getState }) => {
    try {
      // In a real app, this would include the auth token
      // const { auth } = getState() as { auth: { token: string } };
      // const response = await axios.get(`${API_URL}/todos`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      
      // Mock response
      const mockTodos: Todo[] = [
        {
          id: '1',
          title: 'Complete React Native App',
          description: 'Finish building the todo app with React Native',
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Learn Redux Toolkit',
          description: 'Master Redux Toolkit for state management',
          completed: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      return mockTodos;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch todos');
      }
      return rejectWithValue('Failed to fetch todos');
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todoData: { title: string; description: string }, { rejectWithValue, getState }) => {
    try {
      // In a real app, this would include the auth token
      // const { auth } = getState() as { auth: { token: string } };
      // const response = await axios.post(`${API_URL}/todos`, todoData, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      
      // Mock response
      const mockNewTodo: Todo = {
        id: Date.now().toString(),
        title: todoData.title,
        description: todoData.description,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return mockNewTodo;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add todo');
      }
      return rejectWithValue('Failed to add todo');
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todoData: { id: string; title?: string; description?: string; completed?: boolean }, { rejectWithValue, getState }) => {
    try {
      // In a real app, this would include the auth token
      // const { auth } = getState() as { auth: { token: string } };
      // const response = await axios.patch(`${API_URL}/todos/${todoData.id}`, todoData, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      
      // Mock response - assuming success and returning updated data
      return todoData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update todo');
      }
      return rejectWithValue('Failed to update todo');
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: string, { rejectWithValue, getState }) => {
    try {
      // In a real app, this would include the auth token
      // const { auth } = getState() as { auth: { token: string } };
      // await axios.delete(`${API_URL}/todos/${id}`, {
      //   headers: { Authorization: `Bearer ${auth.token}` }
      // });
      
      // Mock response - assuming success and returning the id
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete todo');
      }
      return rejectWithValue('Failed to delete todo');
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch todos cases
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Add todo cases
      .addCase(addTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update todo cases
      .addCase(updateTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = {
            ...state.todos[index],
            ...action.payload,
            updatedAt: new Date().toISOString()
          };
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete todo cases
      .addCase(deleteTodo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default todoSlice.reducer;