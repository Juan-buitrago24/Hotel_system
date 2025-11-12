import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  // Información personal
  firstName: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'El apellido es requerido'],
    trim: true
  },
  documentType: {
    type: String,
    enum: ['CC', 'CE', 'Pasaporte', 'TI'],
    required: [true, 'El tipo de documento es requerido']
  },
  documentNumber: {
    type: String,
    required: [true, 'El número de documento es requerido'],
    unique: true,
    trim: true
  },
  
  // Contacto
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        // Si el email está vacío, es válido (opcional)
        if (!v) return true;
        // Si tiene contenido, debe cumplir el formato
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: 'Email inválido. Debe tener formato: ejemplo@dominio.com'
    }
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    trim: true
  },
  
  // Dirección
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    default: 'Colombia',
    trim: true
  },
  
  // Información adicional
  dateOfBirth: {
    type: Date
  },
  nationality: {
    type: String,
    default: 'Colombiana',
    trim: true
  },
  
  // Notas y preferencias
  notes: {
    type: String,
    trim: true
  },
  preferences: {
    type: String,
    trim: true
  },
  
  // VIP o cliente frecuente
  isVIP: {
    type: Boolean,
    default: false
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  },
  
  // Hotel asociado
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'El hotel es requerido']
  }
}, {
  timestamps: true
});

// Índices para búsquedas rápidas
guestSchema.index({ documentNumber: 1, hotel: 1 });
guestSchema.index({ email: 1, hotel: 1 });
guestSchema.index({ phone: 1, hotel: 1 });
guestSchema.index({ lastName: 1, firstName: 1 });

// Virtual para nombre completo
guestSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Método para obtener edad
guestSchema.methods.getAge = function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export default mongoose.model('Guest', guestSchema);
