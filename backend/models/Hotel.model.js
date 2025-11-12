import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del hotel es requerido'],
    trim: true,
    maxlength: 100
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  domain: {
    type: String,
    trim: true,
    lowercase: true
  },
  settings: {
    currency: {
      type: String,
      default: 'COP',
      enum: ['COP', 'USD', 'EUR', 'MXN']
    },
    timezone: {
      type: String,
      default: 'America/Bogota'
    },
    language: {
      type: String,
      default: 'es',
      enum: ['es', 'en', 'pt']
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  plan: {
    type: String,
    enum: ['free', 'basic', 'professional', 'premium', 'enterprise'],
    default: 'free'
  },
  contact: {
    email: String,
    phone: String,
    address: String,
    city: String,
    country: String
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para búsquedas rápidas
hotelSchema.index({ slug: 1 });
hotelSchema.index({ active: 1 });

// Método para generar slug automáticamente
hotelSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Método para obtener estadísticas del hotel
hotelSchema.methods.getStats = async function() {
  const Room = mongoose.model('Room');
  const Reservation = mongoose.model('Reservation');
  const User = mongoose.model('User');

  const [roomCount, reservationCount, employeeCount] = await Promise.all([
    Room.countDocuments({ hotel: this._id }),
    Reservation.countDocuments({ hotel: this._id }),
    User.countDocuments({ hotel: this._id, role: { $ne: 'super_admin' } })
  ]);

  return {
    rooms: roomCount,
    reservations: reservationCount,
    employees: employeeCount
  };
};

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;
