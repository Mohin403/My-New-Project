import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { Analytics } from '../models/analyticsModel.js';
import { ActivityLog } from '../models/analyticsLogModel.js';
import { Task } from '../models/taskModel.js';

// @desc    Get user analytics
// @route   GET /api/analytics
// @access  Private
const getUserAnalytics = asyncHandler(async (req, res) => {
  const { period } = req.query;
  let startDate, endDate = new Date();
  
  // Calculate date range based on period
  switch (period) {
    case 'week':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      // Default to last 30 days
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
  }

  // Get analytics data for the user
  const analytics = await Analytics.find({
    owner: req.user._id,
    'dateRange.start': { $gte: startDate },
    'dateRange.end': { $lte: endDate }
  }).sort({ 'dateRange.end': -1 });

  res.json(analytics);
});

// @desc    Get task completion analytics
// @route   GET /api/analytics/tasks
// @access  Private
const getTaskAnalytics = asyncHandler(async (req, res) => {
try {
    const { period } = req.query;
  let startDate, endDate = new Date();
  
  // Calculate date range based on period
  switch (period) {
    case 'week':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      // Default to last 30 days
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
  }

  // Get completed tasks
  const completedTasks = await Task.countDocuments({
    owner: req.user._id,
    status: 'completed',
    updatedAt: { $gte: startDate, $lte: endDate }
  });

  // Get total tasks
  const totalTasks = await Task.countDocuments({
    owner: req.user._id,
    createdAt: { $gte: startDate, $lte: endDate }
  });

  // Get tasks by priority
  const tasksByPriority = await Task.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get tasks by status
  const tasksByStatus = await Task.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Calculate completion rate
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Format priority and status data
  const priorityData = {};
  tasksByPriority.forEach(item => {
    priorityData[item._id] = item.count;
  });

  const statusData = {};
  tasksByStatus.forEach(item => {
    statusData[item._id] = item.count;
  });

  // Create analytics record
  const analyticsData = {
    analyticsId: uuidv4(),
    type: 'task_analytics',
    data: {
      completedTasks,
      totalTasks,
      completionRate,
      byPriority: priorityData,
      byStatus: statusData
    },
    dateRange: {
      start: startDate,
      end: endDate
    },
    owner: req.user._id
  };

  // Save analytics data
  const analytics = await Analytics.create(analyticsData);

  res.json(analytics);
} catch (error) {
  console.log("Get analytics error",error)
  res.status(500).json({
    message: "Someting went Wrong"
  })
}
});

// @desc    Get user activity logs
// @route   GET /api/analytics/activity
// @access  Private
const getUserActivity = asyncHandler(async (req, res) => {
  const { period } = req.query;
  let startDate, endDate = new Date();
  
  // Calculate date range based on period
  switch (period) {
    case 'week':
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      // Default to last 30 days
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
  }

  // Get activity logs
  const activityLogs = await ActivityLog.find({
    user: req.user._id,
    createdAt: { $gte: startDate, $lte: endDate }
  }).sort({ createdAt: -1 });

  // Group activities by type
  const activitiesByType = await ActivityLog.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$entityType',
        count: { $sum: 1 }
      }
    }
  ]);

  // Group activities by action
  const activitiesByAction = await ActivityLog.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 }
      }
    }
  ]);

  // Format activity data
  const byType = {};
  activitiesByType.forEach(item => {
    byType[item._id] = item.count;
  });

  const byAction = {};
  activitiesByAction.forEach(item => {
    byAction[item._id] = item.count;
  });

  res.json({
    logs: activityLogs,
    summary: {
      byType,
      byAction,
      total: activityLogs.length
    },
    dateRange: {
      start: startDate,
      end: endDate
    }
  });
});

// @desc    Log user activity
// @route   POST /api/analytics/activity
// @access  Private
const logActivity = asyncHandler(async (req, res) => {
  const { action, entityType, entityId, details } = req.body;

  const activityLog = await ActivityLog.create({
    logId: uuidv4(),
    action,
    entityType,
    entityId,
    details,
    user: req.user._id
  });

  if (activityLog) {
    res.status(201).json(activityLog);
  } else {
    res.status(400);
    throw new Error('Invalid activity data');
  }
});

export {
  getUserAnalytics,
  getTaskAnalytics,
  getUserActivity,
  logActivity
};