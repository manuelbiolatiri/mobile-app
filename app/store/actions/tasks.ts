import { Task, TaskPriority, CreateTaskDto, taskApi } from '../../services/api';
import { 
  setLoading,
  setError,
  getTasksSuccess,
  createTaskSuccess,
  updateTaskSuccess,
  deleteTaskSuccess,
  completeTaskSuccess,
} from '../slices/taskSlice';

// Action Creators
export const fetchTasks = () => async (dispatch: any, getState: any) => {
  try {
    dispatch(setLoading(true));
    const { searchParams } = getState().tasks;
    console.log('Fetching tasks with params:', searchParams);
    const response = await taskApi.getTasks(searchParams);
    console.log('Tasks API Response:', response);
    dispatch(getTasksSuccess(response));
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    dispatch(setError(error.message || 'Failed to fetch tasks'));
    dispatch(setLoading(false));
  }
};

export const createTask = (taskData: CreateTaskDto) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await taskApi.createTask(taskData);
    dispatch(createTaskSuccess(response));
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to create task'));
    dispatch(setLoading(false));
  }
};

export const updateTask = (id: string, data: Partial<CreateTaskDto>) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await taskApi.updateTask(id, data);
    dispatch(updateTaskSuccess(response));
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to update task'));
    dispatch(setLoading(false));
  }
};

export const deleteTask = (id: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    await taskApi.deleteTask(id);
    dispatch(deleteTaskSuccess(id));
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to delete task'));
    dispatch(setLoading(false));
  }
};

export const completeTask = (id: string) => async (dispatch: any) => {
  try {
    dispatch(setLoading(true));
    const response = await taskApi.completeTask(id);
    dispatch(completeTaskSuccess(response));
  } catch (error: any) {
    dispatch(setError(error.message || 'Failed to complete task'));
    dispatch(setLoading(false));
  }
}; 