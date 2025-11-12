import Review from '../models/Review.model.js';
import Hotel from '../models/Hotel.model.js';
import Reservation from '../models/Reservation.model.js';

// Crear una nueva reseña
export const createReview = async (req, res) => {
  try {
    const { hotel, room, reservation, rating, comment, pros, cons, isPlatformReview } = req.body;
    const userId = req.user.id;

    // Verificar si ya dejó una reseña para este hotel
    const existingReview = await Review.hasUserReviewed(userId, hotel);
    if (existingReview) {
      return res.status(400).json({ 
        message: 'Ya has dejado una reseña para este hotel' 
      });
    }

    // Si es reseña de hotel (no de plataforma), verificar reserva
    let isVerified = false;
    if (!isPlatformReview && reservation) {
      const reservationDoc = await Reservation.findOne({
        _id: reservation,
        guest: userId,
        status: 'completed'
      });
      isVerified = !!reservationDoc;
    }

    const review = new Review({
      user: userId,
      hotel,
      room,
      reservation,
      rating,
      comment,
      pros,
      cons,
      isPlatformReview: isPlatformReview || false,
      isVerified,
      status: 'approved' // Por defecto aprobada, puede cambiar a 'pending' si quieres moderación
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name username')
      .populate('hotel', 'name')
      .populate('room', 'number type');

    res.status(201).json({
      message: 'Reseña creada exitosamente',
      review: populatedReview
    });

  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(400).json({ 
      message: 'Error al crear reseña',
      error: error.message 
    });
  }
};

// Obtener reseñas con filtros
export const getReviews = async (req, res) => {
  try {
    const { 
      hotel, 
      room, 
      isPlatformReview,
      rating,
      limit = 10,
      page = 1,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { status: 'approved' };
    
    if (hotel) query.hotel = hotel;
    if (room) query.room = room;
    if (isPlatformReview !== undefined) query.isPlatformReview = isPlatformReview === 'true';
    if (rating) query.rating = parseInt(rating);

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === 'desc' ? -1 : 1;

    const reviews = await Review.find(query)
      .populate('user', 'name username')
      .populate('hotel', 'name')
      .populate('room', 'number type')
      .populate('response.respondedBy', 'name')
      .sort({ [sortBy]: sortOrder })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Review.countDocuments(query);

    // Calcular estadísticas
    const stats = await Review.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: {
            $push: '$rating'
          }
        }
      },
      {
        $project: {
          averageRating: { $round: ['$averageRating', 1] },
          totalReviews: 1,
          ratingDistribution: {
            5: { $size: { $filter: { input: '$ratings', as: 'r', cond: { $eq: ['$$r', 5] } } } },
            4: { $size: { $filter: { input: '$ratings', as: 'r', cond: { $eq: ['$$r', 4] } } } },
            3: { $size: { $filter: { input: '$ratings', as: 'r', cond: { $eq: ['$$r', 3] } } } },
            2: { $size: { $filter: { input: '$ratings', as: 'r', cond: { $eq: ['$$r', 2] } } } },
            1: { $size: { $filter: { input: '$ratings', as: 'r', cond: { $eq: ['$$r', 1] } } } }
          }
        }
      }
    ]);

    res.json({
      reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalReviews: total,
        limit: parseInt(limit)
      },
      stats: stats.length > 0 ? stats[0] : null
    });

  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ 
      message: 'Error al obtener reseñas',
      error: error.message 
    });
  }
};

// Obtener una reseña específica
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name username')
      .populate('hotel', 'name')
      .populate('room', 'number type')
      .populate('response.respondedBy', 'name');

    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    res.json(review);
  } catch (error) {
    console.error('Error al obtener reseña:', error);
    res.status(500).json({ 
      message: 'Error al obtener reseña',
      error: error.message 
    });
  }
};

// Actualizar una reseña (solo el autor)
export const updateReview = async (req, res) => {
  try {
    const { rating, comment, pros, cons } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para editar esta reseña' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (pros) review.pros = pros;
    if (cons) review.cons = cons;

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name username')
      .populate('hotel', 'name')
      .populate('room', 'number type');

    res.json({
      message: 'Reseña actualizada exitosamente',
      review: updatedReview
    });

  } catch (error) {
    console.error('Error al actualizar reseña:', error);
    res.status(400).json({ 
      message: 'Error al actualizar reseña',
      error: error.message 
    });
  }
};

// Eliminar una reseña
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    // Solo el autor o admin puede eliminar
    if (review.user.toString() !== userId && userRole !== 'admin_global') {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta reseña' });
    }

    await review.deleteOne();

    res.json({ message: 'Reseña eliminada exitosamente' });

  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    res.status(500).json({ 
      message: 'Error al eliminar reseña',
      error: error.message 
    });
  }
};

// Responder a una reseña (solo hotel_admin)
export const respondToReview = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    // Verificar que el usuario es admin del hotel de la reseña
    const hotel = await Hotel.findById(review.hotel);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }

    // TODO: Verificar que el usuario pertenece al hotel
    // Por ahora, permitimos a cualquier hotel_admin

    review.response = {
      text,
      respondedBy: userId,
      respondedAt: new Date()
    };

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'name username')
      .populate('hotel', 'name')
      .populate('response.respondedBy', 'name');

    res.json({
      message: 'Respuesta agregada exitosamente',
      review: updatedReview
    });

  } catch (error) {
    console.error('Error al responder reseña:', error);
    res.status(400).json({ 
      message: 'Error al responder reseña',
      error: error.message 
    });
  }
};

// Marcar reseña como útil
export const markAsHelpful = async (req, res) => {
  try {
    const userId = req.user.id;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' });
    }

    // Verificar si ya marcó como útil
    const alreadyHelpful = review.helpfulBy.includes(userId);

    if (alreadyHelpful) {
      // Quitar marca
      review.helpfulBy = review.helpfulBy.filter(id => id.toString() !== userId);
      review.helpful -= 1;
    } else {
      // Agregar marca
      review.helpfulBy.push(userId);
      review.helpful += 1;
    }

    await review.save();

    res.json({
      message: alreadyHelpful ? 'Marca de útil eliminada' : 'Marcada como útil',
      helpful: review.helpful,
      isHelpful: !alreadyHelpful
    });

  } catch (error) {
    console.error('Error al marcar reseña:', error);
    res.status(500).json({ 
      message: 'Error al marcar reseña',
      error: error.message 
    });
  }
};
