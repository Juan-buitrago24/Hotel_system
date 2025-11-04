import User from '../models/User.model.js';

/**
 * Middleware para filtrar datos por hotel
 * Automáticamente restringe las consultas al hotel del usuario
 * Excepto para super_admin que puede ver todos los hoteles
 */
export const filterByHotel = async (req, res, next) => {
  try {
    // Obtener el usuario con su hotel
    const user = await User.findById(req.user.id).populate('hotel');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si es admin_global, no aplicar filtro de hotel
    if (user.role === 'admin_global') {
      req.hotelFilter = {}; // Sin filtro, puede ver todos
      req.isAdminGlobal = true;
    } else if (user.role === 'cliente') {
      // Clientes no tienen acceso a estos endpoints
      req.hotelFilter = { _id: null }; // No verán nada
      req.isCliente = true;
    } else {
      // Para hotel_admin y empleado, verificar que tengan hotel asignado
      if (!user.hotel) {
        return res.status(403).json({ 
          message: 'Usuario sin hotel asignado. Contacta al administrador.' 
        });
      }

      // Aplicar filtro de hotel
      req.hotelFilter = { hotel: user.hotel._id };
      req.currentHotel = user.hotel;
      req.isAdminGlobal = false;
    }

    req.userRole = user.role;
    next();
  } catch (error) {
    console.error('Error en filterByHotel:', error);
    res.status(500).json({ message: 'Error al verificar permisos de hotel' });
  }
};

/**
 * Middleware para asignar hotel automáticamente a nuevos documentos
 * Se usa en POST/CREATE endpoints
 */
export const assignHotel = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('hotel');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Si es admin_global y no especifica hotel, error
    if (user.role === 'admin_global' && !req.body.hotel) {
      return res.status(400).json({ 
        message: 'Admin global debe especificar el hotel' 
      });
    }

    // Clientes no pueden crear estos recursos
    if (user.role === 'cliente') {
      return res.status(403).json({
        message: 'Los clientes no tienen permiso para crear este recurso'
      });
    }

    // Para otros roles, asignar su hotel automáticamente
    if (user.role !== 'admin_global') {
      if (!user.hotel) {
        return res.status(403).json({ 
          message: 'Usuario sin hotel asignado' 
        });
      }
      req.body.hotel = user.hotel._id;
    }

    req.currentHotel = user.hotel;
    next();
  } catch (error) {
    console.error('Error en assignHotel:', error);
    res.status(500).json({ message: 'Error al asignar hotel' });
  }
};

/**
 * Middleware solo para admin_global
 */
export const requireAdminGlobal = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user || user.role !== 'admin_global') {
      return res.status(403).json({ 
        message: 'Acceso denegado. Solo administradores globales.' 
      });
    }

    next();
  } catch (error) {
    console.error('Error en requireAdminGlobal:', error);
    res.status(500).json({ message: 'Error al verificar permisos' });
  }
};
