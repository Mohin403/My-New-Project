export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  profilePhoto?: string;
  location?: string;
  socialLinks?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  id: string;
  taskId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  startDate?: string;
  endDate?: string;
  owner: string;
  teamId?: string;
  sharedWith?: string[];
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
 _id: string
  id: string;
  noteId: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  _id: string;
  id: string;
  eventId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  isAllDay: boolean;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  _id: string;
  id: string;
  teamId: string;
  name: string;
  description?: string;
  members: Array<{
    user: string | User;
    role: 'member' | 'admin';
    _id?: string;
  }>;
  owner: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  id: string;
  notificationId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  recipient: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  id: string;
  analyticsId: string;
  type: string;
  data: any;
  dateRange?: {
    start: string;
    end: string;
  };
  owner: string;
  createdAt: string;
  updatedAt: string;
}