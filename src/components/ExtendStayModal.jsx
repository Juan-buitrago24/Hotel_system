import { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign } from 'lucide-react';
import Button from './Button';
import { reservationsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function ExtendStayModal({ isOpen, onClose, reservation, onSave }) {
  const toast = useToast();
  const [extensionType, setExtensionType] = useState('days'); // 'days' or 'hours'
  const [newCheckOutDate, setNewCheckOutDate] = useState('');
  const [lateCheckoutHours, setLateCheckoutHours] = useState(4); // 4, 8, 12 hours
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);

  useEffect(() => {
    if (reservation && isOpen) {
      // Set initial date to current checkout + 1 day
      const currentCheckout = new Date(reservation.checkOut);
      currentCheckout.setDate(currentCheckout.getDate() + 1);
      setNewCheckOutDate(currentCheckout.toISOString().split('T')[0]);
      setExtensionType('days');
      setLateCheckoutHours(4);
      setAdditionalNotes('');
      setAvailable(null);
    }
  }, [reservation, isOpen]);

  if (!isOpen || !reservation) return null;

  if (!reservation.room) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <p className="text-red-600 font-medium mb-4">Error: No se pudo cargar la información de la habitación</p>
            <Button onClick={onClose} className="bg-gray-500">Cerrar</Button>
          </div>
        </div>
      </div>
    );
  }

  const currentCheckOut = new Date(reservation.checkOut);
  const currentCheckOutStr = currentCheckOut.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get minimum new checkout date (current checkout + 1 day)
  const getMinDate = () => {
    const minDate = new Date(reservation.checkOut);
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split('T')[0];
  };

  // Calculate extension details
  const calculateExtension = () => {
    if (extensionType === 'hours') {
      const hourlyRate = (reservation.room?.price || 0) / 24;
      const cost = hourlyRate * lateCheckoutHours;
      return {
        type: 'hours',
        hours: lateCheckoutHours,
        cost: Math.round(cost),
        description: `Late checkout de ${lateCheckoutHours} horas`
      };
    } else {
      // Days extension
      if (!newCheckOutDate) return null;
      
      const newCheckout = new Date(newCheckOutDate);
      const nights = Math.ceil((newCheckout - currentCheckOut) / (1000 * 60 * 60 * 24));
      
      if (nights <= 0) return null;
      
      const nightlyRate = reservation.room?.price || 0;
      const cost = Math.round(nightlyRate * nights);
      
      return {
        type: 'days',
        nights,
        cost,
        description: `${nights} noche${nights !== 1 ? 's' : ''} adicional${nights !== 1 ? 'es' : ''}`
      };
    }
  };

  const extension = calculateExtension();

  const handleCheckAvailability = async () => {
    if (!newCheckOutDate) return;
    
    setChecking(true);
    setAvailable(null);
    
    try {
      const response = await reservationsAPI.checkExtensionAvailability(
        reservation._id,
        newCheckOutDate
      );
      
      setAvailable(response.data.available);
      
      if (!response.data.available) {
        toast.error('La habitación no está disponible para esas fechas');
      }
    } catch (error) {
      console.error('Error checking availability:', error);
      toast.error('Error al verificar disponibilidad');
      setAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  const handleSave = () => {
    if (!extension) return;

    const data = {
      reservationId: reservation._id,
      extensionType,
      newCheckOutDate: extensionType === 'days' ? newCheckOutDate : null,
      lateCheckoutHours: extensionType === 'hours' ? lateCheckoutHours : null,
      additionalCost: extension.cost,
      notes: additionalNotes,
      description: extension.description
    };

    onSave(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Extender Estadía</h2>
            <p className="text-purple-100 text-sm mt-1">
              {reservation.guestName} - Habitación {reservation.room?.number || reservation.roomNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Current Reservation Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Check-in</p>
                <p className="font-medium dark:text-white">
                  {new Date(reservation.checkIn).toLocaleDateString('es-ES')}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Check-out Actual</p>
                <p className="font-medium text-blue-600 dark:text-blue-400">{currentCheckOutStr}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Precio Actual</p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  ${(reservation.totalPrice || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Extension Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Tipo de Extensión
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExtensionType('days')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  extensionType === 'days'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:bg-gray-700'
                }`}
              >
                <Calendar className={`w-6 h-6 mx-auto mb-2 ${
                  extensionType === 'days' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                }`} />
                <p className={`font-medium ${
                  extensionType === 'days' ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Días Adicionales
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Extender noches completas
                </p>
              </button>

              <button
                onClick={() => setExtensionType('hours')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  extensionType === 'hours'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-400'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 dark:bg-gray-700'
                }`}
              >
                <Clock className={`w-6 h-6 mx-auto mb-2 ${
                  extensionType === 'hours' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                }`} />
                <p className={`font-medium ${
                  extensionType === 'hours' ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  Late Checkout
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Salida tardía por horas
                </p>
              </button>
            </div>
          </div>

          {/* Days Extension Option */}
          {extensionType === 'days' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nueva Fecha de Salida *
              </label>
              <input
                type="date"
                value={newCheckOutDate}
                onChange={(e) => {
                  setNewCheckOutDate(e.target.value);
                  setAvailable(null); // Reset availability check
                }}
                min={getMinDate()}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Mínimo: {new Date(getMinDate()).toLocaleDateString('es-ES')}
              </p>
            </div>
          )}

          {/* Hours Extension Option */}
          {extensionType === 'hours' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Horas Adicionales
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[4, 8, 12].map(hours => (
                  <button
                    key={hours}
                    onClick={() => setLateCheckoutHours(hours)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      lateCheckoutHours === hours
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <Clock className={`w-5 h-5 mx-auto mb-1 ${
                      lateCheckoutHours === hours ? 'text-purple-600' : 'text-gray-400'
                    }`} />
                    <p className="font-bold text-lg">{hours}h</p>
                    <p className="text-xs">
                      Hasta {(() => {
                        const checkoutTime = new Date(reservation.checkOut);
                        checkoutTime.setHours(12 + hours); // Assuming normal checkout is 12:00
                        return checkoutTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                      })()}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Availability Check */}
          {extensionType === 'days' && newCheckOutDate && (
            <div>
              <Button
                onClick={handleCheckAvailability}
                variant="secondary"
                className="w-full"
                disabled={checking}
              >
                {checking ? 'Verificando...' : '🔍 Verificar Disponibilidad'}
              </Button>

              {available !== null && (
                <div className={`mt-3 p-3 rounded-lg ${
                  available ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`text-sm font-medium ${
                    available ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {available 
                      ? '✓ La habitación está disponible para las fechas seleccionadas'
                      : '✗ La habitación no está disponible. Intenta con otras fechas.'
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Cost Summary */}
          {extension && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-gray-900 dark:text-white">Resumen de Extensión</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tipo de extensión:</span>
                  <span className="font-medium dark:text-white">{extension.description}</span>
                </div>
                
                {extensionType === 'days' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Precio por noche:</span>
                      <span className="font-medium dark:text-white">${(reservation.room?.price || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Noches adicionales:</span>
                      <span className="font-medium dark:text-white">{extension.nights}</span>
                    </div>
                  </>
                )}

                {extensionType === 'hours' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tarifa por hora:</span>
                    <span className="font-medium dark:text-white">${Math.round((reservation.room?.price || 0) / 24).toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t dark:border-gray-600 pt-2 flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Costo adicional:</span>
                  <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    ${extension.cost.toLocaleString()}
                  </span>
                </div>

                <div className="border-t dark:border-gray-600 pt-2 flex justify-between">
                  <span className="font-medium dark:text-white">Nuevo Total:</span>
                  <span className="font-bold text-xl text-green-600 dark:text-green-400">
                    ${((reservation.totalPrice || 0) + extension.cost).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notas Adicionales (Opcional)
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows="3"
              placeholder="Ej: Solicitud del huésped por reunión de trabajo..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex-1"
            disabled={!extension || (extensionType === 'days' && available !== true)}
          >
            Confirmar Extensión
          </Button>
        </div>
      </div>
    </div>
  );
}
