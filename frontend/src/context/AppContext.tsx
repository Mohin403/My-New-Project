import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Task, Note, CalendarEvent, Team, Notification, Analytics } from '../types';
import { mockUser, mockTasks, mockNotes, mockEvents, mockNotifications } from '../utils/mockData';
import { authService, taskService, noteService, teamService, userService } from '../services/api';

interface AppContextType {
  user: User | null;
  tasks: Task[];
  notes: Note[];
  events: CalendarEvent[];
  notifications: Notification[];
  teams: Team[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addTask: (task: Omit<Task, 'id' | 'taskId' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'noteId' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'eventId' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  getUsers: () => Promise<User[]>;
  getTeams: () => Promise<Team[]>;
  addTeam: (team: Omit<Team, 'id' | 'teamId' | 'createdAt' | 'updatedAt' | 'members' | 'owner'>) => Promise<Team>;
  updateTeam: (id: string, updates: Partial<Team>) => Promise<Team>;
  deleteTeam: (id: string) => Promise<void>;
  addTeamMember: (teamId: string, memberData: { userId: string, role: 'member' | 'admin' }) => Promise<Team>;
  removeTeamMember: (teamId: string, userId: string) => Promise<Team>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load user data if authenticated
    const loadUserData = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Get user profile
          const userProfile = await authService.getProfile();
          setUser(userProfile);
          
          // Get user tasks, notes, and teams
          const userTasks = await taskService.getAllTasks();
          const userNotes = await noteService.getAllNotes();
          const userTeams = await teamService.getAllTeams();
          
          setTasks(userTasks);
          setNotes(userNotes);
          setTeams(userTeams);
          setEvents(mockEvents); // Keep using mock events until implemented
          setNotifications(mockNotifications); // Keep using mock notifications until implemented
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        authService.logout();
        setIsAuthenticated(false);
      }
    };
    
    loadUserData();
    
    return () => {
      // Cleanup function when component unmounts
    };
  }, [isAuthenticated]);

  const login = async (email: string, password: string) => {
    try {
      // Real API login call
      const response = await authService.login({ email, password });
      setUser(response.user);
      
      // Fetch user data after login
      const userTasks = await taskService.getAllTasks();
      const userNotes = await noteService.getAllNotes();
      const userTeams = await teamService.getAllTeams();
      
      setTasks(userTasks);
      setNotes(userNotes);
      setTeams(userTeams);
      setEvents(mockEvents); // Keep using mock events until implemented
      setNotifications(mockNotifications); // Keep using mock notifications until implemented
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setTasks([]);
    setNotes([]);
    setTeams([]);
    setEvents([]);
    setNotifications([]);
    setIsAuthenticated(false);
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'taskId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await taskService.updateTask(id, updates);
      setTasks(prev => prev.map(task => 
        task._id === id ? updatedTask : task
      ));
      
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  const addNote = async (noteData: Omit<Note, 'id' | 'noteId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newNote = await noteService.createNote(noteData);
      setNotes(prev => [...prev, newNote]);
      return newNote;
    } catch (error) {
      console.error('Failed to add note:', error);
      throw error;
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    try {
      const updatedNote = await noteService.updateNote(id, updates);
      setNotes(prev => prev.map(note => 
        note._id === id ? updatedNote : note
      ));
      return updatedNote;
    } catch (error) {
      console.error('Failed to update note:', error);
      throw error;
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await noteService.deleteNote(id);
      setNotes(prev => prev.filter(note => note._id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw error;
    }
  };

  const addEvent = (eventData: Omit<CalendarEvent, 'id' | 'eventId' | 'createdAt' | 'updatedAt'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      eventId: `event_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(event => 
      event._id === id 
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event._id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification._id === id
        ? { ...notification, read: true, updatedAt: new Date().toISOString() }
        : notification
    ));
  };

  // User management functions
  const getUsers = async (): Promise<User[]> => {
    try {
      const fetchedUsers = await userService.getAllUsers();
      return fetchedUsers;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  };

  // Team management functions
  const getTeams = async (): Promise<Team[]> => {
    try {
      const fetchedTeams = await teamService.getAllTeams();
      setTeams(fetchedTeams);
      return fetchedTeams;
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      throw error;
    }
  };

  const addTeam = async (teamData: Omit<Team, 'id' | 'teamId' | 'createdAt' | 'updatedAt' | 'members' | 'owner'>): Promise<Team> => {
    try {
      const newTeam = await teamService.createTeam(teamData);
      setTeams(prev => [...prev, newTeam]);
      return newTeam;
    } catch (error) {
      console.error('Failed to create team:', error);
      throw error;
    }
  };

  const updateTeam = async (id: string, updates: Partial<Team>): Promise<Team> => {
    try {
      const updatedTeam = await teamService.updateTeam(id, updates);
      setTeams(prev => prev.map(team => 
        team._id === id ? updatedTeam : team
      ));
      return updatedTeam;
    } catch (error) {
      console.error('Failed to update team:', error);
      throw error;
    }
  };

  const deleteTeam = async (id: string): Promise<void> => {
    try {
      await teamService.deleteTeam(id);
      setTeams(prev => prev.filter(team => team._id !== id));
    } catch (error) {
      console.error('Failed to delete team:', error);
      throw error;
    }
  };

  const addTeamMember = async (teamId: string, memberData: { userId: string, role: 'member' | 'admin' }): Promise<Team> => {
    try {
      const updatedTeam = await teamService.addTeamMember(teamId, memberData);
      setTeams(prev => prev.map(team => 
        team._id === teamId ? updatedTeam : team
      ));
      return updatedTeam;
    } catch (error) {
      console.error('Failed to add team member:', error);
      throw error;
    }
  };

  const removeTeamMember = async (teamId: string, userId: string): Promise<Team> => {
    try {
      const updatedTeam = await teamService.removeTeamMember(teamId, userId);
      setTeams(prev => prev.map(team => 
        team._id === teamId ? updatedTeam : team
      ));
      return updatedTeam;
    } catch (error) {
      console.error('Failed to remove team member:', error);
      throw error;
    }
  };

  const value: AppContextType = {
    user,
    tasks,
    notes,
    events,
    notifications,
    teams,
    isAuthenticated,
    login,
    logout,
    addTask,
    updateTask,
    deleteTask,
    addNote,
    updateNote,
    deleteNote,
    addEvent,
    updateEvent,
    deleteEvent,
    markNotificationAsRead,
    getUsers,
    getTeams,
    addTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};