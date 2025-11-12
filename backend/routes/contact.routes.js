import express from 'express';
import { sendContactMessage } from '../controllers/contact.controller.js';

const router = express.Router();

// Ruta pública para enviar mensajes de contacto
router.post('/', sendContactMessage);

export default router;
