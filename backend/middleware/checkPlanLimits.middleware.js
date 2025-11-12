import User from '../models/User.model.js';
import Room from '../models/Room.model.js';

// Middleware para verificar límites de habitaciones
export const checkRoomLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Obtener el usuario con su plan
    const user = await User.findById(userId).populate('plan');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Si no tiene plan o es admin global, permitir
    if (!user.plan || user.role === 'admin_global') {
      return next();
    }
    
    // Verificar si el plan está activo
    if (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trial') {
      return res.status(403).json({ 
        message: 'Tu suscripción no está activa. Por favor renueva tu plan.',
        code: 'SUBSCRIPTION_INACTIVE'
      });
    }
    
    // Contar habitaciones actuales del hotel
    const roomCount = await Room.countDocuments({ 
      hotel: user.hotel,
      isActive: true 
    });
    
    // Verificar límite del plan
    if (roomCount >= user.plan.maxRooms) {
      return res.status(403).json({ 
        message: `Has alcanzado el límite de ${user.plan.maxRooms} habitaciones de tu plan ${user.plan.name}.`,
        currentRooms: roomCount,
        maxRooms: user.plan.maxRooms,
        planName: user.plan.name,
        code: 'ROOM_LIMIT_REACHED'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error verificando límite de habitaciones:', error);
    res.status(500).json({ 
      message: 'Error al verificar límite de habitaciones',
      error: error.message 
    });
  }
};

// Middleware para verificar límites de usuarios
export const checkUserLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Obtener el usuario que está creando otro usuario
    const user = await User.findById(userId).populate('plan');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Si no tiene plan o es admin global, permitir
    if (!user.plan || user.role === 'admin_global') {
      return next();
    }
    
    // Verificar si el plan está activo
    if (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trial') {
      return res.status(403).json({ 
        message: 'Tu suscripción no está activa. Por favor renueva tu plan.',
        code: 'SUBSCRIPTION_INACTIVE'
      });
    }
    
    // Contar usuarios actuales del hotel
    const userCount = await User.countDocuments({ 
      hotel: user.hotel,
      active: true,
      role: { $ne: 'cliente' } // No contar clientes, solo staff
    });
    
    // Verificar límite del plan
    if (userCount >= user.plan.maxUsers) {
      return res.status(403).json({ 
        message: `Has alcanzado el límite de ${user.plan.maxUsers} usuarios de tu plan ${user.plan.name}.`,
        currentUsers: userCount,
        maxUsers: user.plan.maxUsers,
        planName: user.plan.name,
        code: 'USER_LIMIT_REACHED'
      });
    }
    
    next();
  } catch (error) {
    console.error('Error verificando límite de usuarios:', error);
    res.status(500).json({ 
      message: 'Error al verificar límite de usuarios',
      error: error.message 
    });
  }
};

// Middleware para verificar características del plan
export const checkPlanFeature = (feature) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      // Obtener el usuario con su plan
      const user = await User.findById(userId).populate('plan');
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      // Si es admin global, permitir todo
      if (user.role === 'admin_global') {
        return next();
      }
      
      // Si no tiene plan, denegar features premium
      if (!user.plan) {
        return res.status(403).json({ 
          message: 'Esta característica requiere una suscripción activa.',
          feature,
          code: 'FEATURE_NOT_AVAILABLE'
        });
      }
      
      // Verificar si el plan tiene la característica
      if (!user.plan[feature]) {
        return res.status(403).json({ 
          message: `Esta característica no está disponible en tu plan ${user.plan.name}.`,
          feature,
          planName: user.plan.name,
          code: 'FEATURE_NOT_IN_PLAN'
        });
      }
      
      next();
    } catch (error) {
      console.error('Error verificando característica del plan:', error);
      res.status(500).json({ 
        message: 'Error al verificar característica del plan',
        error: error.message 
      });
    }
  };
};
