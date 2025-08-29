import apiClient from './config';
import { Team } from '../../types';

interface CreateTeamData {
  name: string;
  description?: string;
}

interface TeamMemberData {
  userId: string;
  role: 'member' | 'admin';
}

const teamService = {
  // Get all teams
  getAllTeams: async (): Promise<Team[]> => {
    const response = await apiClient.get<Team[]>('/teams');
    return response.data;
  },

  // Get team by ID
  getTeamById: async (id: string): Promise<Team> => {
    const response = await apiClient.get<Team>(`/teams/${id}`);
    return response.data;
  },

  // Create new team
  createTeam: async (teamData: CreateTeamData): Promise<Team> => {
    const response = await apiClient.post<Team>('/teams', teamData);
    return response.data;
  },

  // Update team
  updateTeam: async (id: string, teamData: Partial<Team>): Promise<Team> => {
    const response = await apiClient.put<Team>(`/teams/${id}`, teamData);
    return response.data;
  },

  // Delete team
  deleteTeam: async (id: string): Promise<void> => {
    await apiClient.delete(`/teams/${id}`);
  },

  // Add team member
  addTeamMember: async (teamId: string, memberData: TeamMemberData): Promise<Team> => {
    const response = await apiClient.post<Team>(`/teams/${teamId}/members`, memberData);
    return response.data;
  },

  // Remove team member
  removeTeamMember: async (teamId: string, userId: string): Promise<Team> => {
    const response = await apiClient.delete<Team>(`/teams/${teamId}/members/${userId}`);
    return response.data;
  },
};

export default teamService;