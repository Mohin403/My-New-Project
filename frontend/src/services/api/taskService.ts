import apiClient from './config';
import { Task } from '../../types';

interface CreateTaskData {
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  startDate?: string;
  endDate?: string;
}

const taskService = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/tasks');
    return response.data;
  },

  // Get task by ID
  getTaskById: async (id: string): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  // Get tasks by status
  getTasksByStatus: async (status: string): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>(`/tasks/status/${status}`);
    return response.data;
  },

  // Get tasks by priority
  getTasksByPriority: async (priority: string): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>(`/tasks/priority/${priority}`);
    return response.data;
  },

  // Create new task
  createTask: async (taskData: CreateTaskData): Promise<Task> => {
    const response = await apiClient.post<Task>('/tasks', taskData);
    return response.data;
  },

  // Update task
  updateTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const response = await apiClient.put<Task>(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};

export default taskService;