import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updatePassword,
  searchUsers,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { passwordChangeValidation } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/me', getUserProfile);
router.patch('/me', updateUserProfile);
router.patch('/me/password', passwordChangeValidation, updatePassword);
router.get('/search', searchUsers);

export default router;
