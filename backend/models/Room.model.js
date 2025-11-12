import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'El hotel es requerido'],
    index: true
  },
  number: {
    type: String,
    required: [true, 'El número de habitación es requerido'],
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
    url: {
      type: String,
      required: true,
      trim: true
    },
    publicId: {
      type: String,
      required: true,
      trim: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Índice compuesto: número de habitación único por hotel
roomSchema.index({ hotel: 1, number: 1 }, { unique: true });
// Índice para búsquedas rápidas
roomSchema.index({ number: 1, status: 1 });

export default mongoose.model('Room', roomSchema);
