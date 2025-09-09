import React, { useState } from 'react';
import { MoreVertical, Edit, Trash, UserPlus, UserMinus, Loader } from 'lucide-react';
import { Team } from '../../types';

interface TeamCardProps {
  team: Team;
  onEdit: () => void;
  onDelete: () => void;
  onAddMember: (email: string, role: 'member' | 'admin') => void;
  onRemoveMember: (userId: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onEdit, onDelete, onAddMember, onRemoveMember }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'member' | 'admin'>('member');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
    } catch (err: any) {
      setError(err.message || 'Failed to delete team');
    } finally {
      setIsDeleting(false);
      setMenuOpen(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    
    try {
      setIsAddingMember(true);
      setError('');
      await onAddMember(email, role);
      setEmail('');
      setRole('member');
      setAddMemberOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add member');
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      setIsRemovingMember(userId);
      await onRemoveMember(userId);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to remove member');
    } finally {
      setIsRemovingMember(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 max-w-md mx-auto sm:max-w-none">
      {/* Team header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate mr-2">{team.name}</h3>
        
        {/* Menu dropdown */}
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button
                  onClick={() => {
                    onEdit();
                    setMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Team
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  {isDeleting ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Team
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setAddMemberOpen(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Member
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Team description */}
      {team.description && (
        <div className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-none">
          {team.description}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mx-3 sm:mx-4 my-2 p-2 bg-red-100 border border-red-400 text-red-700 text-xs sm:text-sm rounded flex justify-between items-start">
          <span className="pr-2">{error}</span>
          <button 
            onClick={() => setError('')} 
            className="font-bold flex-shrink-0"
          >
            &times;
          </button>
        </div>
      )}
      
      {/* Add member form */}
      {addMemberOpen && (
        <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-200">
          <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Add Team Member</h4>
          <form onSubmit={handleAddMember}>
            <input
              type="email"
              placeholder="Email address"
              className="w-full p-1.5 sm:p-2 border rounded mb-2 text-xs sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <select
                className="p-1.5 sm:p-2 border rounded text-xs sm:text-sm w-full sm:w-auto sm:flex-grow sm:mr-2"
                value={role}
                onChange={(e) => setRole(e.target.value as 'member' | 'admin')}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex space-x-2 justify-end w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setAddMemberOpen(false)}
                  className="px-2 sm:px-3 py-1 border border-gray-300 rounded text-xs sm:text-sm flex-1 sm:flex-initial"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingMember}
                  className="px-2 sm:px-3 py-1 bg-blue-600 text-white rounded text-xs sm:text-sm flex items-center justify-center flex-1 sm:flex-initial"
                >
                  {isAddingMember ? (
                    <>
                      <Loader className="h-3 w-3 mr-1 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {/* Team members */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Team Members ({team.members.length})</h4>
        <ul className="space-y-1.5 sm:space-y-2">
          {team.members.map((member) => {
            const userId = typeof member.user === 'string' ? member.user : member.user.id;
            const userName = typeof member.user === 'string' ? 'Unknown User' : member.user.name;
            
            return (
              <li key={userId} className="flex justify-between items-center text-xs sm:text-sm">
                <div className="mr-2 truncate">
                  <span className="font-medium truncate block sm:inline">{userName}</span>
                  <span className="ml-0 sm:ml-2 text-xs px-1.5 sm:px-2 py-0.5 bg-gray-100 rounded-full inline-block mt-1 sm:mt-0">
                    {member.role}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveMember(userId)}
                  disabled={isRemovingMember === userId}
                  className="text-gray-500 hover:text-red-600 flex-shrink-0 ml-2"
                >
                  {isRemovingMember === userId ? (
                    <Loader className="h-3 sm:h-4 w-3 sm:w-4 animate-spin" />
                  ) : (
                    <UserMinus className="h-3 sm:h-4 w-3 sm:w-4" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default TeamCard;