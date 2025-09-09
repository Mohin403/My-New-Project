import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Get all users route (accessible to all authenticated users for task sharing)
router.get('/all', protect, getUsers);

// Admin routes
router.route('/')
  .get(protect, getUsers);

router.route('/:id')
  .delete(protect, admin, deleteUser);

export default router;