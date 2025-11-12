import express from 'express';
import { 
  uploadImages, 
  deleteImage, 
  setPrimaryImage, 
  reorderImages,
  getRoomImages 
} from '../controllers/image.controller.js';
import { upload } from '../config/cloudinary.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import { checkPlanFeature } from '../middleware/checkPlanLimits.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación de admin
router.use(protect);
router.use(adminOnly);

// Verificar que el plan tenga acceso a Cloudinary (Professional+)
router.use(checkPlanFeature('cloudinary'));

// Obtener imágenes de una habitación
router.get('/:roomId', getRoomImages);

// Subir múltiples imágenes (máximo 5 por request)
router.post('/:roomId/upload', upload.array('images', 5), uploadImages);

// Eliminar una imagen
router.delete('/:roomId/:imageId', deleteImage);

// Establecer imagen principal
router.patch('/:roomId/:imageId/primary', setPrimaryImage);

// Reordenar imágenes
router.patch('/:roomId/reorder', reorderImages);

export default router;
