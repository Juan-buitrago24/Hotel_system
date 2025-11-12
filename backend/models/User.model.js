import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es requerido'],
    unique: true,
    trim: true,
    minlength: 3
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: 6
  },
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: function() {
      // Hotel es requerido excepto para admin_global y cliente
      return this.role !== 'admin_global' && this.role !== 'cliente';
    }
  },
  role: {
    type: String,
    enum: ['admin_global', 'hotel_admin', 'empleado', 'cliente'],
    default: 'cliente'
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpires: {
    type: Date
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  // Campos de suscripción al plan
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    default: null
  },
  subscriptionDate: {
    type: Date,
    default: null
  },
  subscriptionStatus: {
    type: String,
    enum: ['trial', 'active', 'inactive', 'cancelled'],
    default: 'trial'
  },
  subscriptionExpiresAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// No devolver la contraseña en las consultas
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.resetPasswordToken;
  return user;
};

// Generar token de verificación
userSchema.methods.createVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 horas
  return token;
};

// Generar token de reset de contraseña
userSchema.methods.createPasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hora
  return token;
};

export default mongoose.model('User', userSchema);
