import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  number: {
    type: String,
    required: [true, 'El número de habitación es requerido'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'El tipo de habitación es requerido'],
    enum: ['simple', 'doble', 'suite', 'familiar'],
    default: 'simple'
  },
  capacity: {
    type: Number,
    required: [true, 'La capacidad es requerida'],
    min: 1,
    max: 10
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: 0
  },
  floor: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['disponible', 'ocupada', 'mantenimiento', 'limpieza'],
    default: 'disponible'
  },
  amenities: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Índice para búsquedas rápidas
roomSchema.index({ number: 1, status: 1 });

export default mongoose.model('Room', roomSchema);
