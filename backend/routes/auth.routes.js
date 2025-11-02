import express from 'express';
import { body } from 'express-validator';
import { 
  login, 
  register, 
  getMe, 
  updateProfile, 
  verifyAccount, 
  forgotPassword, 
  resetPassword 
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', [
  body('username').trim().notEmpty().withMessage('El usuario es requerido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
], login);

router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').optional().isEmail().withMessage('Email inválido')
], register);

router.get('/me', protect, getMe);

// Actualizar perfil (requiere autenticación)
router.put('/profile', protect, [
  body('name').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('newPassword').optional().isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
], updateProfile);

// Verificar cuenta
router.get('/verify/:token', verifyAccount);

// Solicitar reset de contraseña
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Email inválido')
], forgotPassword);

// Resetear contraseña con token
router.post('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], resetPassword);

export default router;
