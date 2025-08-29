import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../models/taskModel.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, startDate, endDate } = req.body;

  const task = await Task.create({
    taskId: uuidv4(),
    title,
    description,
    status: status || 'pending',
    priority: priority || 'medium',
    startDate,
    endDate,
    owner: req.user._id,
  });

  if (task) {
    res.status(201).json(task);
  } else {
    res.status(400);
    throw new Error('Invalid task data');
  }
});

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ owner: req.user._id });
  res.json(tasks);
});

// @desc    Get a task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({
    $or: [{ _id: req.params.id }, { taskId: req.params.id }],
    owner: req.user._id,
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
    owner: req.user._id,
  });

  if (task) {
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;
    task.priority = req.body.priority || task.priority;
    task.startDate = req.body.startDate || task.startDate;
    task.endDate = req.body.endDate || task.endDate;

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
    $or: [{ _id: req.params.id }, { taskId: req.params.id }],
    owner: req.user._id,
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

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksByPriority,
};