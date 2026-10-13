import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  addTaskComment,
  deleteTaskComment,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { taskValidation } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(taskValidation, createTask);

router.route('/:id')
  .get(getTaskById)
  .patch(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

router.route('/:id/comments')
  .post(addTaskComment);

router.route('/:id/comments/:commentId')
  .delete(deleteTaskComment);

export default router;
