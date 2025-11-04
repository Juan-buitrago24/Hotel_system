import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // Solo admins pueden gestionar usuarios

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
