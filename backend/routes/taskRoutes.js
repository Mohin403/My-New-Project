import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksByPriority,
  shareTask,
  unshareTask,
} from '../controllers/taskController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .post(createTask)
  .get(getTasks);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// Task sharing routes
router.route('/:id/share').post(shareTask);
router.route('/:id/share/:userId').delete(unshareTask);

router.get('/status/:status', getTasksByStatus);
router.get('/priority/:priority', getTasksByPriority);

export default router;