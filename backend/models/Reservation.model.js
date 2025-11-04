import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'El hotel es requerido'],
    index: true
  },
  guestName: {
    type: String,
    required: [true, 'El nombre del huésped es requerido'],
    trim: true
  },
  guestEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  guestPhone: {
    type: String,
    trim: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'La habitación es requerida']
  },
  roomNumber: {
    type: String,
    required: true
  },
  checkIn: {
    type: Date,
    required: [true, 'La fecha de entrada es requerida']
  },
  checkOut: {
    type: Date,
    required: [true, 'La fecha de salida es requerida']
  },
  guests: {
    type: Number,
    required: [true, 'El número de huéspedes es requerido'],
    min: 1
  },
  status: {
    type: String,
    enum: ['pendiente', 'confirmada', 'en_curso', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Validar que checkOut sea posterior a checkIn
reservationSchema.pre('save', function(next) {
  if (this.checkOut <= this.checkIn) {
    next(new Error('La fecha de salida debe ser posterior a la fecha de entrada'));
  }
  next();
});

// Índices para búsquedas
reservationSchema.index({ checkIn: 1, checkOut: 1, status: 1 });

export default mongoose.model('Reservation', reservationSchema);
