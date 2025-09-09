import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { Event } from '../models/eventModel.js';

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, startDate, endDate, isAllDay } = req.body;

  const event = await Event.create({
    eventId: uuidv4(),
    title,
    description,
    startDate,
    endDate,
    isAllDay,
    owner: req.user._id,
  });

  if (event) {
    res.status(201).json(event);
  } else {
    res.status(400);
    throw new Error('Invalid event data');
  }
});

// @desc    Get all events for a user
// @route   GET /api/events
// @access  Private
const getEvents = asyncHandler(async (req, res) => {
  const { start, end } = req.query;
  
  // Build filter based on date range if provided
  const filter = { owner: req.user._id };
  if (start && end) {
    filter.$or = [
      // Events that start within the range
      { startDate: { $gte: new Date(start), $lte: new Date(end) } },
      // Events that end within the range
      { endDate: { $gte: new Date(start), $lte: new Date(end) } },
      // Events that span the entire range
      { $and: [{ startDate: { $lte: new Date(start) } }, { endDate: { $gte: new Date(end) } }] }
    ];
  }
  
  const events = await Event.find(filter).sort({ startDate: 1 });
  res.json(events);
});

// @desc    Get an event by ID
// @route   GET /api/events/:id
// @access  Private
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findOne({
    $and: [
      { $or: [{ _id: req.params.id }, { eventId: req.params.id }] },
      { owner: req.user._id }
    ]
  });

  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private
const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOne({
    $or: [{ _id: req.params.id }, { eventId: req.params.id }],
    owner: req.user._id
  });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  event.title = req.body.title || event.title;
  event.description = req.body.description !== undefined ? req.body.description : event.description;
  event.startDate = req.body.startDate || event.startDate;
  event.endDate = req.body.endDate || event.endDate;
  event.isAllDay = req.body.isAllDay !== undefined ? req.body.isAllDay : event.isAllDay;

  const updatedEvent = await event.save();
  res.json(updatedEvent);
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findOne({
    $or: [{ _id: req.params.id }, { eventId: req.params.id }],
    owner: req.user._id
  });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  await event.deleteOne();
  res.json({ message: 'Event removed' });
});

export {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};