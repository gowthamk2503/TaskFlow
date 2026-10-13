import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import { projectValidation } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(projectValidation, createProject);

router.route('/:id')
  .get(getProjectById)
  .patch(projectValidation, updateProject)
  .delete(deleteProject);

router.route('/:id/members')
  .post(addProjectMember);

router.route('/:id/members/:userId')
  .delete(removeProjectMember);

export default router;
