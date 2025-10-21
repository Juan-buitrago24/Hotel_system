import { validationResult } from 'express-validator';
import Room from '../models/Room.model.js';

export const getRooms = async (req, res) => {
  try {
    const { status, type, floor } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (floor) filter.floor = parseInt(floor);

    const rooms = await Room.find(filter).sort({ number: 1 });
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las habitaciones' });
  }
};

export const getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la habitación' });
  }
};

export const createRoom = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const roomExists = await Room.findOne({ number: req.body.number });
    if (roomExists) {
      return res.status(400).json({ message: 'Ya existe una habitación con ese número' });
    }

    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la habitación' });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    // Verificar si se intenta cambiar el número y ya existe
    if (req.body.number && req.body.number !== room.number) {
      const roomExists = await Room.findOne({ number: req.body.number });
      if (roomExists) {
        return res.status(400).json({ message: 'Ya existe una habitación con ese número' });
      }
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedRoom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la habitación' });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Habitación eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la habitación' });
  }
};

export const updateRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'El estado es requerido' });
    }

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({ message: 'Habitación no encontrada' });
    }

    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el estado' });
  }
};
