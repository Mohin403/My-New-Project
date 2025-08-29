import asyncHandler from 'express-async-handler';
import { v4 as uuidv4 } from 'uuid';
import { Team } from '../models/teamModel.js';
import { User } from '../models/userModel.js';

// @desc    Create a new team
// @route   POST /api/teams
// @access  Private
const createTeam = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const team = await Team.create({
    teamId: uuidv4(),
    name,
    description,
    members: [{ user: req.user._id, role: 'admin' }],
    owner: req.user._id,
  });

  if (team) {
    res.status(201).json(team);
  } else {
    res.status(400);
    throw new Error('Invalid team data');
  }
});

// @desc    Get all teams for a user
// @route   GET /api/teams
// @access  Private
const getTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find({
    $or: [
      { owner: req.user._id },
      { 'members.user': req.user._id },
    ],
  }).populate('members.user', 'name email profilePhoto');
  
  res.json(teams);
});

// @desc    Get a team by ID
// @route   GET /api/teams/:id
// @access  Private
const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findOne({
    $or: [{ _id: req.params.id }, { teamId: req.params.id }],
    $or: [
      { owner: req.user._id },
      { 'members.user': req.user._id },
    ],
  }).populate('members.user', 'name email profilePhoto');

  if (team) {
    res.json(team);
  } else {
    res.status(404);
    throw new Error('Team not found');
  }
});

// @desc    Update a team
// @route   PUT /api/teams/:id
// @access  Private/TeamAdmin
const updateTeam = asyncHandler(async (req, res) => {
  const team = await Team.findOne({
    $or: [{ _id: req.params.id }, { teamId: req.params.id }],
  });

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if user is team owner or admin
  const isAdmin = team.owner.equals(req.user._id) || 
    team.members.some(member => 
      member.user.equals(req.user._id) && member.role === 'admin'
    );

  if (!isAdmin) {
    res.status(403);
    throw new Error('Not authorized to update team');
  }

  team.name = req.body.name || team.name;
  team.description = req.body.description || team.description;

  const updatedTeam = await team.save();
  res.json(updatedTeam);
});

// @desc    Delete a team
// @route   DELETE /api/teams/:id
// @access  Private/TeamOwner
const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findOne({
    $or: [{ _id: req.params.id }, { teamId: req.params.id }],
  });

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Only team owner can delete team
  if (!team.owner.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to delete team');
  }

  await team.deleteOne();
  res.json({ message: 'Team removed' });
});

// @desc    Add member to team
// @route   POST /api/teams/:id/members
// @access  Private/TeamAdmin
const addTeamMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  
  // Find user by email
  const user = await User.findOne({ email });
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  const team = await Team.findOne({
    $or: [{ _id: req.params.id }, { teamId: req.params.id }],
  });

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if user is team owner or admin
  const isAdmin = team.owner.equals(req.user._id) || 
    team.members.some(member => 
      member.user.equals(req.user._id) && member.role === 'admin'
    );

  if (!isAdmin) {
    res.status(403);
    throw new Error('Not authorized to add members');
  }

  // Check if user is already a member
  const isMember = team.members.some(member => 
    member.user.equals(user._id)
  );

  if (isMember) {
    res.status(400);
    throw new Error('User is already a member of this team');
  }

  // Add user to team
  team.members.push({
    user: user._id,
    role: role || 'member',
  });

  await team.save();
  
  const updatedTeam = await Team.findById(team._id)
    .populate('members.user', 'name email profilePhoto');
    
  res.json(updatedTeam);
});

// @desc    Remove member from team
// @route   DELETE /api/teams/:id/members/:userId
// @access  Private/TeamAdmin
const removeTeamMember = asyncHandler(async (req, res) => {
  const team = await Team.findOne({
    $or: [{ _id: req.params.id }, { teamId: req.params.id }],
  });

  if (!team) {
    res.status(404);
    throw new Error('Team not found');
  }

  // Check if user is team owner or admin
  const isAdmin = team.owner.equals(req.user._id) || 
    team.members.some(member => 
      member.user.equals(req.user._id) && member.role === 'admin'
    );

  if (!isAdmin) {
    res.status(403);
    throw new Error('Not authorized to remove members');
  }

  // Cannot remove the owner
  if (team.owner.toString() === req.params.userId) {
    res.status(400);
    throw new Error('Cannot remove team owner');
  }

  // Remove member
  team.members = team.members.filter(
    member => member.user.toString() !== req.params.userId
  );

  await team.save();
  
  const updatedTeam = await Team.findById(team._id)
    .populate('members.user', 'name email profilePhoto');
    
  res.json(updatedTeam);
});

export {
  createTeam,
  getTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
};