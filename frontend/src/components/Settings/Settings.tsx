import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role: string;
  timezone: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    taskReminders: boolean;
    teamUpdates: boolean;
  };
  theme: 'light' | 'dark' | 'system';
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // User profile state
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    avatar: '',
    role: '',
    timezone: 'UTC',
    notificationPreferences: {
      email: true,
      push: true,
      taskReminders: true,
      teamUpdates: true,
    },
    theme: 'light',
  });

  // Mock loading user profile data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (user) {
        setProfile({
          name: user.name || 'User',
          email: user.email || 'user@example.com',
          avatar: user.profilePhoto || 'https://via.placeholder.com/150',
          role: 'User',
          timezone: 'America/New_York',
          notificationPreferences: {
            email: true,
            push: true,
            taskReminders: true,
            teamUpdates: false,
          },
          theme: 'light',
        });
      }
      setLoading(false);
    }, 1000);
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [name]: checked,
      },
    }));
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setProfile(prev => ({
      ...prev,
      theme,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call to save profile
    setTimeout(() => {
      setSaving(false);
      setSuccessMessage('Settings saved successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }, 1500);
  };

  const renderProfileTab = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
              <img 
                src={profile?.avatar || 'https://via.placeholder.com/150'} 
                alt="" 
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              type="button"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Change Avatar
            </button>
          </div>
        </div>
        
        <div className="md:w-2/3 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={profile.role}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>
          
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              id="timezone"
              name="timezone"
              value={profile.timezone}
              onChange={handleProfileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="America/Chicago">Central Time (US & Canada)</option>
              <option value="America/Denver">Mountain Time (US & Canada)</option>
              <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );

  const renderPreferencesTab = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notification Preferences</h3>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="email"
              name="email"
              checked={profile.notificationPreferences.email}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="email" className="ml-2 block text-sm text-gray-700">
              Email Notifications
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="push"
              name="push"
              checked={profile.notificationPreferences.push}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="push" className="ml-2 block text-sm text-gray-700">
              Push Notifications
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="taskReminders"
              name="taskReminders"
              checked={profile.notificationPreferences.taskReminders}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="taskReminders" className="ml-2 block text-sm text-gray-700">
              Task Reminders
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="teamUpdates"
              name="teamUpdates"
              checked={profile.notificationPreferences.teamUpdates}
              onChange={handleNotificationChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="teamUpdates" className="ml-2 block text-sm text-gray-700">
              Team Updates
            </label>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Theme Preferences</h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div
            onClick={() => handleThemeChange('light')}
            className={`border rounded-md p-4 cursor-pointer ${profile.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          >
            <div className="h-12 bg-white border border-gray-200 rounded mb-2"></div>
            <div className="text-center text-sm">Light</div>
          </div>
          
          <div
            onClick={() => handleThemeChange('dark')}
            className={`border rounded-md p-4 cursor-pointer ${profile.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          >
            <div className="h-12 bg-gray-800 border border-gray-700 rounded mb-2"></div>
            <div className="text-center text-sm">Dark</div>
          </div>
          
          <div
            onClick={() => handleThemeChange('system')}
            className={`border rounded-md p-4 cursor-pointer ${profile.theme === 'system' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          >
            <div className="h-12 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded mb-2"></div>
            <div className="text-center text-sm">System</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );

  const renderSecurityTab = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Change Password</h3>
        
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
        
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Enable
          </button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'preferences' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'security' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Security
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'preferences' && renderPreferencesTab()}
              {activeTab === 'security' && renderSecurityTab()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;