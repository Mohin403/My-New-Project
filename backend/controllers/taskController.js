import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import { Task } from '../models/taskModel.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, startDate, endDate, teamId, sharedWith, attachments } = req.body;

  const task = await Task.create({
    taskId: uuidv4(),
    title,
    description,
    status: status || 'pending',
    priority: priority || 'medium',
    startDate,
    endDate,
    owner: req.user._id,
    teamId,
    sharedWith,
    attachments,
  });

  if (task) {
    res.status(201).json(task);
  } else {
    res.status(400);
    throw new Error('Invalid task data');
  }
});

// @desc    Get all tasks for a user (including shared tasks)
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    $or: [
      { owner: req.user._id },
      { sharedWith: req.user._id },
      { teamId: { $in: req.user.teams } }
    ]
  }).populate('teamId', 'name');
  res.json(tasks);
});

// @desc    Get a task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    $or: [{ _id: req.params.id }, { taskId: req.params.id }]
  });

  if (task) {
    res.json(task);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    $or: [{ _id: req.params.id }, { taskId: req.params.id }],
    $or: [
      { owner: req.user._id },
      { sharedWith: req.user._id },
      { teamId: { $in: req.user.teams } }
    ]
  });

  if (task) {
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.startDate = req.body.startDate || task.startDate;
    task.endDate = req.body.endDate || task.endDate;
    task.teamId = req.body.teamId || task.teamId;
    task.sharedWith = req.body.sharedWith || task.sharedWith;
    task.attachments = req.body.attachments || task.attachments;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    $or: [{ _id: req.params.id }, { taskId: req.params.id }]
  });

  if (task) {
    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Get tasks by status
// @route   GET /api/tasks/status/:status
// @access  Private
const getTasksByStatus = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    owner: req.user._id,
    status: req.params.status,
  });

  res.json(tasks);
});

// @desc    Get tasks by priority
// @route   GET /api/tasks/priority/:priority
// @access  Private
const getTasksByPriority = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    owner: req.user._id,
    priority: req.params.priority,
  });

  res.json(tasks);
});

// @desc    Share a task with a user
// @route   POST /api/tasks/:id/share
// @access  Private
const shareTask = asyncHandler(async (req, res) => {
 try {
   const { userId } = req.body;
  
  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }
  
  const task = await Task.findOne({
    $or: [{ _id: req.params.id }, { taskId: req.params.id }]
  });
  
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  
  // Verify the current user is the owner of the task
  if (task.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to share this task');
  }
  
  // Convert userId to ObjectId
  const userObjectId = new mongoose.Types.ObjectId(userId);
  
  // Check if user is already in sharedWith
  if (task.sharedWith && task.sharedWith.some(id => id.toString() === userObjectId.toString())) {
    res.status(400);
    throw new Error('Task already shared with this user');
  }
  
  // Add user to sharedWith array
  if (!task.sharedWith) {
    task.sharedWith = [userObjectId];
  } else {
    task.sharedWith.push(userObjectId);
  }
  
  const updatedTask = await task.save();
  res.json(updatedTask);
 } catch (error) {
  res.status(400);
  console.log("Task error",error)
  throw new Error(error.message);
 }
});

// @desc    Unshare a task with a user
// @route   DELETE /api/tasks/:id/share/:userId
// @access  Private
const unshareTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    $or: [{ _id: req.params.id }, { taskId: req.params.id }],
    owner: req.user._id,
  });
  
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  
  // Remove user from sharedWith array
  if (task.sharedWith) {
    task.sharedWith = task.sharedWith.filter(
      userId => userId.toString() !== req.params.userId
    );
  }
  
  const updatedTask = await task.save();
  res.json(updatedTask);
});

export { 
  createTask, 
  getTasks, 
  getTaskById, 
  updateTask, 
  deleteTask, 
  getTasksByStatus, 
  getTasksByPriority,
  shareTask,
  unshareTask
};