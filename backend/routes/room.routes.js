import express from 'express';
import { body } from 'express-validator';
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus
} from '../controllers/room.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // Todas las rutas requieren autenticación

router.route('/')
  .get(getRooms)
  .post(authorize('admin'), [
    body('number').trim().notEmpty().withMessage('El número de habitación es requerido'),
    body('type').isIn(['simple', 'doble', 'suite', 'familiar']).withMessage('Tipo de habitación inválido'),
    body('capacity').isInt({ min: 1 }).withMessage('La capacidad debe ser al menos 1'),
    body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
    body('floor').isInt({ min: 1 }).withMessage('El piso debe ser al menos 1')
  ], createRoom);

router.route('/:id')
  .get(getRoom)
  .put(authorize('admin'), updateRoom)
  .delete(authorize('admin'), deleteRoom);

router.patch('/:id/status', updateRoomStatus);

export default router;
