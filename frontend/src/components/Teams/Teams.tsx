import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, Loader } from 'lucide-react';
import { teamService } from '../../services/api';
import { Team } from '../../types';
import TeamCard from './TeamCard';
import TeamModal from './TeamModal';

const Teams: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch teams on component mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const fetchedTeams = await teamService.getAllTeams();
        setTeams(fetchedTeams);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to fetch teams');
        console.error('Error fetching teams:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeams();
  }, []);

  // Filter teams by search term
  const filteredTeams = teams.filter(team => {
    return team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (team.description && team.description.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const handleSaveTeam = async (teamData: Omit<Team, 'id' | 'teamId' | 'createdAt' | 'updatedAt' | 'members' | 'owner'>) => {
    try {
      setLoading(true);
      if (editingTeam) {
        // Update existing team
        const updatedTeam = await teamService.updateTeam(editingTeam.id, teamData);
        setTeams(prev => prev.map(team => team.id === updatedTeam.id ? updatedTeam : team));
      } else {
        // Create new team
        const newTeam = await teamService.createTeam(teamData);
        setTeams(prev => [...prev, newTeam]);
      }
      setIsModalOpen(false);
      setEditingTeam(undefined);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to save team');
      console.error('Error saving team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    try {
      setLoading(true);
      await teamService.deleteTeam(id);
      setTeams(prev => prev.filter(team => team.id !== id));
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to delete team');
      console.error('Error deleting team:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (teamId: string, email: string, role: 'member' | 'admin') => {
    try {
      // Don't set global loading state to avoid UI flicker
      const updatedTeam = await teamService.addTeamMember(teamId, { userId: email, role });
      setTeams(prev => prev.map(team => team.id === updatedTeam.id ? updatedTeam : team));
      setError('');
      return updatedTeam;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add team member';
      setError(errorMsg);
      console.error('Error adding team member:', err);
      throw new Error(errorMsg);
    }
  };

  const handleRemoveMember = async (teamId: string, userId: string) => {
    try {
      // Don't set global loading state to avoid UI flicker
      const updatedTeam = await teamService.removeTeamMember(teamId, userId);
      setTeams(prev => prev.map(team => team.id === updatedTeam.id ? updatedTeam : team));
      setError('');
      return updatedTeam;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to remove team member';
      setError(errorMsg);
      console.error('Error removing team member:', err);
      throw new Error(errorMsg);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with search and add button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-0">Teams</h1>
        
        <div className="flex w-full sm:w-auto gap-2">
          {/* Search */}
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <input
              type="text"
              placeholder="Search teams..."
              className="w-full pl-10 pr-3 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          
          {/* Add Team Button */}
          <button
            onClick={() => {
              setEditingTeam(undefined);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center text-sm sm:text-base whitespace-nowrap"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
            <span>New Team</span>
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-700 hover:text-red-900">
            &times;
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading teams...</span>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredTeams.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No teams match your search' : 'No teams yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Create your first team to start collaborating'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
            >
              <Plus className="h-5 w-5 mr-1" />
              <span>Create Team</span>
            </button>
          )}
        </div>
      )}

      {/* Teams grid */}
      {!loading && filteredTeams.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredTeams.map(team => (
            <TeamCard
              key={team.id}
              team={team}
              onEdit={() => {
                setEditingTeam(team);
                setIsModalOpen(true);
              }}
              onDelete={() => handleDeleteTeam(team.id)}
              onAddMember={(email, role) => handleAddMember(team._id, email, role)}
              onRemoveMember={(userId) => handleRemoveMember(team._id, userId)}
            />
          ))}
        </div>
      )}

      {/* Team modal */}
      {isModalOpen && (
        <TeamModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTeam(undefined);
          }}
          onSave={handleSaveTeam}
          team={editingTeam}
        />
      )}
    </div>
  );
};

export default Teams;