import express from 'express';
import {
  registerHotel,
  getAllHotels,
  getHotelById,
  getCurrentHotel,
  updateHotel,
  deleteHotel
} from '../controllers/hotel.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { requireAdminGlobal } from '../middleware/hotel.middleware.js';

const router = express.Router();

// Rutas públicas
router.post('/register', registerHotel);

// Rutas protegidas - cualquier usuario autenticado
router.get('/current', protect, getCurrentHotel);
router.get('/:id', protect, getHotelById);

// Rutas solo para admin_global
router.get('/', protect, requireAdminGlobal, getAllHotels);
router.put('/:id', protect, requireAdminGlobal, updateHotel);
router.delete('/:id', protect, requireAdminGlobal, deleteHotel);

export default router;
