import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { Note } from '../models/noteModel.js';

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags, category } = req.body;

  const note = await Note.create({
    noteId: uuidv4(),
    title,
    content,
    tags: tags || [],
    category: category || 'general',
    owner: req.user._id,
  });

  if (note) {
    res.status(201).json(note);
  } else {
    res.status(400);
    throw new Error('Invalid note data');
  }
});

// @desc    Get all notes for a user
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ owner: req.user._id });
  res.json(notes);
});

// @desc    Get a note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    $or: [{ _id: req.params.id }, { noteId: req.params.id }],
    owner: req.user._id,
  });

  if (note) {
    res.json(note);
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    $or: [{ _id: req.params.id }, { noteId: req.params.id }],
    owner: req.user._id,
  });

  if (note) {
    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    note.tags = req.body.tags || note.tags;
    note.category = req.body.category || note.category;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findOne({
    $or: [{ _id: req.params.id }, { noteId: req.params.id }],
    owner: req.user._id,
  });

  if (note) {
    await note.deleteOne();
    res.json({ message: 'Note removed' });
  } else {
    res.status(404);
    throw new Error('Note not found');
  }
});

// @desc    Get notes by tag
// @route   GET /api/notes/tag/:tag
// @access  Private
const getNotesByTag = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    owner: req.user._id,
    tags: req.params.tag,
  });

  res.json(notes);
});

// @desc    Get notes by category
// @route   GET /api/notes/category/:category
// @access  Private
const getNotesByCategory = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    owner: req.user._id,
    category: req.params.category,
  });

  res.json(notes);
});

export {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  getNotesByTag,
  getNotesByCategory,
};