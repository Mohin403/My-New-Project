import apiClient from './config';
import { Notification } from '../../types';

const notificationService = {
  /**
   * Get all notifications for the current user
   */
  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  /**
   * Mark a notification as read
   * @param id - notification ID
   */
  markAsRead: async (id: string): Promise<Notification> => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await apiClient.put('/notifications/read-all');
    return response.data;
  },

  /**
   * Delete a notification
   * @param id - notification ID
   */
  deleteNotification: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },
};

export default notificationService;