import React, { useState } from 'react';
import { Search, Plus, Bell, User, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  title: string;
  onAddClick?: () => void;
  showAddButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, onAddClick, showAddButton = true }) => {
  const { user, notifications } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="ml-10 sm:ml-12 lg:ml-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 hidden sm:block">
            Welcome back, {user?.name}
          </p>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          {/* Search - Mobile Toggle */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="md:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
          
         
          
          {/* Mobile Search Expanded */}
          {isSearchOpen && (
            <div className="absolute top-14 sm:top-16 left-0 right-0 bg-white p-3 sm:p-4 shadow-md z-20 md:hidden">
              <div className="relative">
                <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Add Button */}
          {showAddButton && onAddClick && (
            <button
              onClick={onAddClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-1.5 sm:px-2 md:px-4 py-1.5 sm:py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-1 sm:space-x-2"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add New</span>
            </button>
          )}

          {/* Notifications */}
          <button className="relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 sm:px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;