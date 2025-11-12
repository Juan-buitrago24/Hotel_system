import { useState } from 'react';
import { ThumbsUp, MessageSquare, Calendar, CheckCircle } from 'lucide-react';
import StarRating from './StarRating';

const ReviewCard = ({ review, onHelpful, onRespond, canRespond = false }) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState('');

  const handleSubmitResponse = (e) => {
    e.preventDefault();
    if (onRespond && responseText.trim()) {
      onRespond(review._id, responseText);
      setShowResponseForm(false);
      setResponseText('');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {review.user?.name?.charAt(0) || 'U'}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{review.user?.name || 'Usuario'}</h4>
              {review.isVerified && (
                <CheckCircle className="w-4 h-4 text-green-500" title="Reserva verificada" />
              )}
            </div>
            <div className="flex items-center gap-3 mt-1">
              <StarRating rating={review.rating} readonly size="sm" />
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Helpful button */}
        <button
          onClick={() => onHelpful && onHelpful(review._id)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{review.helpful || 0}</span>
        </button>
      </div>

      {/* Comment */}
      <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

      {/* Pros & Cons */}
      {(review.pros?.length > 0 || review.cons?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {review.pros?.length > 0 && (
            <div className="bg-green-50 p-3 rounded-lg">
              <h5 className="font-semibold text-green-800 mb-2">👍 Pros</h5>
              <ul className="space-y-1">
                {review.pros.map((pro, idx) => (
                  <li key={idx} className="text-sm text-green-700">• {pro}</li>
                ))}
              </ul>
            </div>
          )}
          
          {review.cons?.length > 0 && (
            <div className="bg-red-50 p-3 rounded-lg">
              <h5 className="font-semibold text-red-800 mb-2">👎 Contras</h5>
              <ul className="space-y-1">
                {review.cons.map((con, idx) => (
                  <li key={idx} className="text-sm text-red-700">• {con}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Response from hotel */}
      {review.response?.text && (
        <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-start gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900">
                Respuesta del hotel
              </p>
              <p className="text-sm text-blue-700 mt-1">{review.response.text}</p>
              <p className="text-xs text-blue-600 mt-2">
                {formatDate(review.response.respondedAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Response form */}
      {canRespond && !review.response?.text && (
        <div className="mt-4">
          {!showResponseForm ? (
            <button
              onClick={() => setShowResponseForm(true)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Responder a esta reseña
            </button>
          ) : (
            <form onSubmit={handleSubmitResponse} className="space-y-2">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows="3"
                required
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Enviar respuesta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowResponseForm(false);
                    setResponseText('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Room info if available */}
      {review.room && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Habitación: <span className="font-medium">{review.room.type} #{review.room.number}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
