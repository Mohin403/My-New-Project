import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '../models/notificationModel.js';

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 });
  res.json(notifications);
});

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private (Admin only)
const createNotification = asyncHandler(async (req, res) => {
  const { title, message, type, recipient } = req.body;

  const notification = await Notification.create({
    notificationId: uuidv4(),
    title,
    message,
    type: type || 'info',
    recipient: recipient || req.user._id,
  });

  if (notification) {
    res.status(201).json(notification);
  } else {
    res.status(400);
    throw new Error('Invalid notification data');
  }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    $or: [{ _id: req.params.id }, { notificationId: req.params.id }],
    recipient: req.user._id,
  });

  if (notification) {
    notification.read = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  );

  res.json({ message: 'All notifications marked as read' });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    $or: [{ _id: req.params.id }, { notificationId: req.params.id }],
    recipient: req.user._id,
  });

  if (notification) {
    await notification.deleteOne();
    res.json({ message: 'Notification removed' });
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
});

export {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};