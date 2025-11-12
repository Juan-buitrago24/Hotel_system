import express from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { checkUserLimit } from '../middleware/checkPlanLimits.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('hotel_admin', 'admin_global')); // Hotel admins y admin global pueden gestionar usuarios

router.route('/')
  .get(getUsers)
  .post(checkUserLimit, createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
