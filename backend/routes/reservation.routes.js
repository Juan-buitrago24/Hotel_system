import express from 'express';
import { body } from 'express-validator';
import {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
  updateReservationStatus,
  checkExtensionAvailability,
  extendStay
} from '../controllers/reservation.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { filterByHotel, assignHotel } from '../middleware/hotel.middleware.js';

const router = express.Router();

router.use(protect);
router.use(filterByHotel); // Aplicar filtro de hotel

router.route('/')
  .get(getReservations)
  .post(assignHotel, [
    body('guestName').trim().notEmpty().withMessage('El nombre del huésped es requerido'),
    body('room').notEmpty().withMessage('La habitación es requerida'),
    body('checkIn').isISO8601().withMessage('Fecha de entrada inválida'),
    body('checkOut').isISO8601().withMessage('Fecha de salida inválida'),
    body('guests').isInt({ min: 1 }).withMessage('El número de huéspedes debe ser al menos 1')
  ], createReservation);

router.route('/:id')
  .get(getReservation)
  .put(updateReservation)
  .delete(authorize('hotel_admin', 'admin_global'), deleteReservation);

router.patch('/:id/status', updateReservationStatus);

// Rutas para extensión de estadía
router.post('/:id/check-extension', checkExtensionAvailability);
router.post('/:id/extend', extendStay);

export default router;
