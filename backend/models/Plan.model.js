import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del plan es requerido'],
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio del plan es requerido'],
    min: 0
  },
  description: {
    type: String,
    required: [true, 'La descripción del plan es requerida'],
    trim: true
  },
  features: [{
    type: String,
    required: true
  }],
  maxRooms: {
    type: Number,
    required: [true, 'El límite de habitaciones es requerido'],
    default: 20
  },
  maxUsers: {
    type: Number,
    required: [true, 'El límite de usuarios es requerido'],
    default: 1
  },
  hasAnalytics: {
    type: Boolean,
    default: false
  },
  hasAPI: {
    type: Boolean,
    default: false
  },
  hasImageGallery: {
    type: Boolean,
    default: false
  },
  supportType: {
    type: String,
    enum: ['email', 'priority', 'dedicated'],
    default: 'email'
  },
  popular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    default: 'from-blue-500 to-blue-600'
  }
}, {
  timestamps: true
});

const Plan = mongoose.model('Plan', planSchema);

export default Plan;
