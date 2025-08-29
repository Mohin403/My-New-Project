import { User, Task, Note, CalendarEvent, Team, Notification, Analytics } from '../types';

export const mockUser: User = {
  id: '1',
  userId: 'user_001',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  role: 'user',
  profilePhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  location: 'San Francisco, CA',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T14:30:00Z',
};

export const mockTasks: Task[] = [
  {
    id: '1',
    taskId: 'task_001',
    title: 'Complete project proposal',
    description: 'Finalize the Q1 project proposal for the new productivity platform',
    status: 'in-progress',
    priority: 'high',
    startDate: '2024-01-20T09:00:00Z',
    endDate: '2024-01-25T17:00:00Z',
    owner: '1',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
  },
  {
    id: '2',
    taskId: 'task_002',
    title: 'Review team feedback',
    description: 'Go through all team feedback from the last sprint',
    status: 'pending',
    priority: 'medium',
    startDate: '2024-01-22T10:00:00Z',
    endDate: '2024-01-23T16:00:00Z',
    owner: '1',
    createdAt: '2024-01-21T14:00:00Z',
    updatedAt: '2024-01-21T14:00:00Z',
  },
  {
    id: '3',
    taskId: 'task_003',
    title: 'Update documentation',
    description: 'Update API documentation with latest changes',
    status: 'completed',
    priority: 'low',
    startDate: '2024-01-18T09:00:00Z',
    endDate: '2024-01-19T17:00:00Z',
    owner: '1',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-19T17:00:00Z',
  },
];

export const mockNotes: Note[] = [
  {
    id: '1',
    noteId: 'note_001',
    title: 'Meeting Notes - Project Kickoff',
    content: '# Project Kickoff Meeting\n\n## Attendees\n- Alex Johnson\n- Sarah Chen\n- Mike Rodriguez\n\n## Key Points\n- Timeline: 6 weeks\n- Budget: $50k\n- Resources needed\n\n## Action Items\n- [ ] Create project charter\n- [ ] Set up development environment\n- [x] Schedule weekly check-ins',
    tags: ['meeting', 'project', 'kickoff'],
    category: 'work',
    owner: '1',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T11:15:00Z',
  },
  {
    id: '2',
    noteId: 'note_002',
    title: 'Ideas for App Features',
    content: '# Feature Ideas\n\n## Core Features\n- Task management with priorities\n- Calendar integration\n- Team collaboration\n- Analytics dashboard\n\n## Future Enhancements\n- Mobile app\n- AI-powered insights\n- Third-party integrations\n- Advanced reporting',
    tags: ['ideas', 'features', 'planning'],
    category: 'brainstorm',
    owner: '1',
    createdAt: '2024-01-19T15:30:00Z',
    updatedAt: '2024-01-19T16:00:00Z',
  },
];

export const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    eventId: 'event_001',
    title: 'Team Standup',
    description: 'Daily team standup meeting',
    startDate: '2024-01-22T09:00:00Z',
    endDate: '2024-01-22T09:30:00Z',
    isAllDay: false,
    owner: '1',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    eventId: 'event_002',
    title: 'Client Presentation',
    description: 'Present Q1 project proposal to client',
    startDate: '2024-01-25T14:00:00Z',
    endDate: '2024-01-25T15:30:00Z',
    isAllDay: false,
    owner: '1',
    createdAt: '2024-01-21T11:00:00Z',
    updatedAt: '2024-01-21T11:00:00Z',
  },
];

export const mockAnalytics: Analytics[] = [
  {
    id: '1',
    analyticsId: 'analytics_001',
    type: 'task_completion',
    data: {
      completed: 15,
      total: 20,
      completionRate: 75
    },
    dateRange: {
      start: '2024-01-01T00:00:00Z',
      end: '2024-01-21T23:59:59Z'
    },
    owner: '1',
    createdAt: '2024-01-21T12:00:00Z',
    updatedAt: '2024-01-21T12:00:00Z',
  },
  {
    id: '2',
    analyticsId: 'analytics_002',
    type: 'productivity_score',
    data: {
      score: 8.5,
      trend: 'up',
      previousScore: 7.8
    },
    dateRange: {
      start: '2024-01-01T00:00:00Z',
      end: '2024-01-21T23:59:59Z'
    },
    owner: '1',
    createdAt: '2024-01-21T12:00:00Z',
    updatedAt: '2024-01-21T12:00:00Z',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    notificationId: 'notif_001',
    title: 'Task Deadline Approaching',
    message: 'Complete project proposal is due in 2 days',
    type: 'warning',
    read: false,
    recipient: '1',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-21T10:00:00Z',
  },
  {
    id: '2',
    notificationId: 'notif_002',
    title: 'Task Completed',
    message: 'Update documentation has been marked as completed',
    type: 'success',
    read: true,
    recipient: '1',
    createdAt: '2024-01-19T17:00:00Z',
    updatedAt: '2024-01-19T18:00:00Z',
  },
];