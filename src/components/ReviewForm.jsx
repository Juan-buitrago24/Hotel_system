import { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import StarRating from './StarRating';
import Button from './Button';

const ReviewForm = ({ hotelId, roomId = null, reservationId = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    pros: [''],
    cons: ['']
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }

    if (formData.comment.trim().length < 10) {
      setError('El comentario debe tener al menos 10 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const reviewData = {
      hotel: hotelId,
      room: roomId,
      reservation: reservationId,
      rating: formData.rating,
      comment: formData.comment.trim(),
      pros: formData.pros.filter(p => p.trim() !== ''),
      cons: formData.cons.filter(c => c.trim() !== '')
    };

    try {
      await onSubmit(reviewData);
    } catch (err) {
      setError(err.message || 'Error al enviar la reseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = (type) => {
    setFormData({
      ...formData,
      [type]: [...formData[type], '']
    });
  };

  const removeItem = (type, index) => {
    setFormData({
      ...formData,
      [type]: formData[type].filter((_, i) => i !== index)
    });
  };

  const updateItem = (type, index, value) => {
    const newItems = [...formData[type]];
    newItems[index] = value;
    setFormData({
      ...formData,
      [type]: newItems
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Deja tu reseña</h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación *
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={(rating) => setFormData({ ...formData, rating })}
            size="xl"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tu experiencia *
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            placeholder="Cuéntanos sobre tu experiencia..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="5"
            required
            minLength={10}
            maxLength={1000}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.comment.length}/1000 caracteres
          </p>
        </div>

        {/* Pros */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Aspectos positivos (opcional)
            </label>
            <button
              type="button"
              onClick={() => addItem('pros')}
              className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
          <div className="space-y-2">
            {formData.pros.map((pro, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={pro}
                  onChange={(e) => updateItem('pros', index, e.target.value)}
                  placeholder="Ej: Personal amable"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {formData.pros.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem('pros', index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cons */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Aspectos a mejorar (opcional)
            </label>
            <button
              type="button"
              onClick={() => addItem('cons')}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>
          <div className="space-y-2">
            {formData.cons.map((con, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={con}
                  onChange={(e) => updateItem('cons', index, e.target.value)}
                  placeholder="Ej: WiFi lento"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                {formData.cons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem('cons', index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Enviando...' : 'Publicar reseña'}
          </Button>
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              className="flex-1"
            >
              Cancelar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
