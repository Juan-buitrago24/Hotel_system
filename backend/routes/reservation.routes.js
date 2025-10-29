import express from 'express';
import { body } from 'express-validator';
import {
  getReservations,
  getReservation,
  createReservation,
  updateReservation,
  deleteReservation,
  updateReservationStatus
} from '../controllers/reservation.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getReservations)
  .post([
    body('guestName').trim().notEmpty().withMessage('El nombre del huésped es requerido'),
    body('room').notEmpty().withMessage('La habitación es requerida'),
    body('checkIn').isISO8601().withMessage('Fecha de entrada inválida'),
    body('checkOut').isISO8601().withMessage('Fecha de salida inválida'),
    body('guests').isInt({ min: 1 }).withMessage('El número de huéspedes debe ser al menos 1')
  ], createReservation);

router.route('/:id')
  .get(getReservation)
  .put(updateReservation)
  .delete(authorize('admin'), deleteReservation);

router.patch('/:id/status', updateReservationStatus);

export default router;
