import express from 'express';
import { body } from 'express-validator';
import { login, register, getMe } from '../controllers/auth.controller.js';
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

export default router;
