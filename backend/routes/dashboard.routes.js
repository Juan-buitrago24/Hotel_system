import express from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { filterByHotel } from '../middleware/hotel.middleware.js';

const router = express.Router();

// Proteger todas las rutas de dashboard
router.use(protect);
router.use(filterByHotel); // Aplicar filtro de hotel

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

export default router;
