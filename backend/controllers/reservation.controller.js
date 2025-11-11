import { validationResult } from 'express-validator';
import Reservation from '../models/Reservation.model.js';
import Room from '../models/Room.model.js';

export const getReservations = async (req, res) => {
  try {
    const { status, checkIn, checkOut } = req.query;
    
    // Aplicar filtro de hotel
    const filter = { ...req.hotelFilter };

    if (status) filter.status = status;
    if (checkIn) filter.checkIn = { $gte: new Date(checkIn) };
    if (checkOut) filter.checkOut = { $lte: new Date(checkOut) };

    const reservations = await Reservation.find(filter)
      .populate('room')
      .populate('guest', 'firstName lastName documentNumber isVIP')
      .populate('createdBy', 'name username')
      .sort({ checkIn: -1 });

    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las reservas' });
  }
};

export const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('room')
      .populate('guest', 'firstName lastName documentNumber email phone isVIP')
      .populate('createdBy', 'name username');

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la reserva' });
  }
};

export const createReservation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { room, checkIn, checkOut, guests } = req.body;

    // Verificar que la habitación existe
    const roomDoc = await Room.findById(room);
    if (!roomDoc) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    // Verificar capacidad
    if (guests > roomDoc.capacity) {
      return res.status(400).json({ 
        message: `La habitación solo tiene capacidad para ${roomDoc.capacity} huéspedes` 
      });
    }

    // Verificar disponibilidad
    const conflictingReservation = await Reservation.findOne({
      room: room,
      status: { $in: ['pendiente', 'confirmada', 'en_curso'] },
      $or: [
        { checkIn: { $lte: new Date(checkOut) }, checkOut: { $gte: new Date(checkIn) } }
      ]
    });

    if (conflictingReservation) {
      return res.status(400).json({ 
        message: 'La habitación no está disponible en las fechas seleccionadas' 
      });
    }

    // Calcular precio total
    const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = days * roomDoc.price;

    const reservation = await Reservation.create({
      ...req.body,
      roomNumber: roomDoc.number,
      totalPrice,
      createdBy: req.user._id
    });

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('room', 'number type')
      .populate('guest', 'firstName lastName documentNumber isVIP')
      .populate('createdBy', 'name username');

    res.status(201).json(populatedReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la reserva' });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Si se cambian las fechas, verificar disponibilidad
    if (req.body.checkIn || req.body.checkOut) {
      const checkIn = req.body.checkIn || reservation.checkIn;
      const checkOut = req.body.checkOut || reservation.checkOut;

      const conflictingReservation = await Reservation.findOne({
        _id: { $ne: req.params.id },
        room: reservation.room,
        status: { $in: ['pendiente', 'confirmada', 'en_curso'] },
        $or: [
          { checkIn: { $lte: new Date(checkOut) }, checkOut: { $gte: new Date(checkIn) } }
        ]
      });

      if (conflictingReservation) {
        return res.status(400).json({ 
          message: 'La habitación no está disponible en las nuevas fechas' 
        });
      }

      // Recalcular precio si cambian las fechas
      const roomDoc = await Room.findById(reservation.room);
      const days = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
      req.body.totalPrice = days * roomDoc.price;
    }

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('room', 'number type')
      .populate('createdBy', 'name username');

    res.json(updatedReservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la reserva' });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reserva eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la reserva' });
  }
};

export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'El estado es requerido' });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('room', 'number type')
      .populate('createdBy', 'name username');

    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Si la reserva se confirma o está en curso, actualizar estado de la habitación
    if (status === 'en_curso') {
      await Room.findByIdAndUpdate(reservation.room._id, { status: 'ocupada' });
    } else if (status === 'completada' || status === 'cancelada') {
      await Room.findByIdAndUpdate(reservation.room._id, { status: 'limpieza' });
    }

    res.json(reservation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el estado' });
  }
};

// Verificar disponibilidad para extensión de estadía
export const checkExtensionAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { newCheckOutDate } = req.body;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Buscar reservas que puedan solaparse con la extensión
    const conflictingReservations = await Reservation.find({
      room: reservation.room,
      _id: { $ne: id }, // Excluir la reserva actual
      status: { $in: ['pendiente', 'confirmada', 'en_curso'] },
      $or: [
        // Reservas que comienzan durante la extensión
        {
          checkIn: { 
            $gte: new Date(reservation.checkOut), 
            $lt: new Date(newCheckOutDate) 
          }
        },
        // Reservas que ya están activas en las fechas de extensión
        {
          checkIn: { $lt: new Date(reservation.checkOut) },
          checkOut: { $gt: new Date(reservation.checkOut) }
        }
      ]
    });

    const available = conflictingReservations.length === 0;

    res.json({
      available,
      conflictingReservations: available ? [] : conflictingReservations.map(r => ({
        checkIn: r.checkIn,
        checkOut: r.checkOut,
        guestName: r.guestName
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al verificar disponibilidad' });
  }
};

// Extender estadía
export const extendStay = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      extensionType, 
      newCheckOutDate, 
      lateCheckoutHours, 
      additionalCost, 
      notes,
      description 
    } = req.body;

    const reservation = await Reservation.findById(id).populate('room');
    
    if (!reservation) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Verificar que la reserva esté activa
    if (!['confirmada', 'en_curso'].includes(reservation.status)) {
      return res.status(400).json({ 
        message: 'Solo se pueden extender reservas confirmadas o en curso' 
      });
    }

    // Crear nota de extensión con timestamp
    const timestamp = new Date().toLocaleString('es-CO');
    let extensionNote = `\n[${timestamp} - Extensión de estadía]: ${description}`;
    
    if (extensionType === 'days') {
      extensionNote += ` | Nueva fecha de salida: ${new Date(newCheckOutDate).toLocaleDateString('es-ES')}`;
      
      // Verificar disponibilidad antes de extender
      const conflictingReservations = await Reservation.find({
        room: reservation.room._id,
        _id: { $ne: id },
        status: { $in: ['pendiente', 'confirmada', 'en_curso'] },
        $or: [
          {
            checkIn: { 
              $gte: new Date(reservation.checkOut), 
              $lt: new Date(newCheckOutDate) 
            }
          },
          {
            checkIn: { $lt: new Date(reservation.checkOut) },
            checkOut: { $gt: new Date(reservation.checkOut) }
          }
        ]
      });

      if (conflictingReservations.length > 0) {
        return res.status(400).json({ 
          message: 'La habitación no está disponible para las fechas seleccionadas',
          conflictingReservations
        });
      }

      // Actualizar fecha de checkout
      reservation.checkOut = new Date(newCheckOutDate);
    } else if (extensionType === 'hours') {
      extensionNote += ` | Late checkout de ${lateCheckoutHours} horas`;
      // Para late checkout, no cambiamos la fecha, solo agregamos nota
    }

    // Agregar costo adicional (redondeado)
    reservation.totalPrice = Math.round(reservation.totalPrice + additionalCost);

    // Agregar notas
    if (notes) {
      extensionNote += ` | Notas: ${notes}`;
    }
    reservation.notes = (reservation.notes || '') + extensionNote;

    // Guardar cambios
    await reservation.save();

    // Populate para respuesta
    await reservation.populate('room', 'number type price');
    await reservation.populate('guest', 'firstName lastName documentNumber');

    res.json({
      success: true,
      message: 'Estadía extendida exitosamente',
      reservation
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al extender la estadía' });
  }
};
