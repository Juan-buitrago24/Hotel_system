import Guest from '../models/Guest.model.js';
import Reservation from '../models/Reservation.model.js';

// Obtener todos los huéspedes del hotel
export const getGuests = async (req, res) => {
  try {
    const filter = req.user.role === 'admin_global' ? {} : { hotel: req.user.hotel };
    const guests = await Guest.find(filter)
      .populate('hotel', 'name')
      .sort({ lastName: 1, firstName: 1 });
    res.json(guests);
  } catch (error) {
    console.error('Error obteniendo huéspedes:', error);
    res.status(500).json({ message: 'Error al obtener los huéspedes' });
  }
};

// Obtener un huésped por ID
export const getGuest = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id).populate('hotel', 'name');
    
    if (!guest) {
      return res.status(404).json({ message: 'Huésped no encontrado' });
    }
    
    // Verificar que el huésped pertenezca al hotel del usuario
    if (req.user.role !== 'admin_global' && guest.hotel._id.toString() !== req.user.hotel.toString()) {
      return res.status(403).json({ message: 'No tienes acceso a este huésped' });
    }
    
    res.json(guest);
  } catch (error) {
    console.error('Error obteniendo huésped:', error);
    res.status(500).json({ message: 'Error al obtener el huésped' });
  }
};

// Crear nuevo huésped
export const createGuest = async (req, res) => {
  try {
    const { firstName, lastName, documentType, documentNumber, email, phone, ...otherData } = req.body;
    
    // Validar campos requeridos
    if (!firstName || !lastName || !documentType || !documentNumber || !phone) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }
    
    // Verificar si ya existe un huésped con ese documento en este hotel
    const existingGuest = await Guest.findOne({ 
      documentNumber,
      hotel: req.user.hotel 
    });
    
    if (existingGuest) {
      return res.status(400).json({ message: 'Ya existe un huésped con ese número de documento en este hotel' });
    }
    
    // Crear el huésped asignando el hotel del usuario
    const guestData = {
      firstName,
      lastName,
      documentType,
      documentNumber,
      email,
      phone,
      ...otherData,
      hotel: req.user.hotel
    };
    
    const guest = await Guest.create(guestData);
    
    res.status(201).json(guest);
  } catch (error) {
    console.error('Error creando huésped:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El número de documento ya está registrado' });
    }
    res.status(500).json({ message: 'Error al crear el huésped' });
  }
};

// Actualizar huésped
export const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    
    if (!guest) {
      return res.status(404).json({ message: 'Huésped no encontrado' });
    }
    
    // Verificar permisos
    if (req.user.role !== 'admin_global' && guest.hotel.toString() !== req.user.hotel.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para editar este huésped' });
    }
    
    // Actualizar campos
    Object.keys(req.body).forEach(key => {
      if (key !== 'hotel') { // No permitir cambiar el hotel
        guest[key] = req.body[key];
      }
    });
    
    await guest.save();
    
    const updatedGuest = await Guest.findById(guest._id).populate('hotel', 'name');
    res.json(updatedGuest);
  } catch (error) {
    console.error('Error actualizando huésped:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El número de documento ya está registrado' });
    }
    res.status(500).json({ message: 'Error al actualizar el huésped' });
  }
};

// Eliminar huésped
export const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    
    if (!guest) {
      return res.status(404).json({ message: 'Huésped no encontrado' });
    }
    
    // Verificar permisos
    if (req.user.role !== 'admin_global' && guest.hotel.toString() !== req.user.hotel.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este huésped' });
    }
    
    // Verificar si tiene reservas activas
    const activeReservations = await Reservation.countDocuments({
      guest: guest._id,
      status: { $in: ['confirmada', 'en_curso'] }
    });
    
    if (activeReservations > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar el huésped porque tiene reservas activas' 
      });
    }
    
    await Guest.findByIdAndDelete(req.params.id);
    res.json({ message: 'Huésped eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando huésped:', error);
    res.status(500).json({ message: 'Error al eliminar el huésped' });
  }
};

// Obtener historial de reservas del huésped
export const getGuestHistory = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id);
    
    if (!guest) {
      return res.status(404).json({ message: 'Huésped no encontrado' });
    }
    
    // Verificar permisos
    if (req.user.role !== 'admin_global' && guest.hotel.toString() !== req.user.hotel.toString()) {
      return res.status(403).json({ message: 'No tienes acceso a este huésped' });
    }
    
    const reservations = await Reservation.find({ guest: guest._id })
      .populate('room', 'number type')
      .sort({ checkIn: -1 });
    
    res.json(reservations);
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    res.status(500).json({ message: 'Error al obtener el historial' });
  }
};

// Buscar huésped por documento
export const searchGuestByDocument = async (req, res) => {
  try {
    const { documentNumber } = req.params;
    
    const guest = await Guest.findOne({ 
      documentNumber,
      hotel: req.user.hotel 
    }).populate('hotel', 'name');
    
    if (!guest) {
      return res.status(404).json({ message: 'Huésped no encontrado' });
    }
    
    res.json(guest);
  } catch (error) {
    console.error('Error buscando huésped:', error);
    res.status(500).json({ message: 'Error al buscar el huésped' });
  }
};
