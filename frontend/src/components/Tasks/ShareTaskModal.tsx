import React, { useState, useEffect } from 'react';
import { X, Users, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import taskService from '../../services/api/taskService';
import { Task, User } from '../../types';

interface ShareTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onTaskUpdated: (updatedTask: Task) => void;
}

const ShareTaskModal: React.FC<ShareTaskModalProps> = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const { user, getUsers } = useApp();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [sharedUsers, setSharedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      loadSharedUsers();
    }
  }, [isOpen, task]);

  const loadUsers = async () => {
    try {
      const allUsers = await getUsers();
      // Filter out current user and already shared users
      const filteredUsers = allUsers.filter(u => 
        u._id !== user?._id && 
        (!task.sharedWith || !task.sharedWith.includes(u._id))
      );
      setUsers(filteredUsers);
    } catch (err) {
      setError('Failed to load users');
      console.error(err);
    }
  };

  const loadSharedUsers = async () => {
    try {
      if (task.sharedWith && task.sharedWith.length > 0) {
        const allUsers = await getUsers();
        const shared = allUsers.filter(u => task.sharedWith?.includes(u._id));
        setSharedUsers(shared);
      } else {
        setSharedUsers([]);
      }
    } catch (err) {
      setError('Failed to load shared users');
      console.error(err);
    }
  };

  const handleShareTask = async () => {
    if (!selectedUserId) {
      setError('Please select a user');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const updatedTask = await taskService.shareTask(task._id, selectedUserId);
      onTaskUpdated(updatedTask);
      setSelectedUserId('');
      await loadUsers(); // Refresh user list
      await loadSharedUsers(); // Refresh shared users list
      onClose();
    } catch (err) {
      setError('Failed to share task');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnshareTask = async (userId: string) => {
    setIsLoading(true);
    setError('');

    try {
      const updatedTask = await taskService.unshareTask(task._id, userId);
      onTaskUpdated(updatedTask);
      await loadUsers(); // Refresh user list
      await loadSharedUsers(); // Refresh shared users list
      onClose();
    } catch (err) {
      setError('Failed to unshare task');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Share Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2 dark:text-white">Task: {task.title}</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Share with
            </label>
            <div className="flex">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="flex-grow border rounded-l-md p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={isLoading}
              >
                <option value="">Select a user</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </select>
              <button
                onClick={handleShareTask}
                disabled={isLoading || !selectedUserId}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 disabled:bg-gray-400"
              >
                <UserPlus size={20} />
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <Users size={16} className="mr-1" /> Shared with
            </h4>
            {sharedUsers.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">This task hasn't been shared with anyone yet.</p>
            ) : (
              <ul className="space-y-2">
                {sharedUsers.map(sharedUser => (
                  <li key={sharedUser._id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    <span className="dark:text-white">{sharedUser.name}</span>
                    <button
                      onClick={() => handleUnshareTask(sharedUser._id)}
                      disabled={isLoading}
                      className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                    >
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareTaskModal;