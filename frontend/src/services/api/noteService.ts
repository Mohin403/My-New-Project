import apiClient from './config';
import { Note } from '../../types';

interface CreateNoteData {
  title: string;
  content: string;
  tags: string[];
  category: string;
}

const noteService = {
  // Get all notes
  getAllNotes: async (): Promise<Note[]> => {
    const response = await apiClient.get<Note[]>('/notes');
    return response.data;
  },

  // Get note by ID
  getNoteById: async (id: string): Promise<Note> => {
    const response = await apiClient.get<Note>(`/notes/${id}`);
    return response.data;
  },

  // Get notes by tag
  getNotesByTag: async (tag: string): Promise<Note[]> => {
    const response = await apiClient.get<Note[]>(`/notes/tag/${tag}`);
    return response.data;
  },

  // Get notes by category
  getNotesByCategory: async (category: string): Promise<Note[]> => {
    const response = await apiClient.get<Note[]>(`/notes/category/${category}`);
    return response.data;
  },

  // Create new note
  createNote: async (noteData: CreateNoteData): Promise<Note> => {
    const response = await apiClient.post<Note>('/notes', noteData);
    return response.data;
  },

  // Update note
  updateNote: async (id: string, noteData: Partial<Note>): Promise<Note> => {
    const response = await apiClient.put<Note>(`/notes/${id}`, noteData);
    return response.data;
  },

  // Delete note
  deleteNote: async (id: string): Promise<void> => {
    await apiClient.delete(`/notes/${id}`);
  },
};

export default noteService;