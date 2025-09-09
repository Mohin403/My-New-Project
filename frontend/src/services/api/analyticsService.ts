import apiClient from './config';
import { Analytics } from '../../types';

const analyticsService = {
  /**
   * Get user analytics data
   * @param period - time period for analytics (week, month, year)
   */
  getUserAnalytics: async (period: string = 'month'): Promise<Analytics[]> => {
    const response = await apiClient.get(`/analytics?period=${period}`);
    return response.data;
  },

  /**
   * Get task analytics data
   * @param period - time period for analytics (week, month, year)
   */
  getTaskAnalytics: async (period: string = 'month'): Promise<Analytics> => {
    const response = await apiClient.get(`/analytics/tasks?period=${period}`);
    return response.data;
  },

  /**
   * Get user activity logs
   * @param period - time period for activity logs (week, month, year)
   */
  getUserActivity: async (period: string = 'month'): Promise<any> => {
    const response = await apiClient.get(`/analytics/activity?period=${period}`);
    return response.data;
  },

  /**
   * Log user activity
   * @param data - activity data to log
   */
  logActivity: async (data: {
    action: string;
    entityType: string;
    entityId: string;
    details?: string;
  }): Promise<any> => {
    const response = await apiClient.post('/analytics/activity', data);
    return response.data;
  },
};

export default analyticsService;