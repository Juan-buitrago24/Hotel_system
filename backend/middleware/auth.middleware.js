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
    // Mapeo de roles antiguos a nuevos para compatibilidad
    const roleMapping = {
      'admin': 'hotel_admin',
      'super_admin': 'admin_global'
    };

    // Obtener el rol actual del usuario (con mapeo si es necesario)
    const userRole = roleMapping[req.user.role] || req.user.role;

    if (!roles.includes(userRole) && !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `El rol ${req.user.role} no tiene permiso para realizar esta acción` 
      });
    }
    next();
  };
};

// Middleware específico para solo administradores
export const adminOnly = (req, res, next) => {
  const adminRoles = ['hotel_admin', 'admin', 'admin_global'];
  
  if (!adminRoles.includes(req.user.role)) {
    return res.status(403).json({ 
      message: `Acceso denegado. Se requiere rol de administrador.` 
    });
  }
  
  next();
};
