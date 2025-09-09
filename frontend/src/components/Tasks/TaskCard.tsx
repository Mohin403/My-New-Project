import React, { useState } from 'react';
import { Calendar, Clock, MoreVertical, Edit, Trash2, Loader, Users, Paperclip, Share2 } from 'lucide-react';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task['status']) => void;
  onShare?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange, onShare }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [actionError, setActionError] = useState('');

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200',
  };

  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in-progress':
        return '⟳';
      default:
        return '○';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              {onShare && (
                <button
                  onClick={() => {
                    onShare(task);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              )}
              <button
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => {
                  setIsDeleting(true);
                  setActionError('');
                  try {
                    onDelete(task._id);
                    setShowMenu(false);
                  } catch (error: any) {
                    console.error('Failed to delete task:', error);
                    setActionError(error.message || 'Failed to delete task');
                    // Keep menu open so user can try again
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${priorityColors[task.priority]}`}>
          {task.priority} priority
        </span>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[task.status]}`}>
          {getStatusIcon(task.status)} {task.status.replace('-', ' ')}
        </span>
        {task.teamId && (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 flex items-center gap-1">
            <Users className="w-3 h-3" />
            Team
          </span>
        )}
        {task.attachments && task.attachments.length > 0 && (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
            <Paperclip className="w-3 h-3" />
            {task.attachments.length}
          </span>
        )}
      </div>

      {/* Dates */}
      {(task.startDate || task.endDate) && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4">
          {task.startDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Start: {new Date(task.startDate).toLocaleDateString()}</span>
            </div>
          )}
          {task.endDate && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>Due: {new Date(task.endDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}

      {/* Status Change Buttons */}
      <div className="flex flex-wrap items-center gap-2 mt-2">
        {task.status !== 'pending' && (
          <button
            onClick={async () => {
              setIsChangingStatus(true);
              setActionError('');
              try {
                await onStatusChange(task._id, 'pending');
              } catch (error: any) {
                console.error('Failed to update task status:', error);
                setActionError(error.message || 'Failed to update status');
              } finally {
                setIsChangingStatus(false);
              }
            }}
            className="px-2 sm:px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            Mark Pending
          </button>
        )}
        {task.status !== 'in-progress' && (
          <button
            onClick={async () => {
              setIsChangingStatus(true);
              setActionError('');
              try {
                await onStatusChange(task._id, 'in-progress');
              } catch (error: any) {
                console.error('Failed to update task status:', error);
                setActionError(error.message || 'Failed to update status');
              } finally {
                setIsChangingStatus(false);
              }
            }}
            className="px-2 sm:px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors duration-200"
          >
            Start Progress
          </button>
        )}
        {task.status !== 'completed' && (
          <button
            onClick={async () => {
              setIsChangingStatus(true);
              setActionError('');
              try {
                await onStatusChange(task._id, 'completed');
              } catch (error: any) {
                console.error('Failed to update task status:', error);
                setActionError(error.message || 'Failed to update status');
              } finally {
                setIsChangingStatus(false);
              }
            }}
            className="px-2 sm:px-3 py-1 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-lg transition-colors duration-200"
          >
            Complete
          </button>
        )}
      </div>
      
      {/* Loading and Error States */}
      {(isDeleting || isChangingStatus) && (
        <div className="mt-4 flex items-center text-blue-600">
          <Loader className="w-4 h-4 mr-2 animate-spin" />
          <span className="text-xs">{isDeleting ? 'Deleting...' : 'Updating status...'}</span>
        </div>
      )}
      
      {actionError && (
        <div className="mt-4 text-xs text-red-600">
          {actionError}
        </div>
      )}
    </div>
  );
};

export default TaskCard;