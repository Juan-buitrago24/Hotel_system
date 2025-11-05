import express from 'express';
import {
  getGuests,
  getGuest,
  createGuest,
  updateGuest,
  deleteGuest,
  getGuestHistory,
  searchGuestByDocument
} from '../controllers/guest.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// Rutas de CRUD básico
router.route('/')
  .get(getGuests)  // Todos los roles autenticados pueden ver huéspedes
  .post(authorize('hotel_admin', 'admin_global', 'empleado'), createGuest);  // Empleados pueden registrar huéspedes

router.route('/:id')
  .get(getGuest)  // Todos pueden ver detalles
  .put(authorize('hotel_admin', 'admin_global', 'empleado'), updateGuest)  // Empleados pueden actualizar
  .delete(authorize('hotel_admin', 'admin_global'), deleteGuest);  // Solo admins eliminan

// Rutas especiales
router.get('/:id/history', getGuestHistory);  // Historial de reservas
router.get('/search/:documentNumber', searchGuestByDocument);  // Buscar por documento

export default router;
