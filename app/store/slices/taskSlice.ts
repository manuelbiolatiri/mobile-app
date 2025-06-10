import { createSlice } from '@reduxjs/toolkit';
import { Task, TaskPriority } from '../../services/api';

type TaskSearch = {
  page?: number;
  perPage?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: 'all' | 'active' | 'completed';
  priority?: TaskPriority;
};

type TaskState = {
  tasks: Task[];
  currentTask: Task | null;
  perPage: number;
  totalPages: number;
  total: number;
  count: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  searchParams: TaskSearch;
  sort: string;
  isOrderAsc: boolean;
};

const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  perPage: 10,
  totalPages: 1,
  total: 0,
  count: 0,
  currentPage: 1,
  isLoading: false,
  error: null,
  searchParams: {
    page: 1,
    perPage: 10,
    status: 'all',
  },
  sort: '',
  isOrderAsc: true,
};

export const TaskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setLoading: (state, action: { payload: boolean }) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: { payload: string | null }) => {
      state.error = action.payload;
    },
    setPage: (state, action: { payload: number }) => {
      state.currentPage = action.payload;
      state.searchParams.page = action.payload;
    },
    setLoadMorePage: (state) => {
      const nextPage = state.totalPages > state.currentPage ? state.currentPage + 1 : state.currentPage;
      state.currentPage = nextPage;
      state.searchParams.page = nextPage;
    },
    setPerPage: (state, action: { payload: number }) => {
      state.perPage = action.payload;
      state.searchParams.perPage = action.payload;
    },
    setSort: (state, action: { payload: { sort: string; isAsc: boolean } }) => {
      state.sort = action.payload.sort;
      state.isOrderAsc = action.payload.isAsc;
      state.searchParams.sort = action.payload.sort;
      state.searchParams.order = action.payload.isAsc ? 'asc' : 'desc';
    },
    setCurrentTask: (state, action: { payload: Task | null }) => {
      state.currentTask = action.payload;
    },
    setTaskStatus: (state, action: { payload: 'all' | 'active' | 'completed' }) => {
      state.searchParams.status = action.payload;
    },
    setPriority: (state, action: { payload: TaskPriority | undefined }) => {
      state.searchParams.priority = action.payload;
    },
    // API Success Actions
    getTasksSuccess: (state, action: { payload: any }) => {
      console.log("Tasks payload =>", action.payload);
      // Only append if we're paginating and have data
      if (state.currentPage > 1 && action.payload.data?.length > 0) {
        state.tasks = [...state.tasks, ...action.payload.data];
      } else {
        // Otherwise, replace the tasks array
        state.tasks = action.payload.data || [];
      }
      state.totalPages = action.payload.totalPages;
      state.total = action.payload.total;
      state.count = action.payload.count;
      state.perPage = action.payload.perPage;
      state.currentPage = action.payload.currentPage;
      state.error = null;
      state.isLoading = false;
    },
    createTaskSuccess: (state, action: { payload: Task }) => {
      state.tasks.unshift(action.payload);
      state.total += 1;
      state.count += 1;
      state.error = null;
      state.isLoading = false;
    },
    updateTaskSuccess: (state, action: { payload: Task }) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      state.error = null;
      state.isLoading = false;
    },
    deleteTaskSuccess: (state, action: { payload: string }) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      state.total -= 1;
      state.count -= 1;
      state.error = null;
      state.isLoading = false;
    },
    completeTaskSuccess: (state, action: { payload: Task }) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      state.error = null;
      state.isLoading = false;
    },
    // Reset Actions
    resetTaskState: (state) => {
      state.currentPage = 1;
      state.perPage = 10;
      state.searchParams = {
        page: 1,
        perPage: 10,
        status: 'all',
      };
      state.sort = '';
      state.isOrderAsc = true;
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  setPage,
  setLoadMorePage,
  setPerPage,
  setSort,
  setCurrentTask,
  setTaskStatus,
  setPriority,
  getTasksSuccess,
  createTaskSuccess,
  updateTaskSuccess,
  deleteTaskSuccess,
  completeTaskSuccess,
  resetTaskState,
} = TaskSlice.actions;

// Export selector
export const taskSelector = (state: any): TaskState => state.tasks;

export default TaskSlice.reducer; 