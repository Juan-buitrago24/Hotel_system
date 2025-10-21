import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'No autorizado, token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    if (!req.user.active) {
      return res.status(401).json({ message: 'Usuario inactivo' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'No autorizado, token inválido' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `El rol ${req.user.role} no tiene permiso para realizar esta acción` 
      });
    }
    next();
  };
};
