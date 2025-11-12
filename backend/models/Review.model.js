import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es requerido']
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'El hotel es requerido']
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: null
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    default: null
  },
  rating: {
    type: Number,
    required: [true, 'La calificación es requerida'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'El comentario es requerido'],
    trim: true,
    minlength: [10, 'El comentario debe tener al menos 10 caracteres'],
    maxlength: [1000, 'El comentario no puede exceder 1000 caracteres']
  },
  pros: [{ 
    type: String,
    trim: true
  }],
  cons: [{
    type: String,
    trim: true
  }],
  isVerified: {
    type: Boolean,
    default: false,
    comment: 'Verifica si la reseña es de un cliente que realmente se hospedó'
  },
  isPlatformReview: {
    type: Boolean,
    default: false,
    comment: 'True si es reseña de la plataforma Hotel Manager, false si es del hotel'
  },
  response: {
    text: {
      type: String,
      trim: true
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: {
      type: Date
    }
  },
  helpful: {
    type: Number,
    default: 0,
    comment: 'Contador de usuarios que marcaron la reseña como útil'
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'hidden'],
    default: 'approved'
  }
}, {
  timestamps: true
});

// Índices para búsquedas eficientes
reviewSchema.index({ hotel: 1, createdAt: -1 });
reviewSchema.index({ room: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isPlatformReview: 1, status: 1 });

// Virtual para calcular si es una reseña reciente
reviewSchema.virtual('isRecent').get(function() {
  const daysSinceCreation = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);
  return daysSinceCreation <= 30;
});

// Método para verificar si un usuario ya dejó reseña para un hotel
reviewSchema.statics.hasUserReviewed = async function(userId, hotelId) {
  const review = await this.findOne({ user: userId, hotel: hotelId });
  return !!review;
};

// Middleware para calcular rating promedio del hotel
reviewSchema.post('save', async function() {
  const Hotel = mongoose.model('Hotel');
  const stats = await this.constructor.aggregate([
    {
      $match: { 
        hotel: this.hotel,
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$hotel',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Hotel.findByIdAndUpdate(this.hotel, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews
    });
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
