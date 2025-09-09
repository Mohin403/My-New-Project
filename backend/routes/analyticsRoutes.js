import express from 'express';
import {
  getUserAnalytics,
  getTaskAnalytics,
  getUserActivity,
  logActivity
} from '../controllers/analyticsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getUserAnalytics);

router.route('/tasks')
  .get(getTaskAnalytics);

router.route('/activity')
  .get(getUserActivity)
  .post(logActivity);

export default router;