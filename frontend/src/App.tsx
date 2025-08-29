import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Tasks from './components/Tasks/Tasks';
import Notes from './components/Notes/Notes';
import Teams from './components/Teams/Teams';

// Calendar placeholder component
const Calendar: React.FC = () => {
  return (
    <div className="text-center py-8 sm:py-12">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Calendar Coming Soon</h2>
      <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">Calendar integration with event management will be available in the next update.</p>
    </div>
  );
};

// Teams component is now imported from './components/Teams/Teams'

// Analytics placeholder component
const Analytics: React.FC = () => {
  return (
    <div className="text-center py-8 sm:py-12">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Analytics Coming Soon</h2>
      <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">Advanced analytics and insights will be available in the next update.</p>
    </div>
  );
};

// Notifications placeholder component
const Notifications: React.FC = () => {
  return (
    <div className="text-center py-8 sm:py-12">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Notifications</h2>
      <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">Notification management will be available in the next update.</p>
    </div>
  );
};

// Settings placeholder component
const Settings: React.FC = () => {
  return (
    <div className="text-center py-8 sm:py-12">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Settings</h2>
      <p className="text-sm sm:text-base text-gray-600 px-4 sm:px-0">User settings and preferences will be available in the next update.</p>
    </div>
  );
};

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main layout component with sidebar and header
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={activeTab} 
          onAddClick={activeTab === 'tasks' || activeTab === 'notes' ? () => {} : undefined}
          showAddButton={activeTab === 'tasks' || activeTab === 'notes'}
        />
        <main className="flex-1 overflow-auto p-2 sm:p-3 md:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const getTabTitle = (tab: string) => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      tasks: 'Tasks',
      calendar: 'Calendar',
      notes: 'Notes',
      teams: 'Teams',
      analytics: 'Analytics',
      notifications: 'Notifications',
      settings: 'Settings',
    };
    return titles[tab] || 'TaskFlow Pro';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return <Tasks />;
      case 'notes':
        return <Notes />;
      case 'calendar':
        return <Calendar />;
      case 'teams':
        return <Teams />;
      case 'analytics':
        return <Analytics />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Routes>
      <Route path="/login" element={
        loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : !isAuthenticated ? <LoginForm /> : <Navigate to="/" replace />
      } />
      <Route path="/register" element={
        loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : !isAuthenticated ? <RegisterForm /> : <Navigate to="/" replace />
      } />
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute>
          <MainLayout>
            <Tasks />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/notes" element={
        <ProtectedRoute>
          <MainLayout>
            <Notes />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/calendar" element={
        <ProtectedRoute>
          <MainLayout>
            <Calendar />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/teams" element={
        <ProtectedRoute>
          <MainLayout>
            <Teams />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <MainLayout>
            <Analytics />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute>
          <MainLayout>
            <Notifications />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <MainLayout>
            <Settings />
          </MainLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;