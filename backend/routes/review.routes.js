import express from 'express';
import * as reviewController from '../controllers/review.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', reviewController.getReviews);
router.get('/:id', reviewController.getReviewById);

// Rutas protegidas (requieren autenticación)
router.post('/', protect, reviewController.createReview);
router.put('/:id', protect, reviewController.updateReview);
router.delete('/:id', protect, reviewController.deleteReview);

// Responder a reseñas (solo hotel_admin o admin_global)
router.post('/:id/response', protect, authorize('hotel_admin', 'admin_global'), reviewController.respondToReview);

// Marcar como útil (requiere autenticación)
router.post('/:id/helpful', protect, reviewController.markAsHelpful);

export default router;
