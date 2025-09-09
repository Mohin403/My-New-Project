import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import analyticsService from '../../services/api/analyticsService';

const Analytics: React.FC = () => {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [taskAnalytics, setTaskAnalytics] = useState<any>(null);
  const [activityData, setActivityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch task analytics
        const taskData = await analyticsService.getTaskAnalytics(period);
        setTaskAnalytics(taskData);
        
        // Fetch activity data
        const activity = await analyticsService.getUserActivity(period);
        setActivityData(activity);
      } catch (err) {
        setError('Failed to load analytics data. Please try again.');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [period]);

  // Format data for priority chart
  const getPriorityChartData = () => {
    if (!taskAnalytics || !taskAnalytics.data || !taskAnalytics.data.byPriority) {
      return [];
    }

    return [
      { name: 'High', value: taskAnalytics.data.byPriority.high || 0 },
      { name: 'Medium', value: taskAnalytics.data.byPriority.medium || 0 },
      { name: 'Low', value: taskAnalytics.data.byPriority.low || 0 },
    ];
  };

  // Format data for status chart
  const getStatusChartData = () => {
    if (!taskAnalytics || !taskAnalytics.data || !taskAnalytics.data.byStatus) {
      return [];
    }

    return [
      { name: 'Pending', value: taskAnalytics.data.byStatus.pending || 0 },
      { name: 'In Progress', value: taskAnalytics.data.byStatus['in-progress'] || 0 },
      { name: 'Completed', value: taskAnalytics.data.byStatus.completed || 0 },
    ];
  };

  // Format data for activity chart
  const getActivityChartData = () => {
    if (!activityData || !activityData.summary || !activityData.summary.byType) {
      return [];
    }

    return Object.entries(activityData.summary.byType).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }));
  };

  // Format data for action chart
  const getActionChartData = () => {
    if (!activityData || !activityData.summary || !activityData.summary.byAction) {
      return [];
    }

    return Object.entries(activityData.summary.byAction).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value,
    }));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setPeriod('week')} 
            className={`px-4 py-2 rounded ${period === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Week
          </button>
          <button 
            onClick={() => setPeriod('month')} 
            className={`px-4 py-2 rounded ${period === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Month
          </button>
          <button 
            onClick={() => setPeriod('year')} 
            className={`px-4 py-2 rounded ${period === 'year' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Year
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading analytics data...</div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task Completion Summary */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Task Completion</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Total Tasks</div>
                <div className="text-2xl font-bold">{taskAnalytics?.data?.totalTasks || 0}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Completed</div>
                <div className="text-2xl font-bold">{taskAnalytics?.data?.completedTasks || 0}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Completion Rate</div>
                <div className="text-2xl font-bold">
                  {taskAnalytics?.data?.completionRate ? `${Math.round(taskAnalytics.data.completionRate)}%` : '0%'}
                </div>
              </div>
            </div>
            
            <h3 className="text-md font-medium mb-2">Tasks by Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getStatusChartData()} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Task Priority Distribution */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Task Priority Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getPriorityChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {getPriorityChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* User Activity by Type */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Activity by Type</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getActivityChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* User Activity by Action */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Activity by Action</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getActionChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {getActionChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;