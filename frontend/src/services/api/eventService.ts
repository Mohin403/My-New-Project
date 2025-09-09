import apiClient from './config';
import { CalendarEvent } from '../../types';

const eventService = {
  /**
   * Create a new calendar event
   * @param eventData - event data to create
   */
  createEvent: async (eventData: {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    isAllDay: boolean;
  }): Promise<CalendarEvent> => {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  },

  /**
   * Get all events for the current user
   * @param startDate - optional start date filter
   * @param endDate - optional end date filter
   */
  getEvents: async (startDate?: string, endDate?: string): Promise<CalendarEvent[]> => {
    let url = '/events';
    if (startDate && endDate) {
      url += `?start=${startDate}&end=${endDate}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  /**
   * Get an event by ID
   * @param id - event ID
   */
  getEventById: async (id: string): Promise<CalendarEvent> => {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  },

  /**
   * Update an existing event
   * @param id - event ID
   * @param eventData - updated event data
   */
  updateEvent: async (id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data;
  },

  /**
   * Delete an event
   * @param id - event ID
   */
  deleteEvent: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },
};

export default eventService;