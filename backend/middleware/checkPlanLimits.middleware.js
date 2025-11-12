import User from '../models/User.model.js';
import Hotel from '../models/Hotel.model.js';
import Room from '../models/Room.model.js';

// Límites por plan actualizados según pricing
const PLAN_LIMITS = {
  free: { maxRooms: 10, maxUsers: 3 },
  basic: { maxRooms: 10, maxUsers: 5 },
  professional: { maxRooms: 100, maxUsers: 20 },
  premium: { maxRooms: 100, maxUsers: 20 }, // Alias para professional
  enterprise: { maxRooms: Infinity, maxUsers: Infinity }
};

// Middleware para verificar límites de habitaciones
export const checkRoomLimit = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Obtener el usuario con su hotel
    const user = await User.findById(userId).populate('hotel');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Si es admin global, permitir sin restricciones
    if (user.role === 'admin_global') {
      return next();
    }
    
    // Verificar que tenga hotel asignado
    if (!user.hotel) {
      return res.status(403).json({ 
        message: 'Usuario sin hotel asignado',
        code: 'NO_HOTEL_ASSIGNED'
      });
    }
    
    // Obtener el plan del hotel
    const hotel = await Hotel.findById(user.hotel._id || user.hotel);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }
    
    const planLimits = PLAN_LIMITS[hotel.plan] || PLAN_LIMITS.free;
    
    // Contar habitaciones actuales del hotel
    const roomCount = await Room.countDocuments({ 
      hotel: hotel._id
    });
    
    console.log(`🏨 Hotel: ${hotel.name}, Plan: ${hotel.plan}, Habitaciones: ${roomCount}/${planLimits.maxRooms}`);
    
    // Verificar límite del plan
    if (roomCount >= planLimits.maxRooms) {
      return res.status(403).json({ 
        message: `Has alcanzado el límite de ${planLimits.maxRooms} habitaciones del plan ${hotel.plan}.`,
        currentRooms: roomCount,
        maxRooms: planLimits.maxRooms,
        planName: hotel.plan,
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
    
    // Obtener el usuario con su hotel
    const user = await User.findById(userId).populate('hotel');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Si es admin global, permitir sin restricciones
    if (user.role === 'admin_global') {
      return next();
    }
    
    // Verificar que tenga hotel asignado
    if (!user.hotel) {
      return res.status(403).json({ 
        message: 'Usuario sin hotel asignado',
        code: 'NO_HOTEL_ASSIGNED'
      });
    }
    
    // Obtener el plan del hotel
    const hotel = await Hotel.findById(user.hotel._id || user.hotel);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }
    
    const planLimits = PLAN_LIMITS[hotel.plan] || PLAN_LIMITS.free;
    
    // Contar usuarios actuales del hotel (sin contar clientes)
    const userCount = await User.countDocuments({ 
      hotel: hotel._id,
      active: true,
      role: { $ne: 'client' } // No contar clientes, solo staff
    });
    
    console.log(`👥 Hotel: ${hotel.name}, Plan: ${hotel.plan}, Usuarios: ${userCount}/${planLimits.maxUsers}`);
    
    // Verificar límite del plan
    if (userCount >= planLimits.maxUsers) {
      return res.status(403).json({ 
        message: `Has alcanzado el límite de ${planLimits.maxUsers} usuarios del plan ${hotel.plan}.`,
        currentUsers: userCount,
        maxUsers: planLimits.maxUsers,
        planName: hotel.plan,
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

// Características disponibles por plan
export const PLAN_FEATURES = {
  free: {
    maxRooms: 10,
    maxUsers: 3,
    cloudinary: false,
    advancedCalendar: false,
    userRoles: false,
    reports: false,
    multiHotel: false,
    apiAccess: false
  },
  basic: {
    maxRooms: 10,
    maxUsers: 5,
    cloudinary: true, // ✅ Básico SÍ tiene Cloudinary
    advancedCalendar: false,
    userRoles: false,
    reports: false,
    multiHotel: false,
    apiAccess: false
  },
  professional: {
    maxRooms: 100,
    maxUsers: 20,
    cloudinary: true,
    advancedCalendar: true,
    userRoles: true,
    reports: false,
    multiHotel: false,
    apiAccess: false
  },
  premium: {
    maxRooms: 100,
    maxUsers: 20,
    cloudinary: true,
    advancedCalendar: true,
    userRoles: true,
    reports: false,
    multiHotel: false,
    apiAccess: false
  },
  enterprise: {
    maxRooms: Infinity,
    maxUsers: Infinity,
    cloudinary: true,
    advancedCalendar: true,
    userRoles: true,
    reports: true,
    multiHotel: true,
    apiAccess: true
  }
};

// Middleware para verificar características del plan
export const checkPlanFeature = (feature) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      // Obtener el usuario con su hotel
      const user = await User.findById(userId).populate('hotel');
      
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      
      // Si es admin global, permitir todo
      if (user.role === 'admin_global') {
        return next();
      }
      
      // Si no tiene hotel, denegar features premium
      if (!user.hotel) {
        return res.status(403).json({ 
          message: 'Esta característica requiere estar asociado a un hotel.',
          feature,
          code: 'NO_HOTEL_ASSOCIATED'
        });
      }

      // Obtener el hotel completo
      const hotel = await Hotel.findById(user.hotel._id || user.hotel);
      
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel no encontrado' });
      }

      // Obtener características del plan
      const planFeatures = PLAN_FEATURES[hotel.plan] || PLAN_FEATURES.free;
      
      // Verificar si el plan tiene la característica
      if (!planFeatures[feature]) {
        return res.status(403).json({ 
          message: `Esta característica no está disponible en el plan ${hotel.plan}. Actualiza tu plan para acceder.`,
          feature,
          currentPlan: hotel.plan,
          requiredFeature: feature,
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
