import express from 'express';
import * as planController from '../controllers/plan.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', planController.getAllPlans);
router.get('/:id', planController.getPlanById);

// Rutas protegidas (solo admin)
router.post('/', protect, adminOnly, planController.createPlan);
router.put('/:id', protect, adminOnly, planController.updatePlan);
router.delete('/:id', protect, adminOnly, planController.deletePlan);

export default router;
