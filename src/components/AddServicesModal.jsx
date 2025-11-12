import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import Button from './Button';
import { EXTRA_SERVICES } from '../constants/amenities';

export default function AddServicesModal({ isOpen, onClose, reservation, onSave }) {
  const [selectedServices, setSelectedServices] = useState([]);
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    if (reservation && isOpen) {
      // Cargar servicios existentes si los hay
      setSelectedServices(reservation.extraServices || []);
      setAdditionalNotes('');
    }
  }, [reservation, isOpen]);

  if (!isOpen || !reservation) return null;

  const toggleService = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(s => s !== serviceId)
        : [...prev, serviceId]
    );
  };

  const calculateServicesTotal = () => {
    return selectedServices.reduce((sum, serviceId) => {
      const service = EXTRA_SERVICES.find(s => s.id === serviceId);
      return sum + (service?.price || 0);
    }, 0);
  };

  const handleSave = () => {
    const servicesTotal = calculateServicesTotal();
    const newTotal = (reservation.totalPrice || 0) + servicesTotal;
    
    onSave({
      reservationId: reservation._id,
      extraServices: selectedServices,
      additionalNotes,
      servicesTotal,
      newTotal
    });
  };

  const servicesTotal = calculateServicesTotal();
  const originalServices = reservation.extraServices || [];
  const addedServices = selectedServices.filter(s => !originalServices.includes(s));
  const removedServices = originalServices.filter(s => !selectedServices.includes(s));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Agregar Servicios Extras</h2>
            <p className="text-blue-100 text-sm mt-1">
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
          {/* Info de la reserva */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Check-in</p>
                <p className="font-medium dark:text-white">
                  {new Date(reservation.checkIn).toLocaleDateString('es-ES')}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Check-out</p>
                <p className="font-medium dark:text-white">
                  {new Date(reservation.checkOut).toLocaleDateString('es-ES')}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Original</p>
                <p className="font-medium text-green-600 dark:text-green-400">
                  ${(reservation.totalPrice || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Estado</p>
                <p className="font-medium capitalize dark:text-white">{reservation.status}</p>
              </div>
            </div>
          </div>

          {/* Servicios existentes */}
          {originalServices.length > 0 && (
            <div className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/30 p-4">
              <p className="font-medium text-blue-900 dark:text-blue-300 mb-2">Servicios actuales:</p>
              <div className="flex flex-wrap gap-2">
                {originalServices.map(serviceId => {
                  const service = EXTRA_SERVICES.find(s => s.id === serviceId);
                  return service ? (
                    <span key={serviceId} className="px-3 py-1 bg-blue-200 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                      {service.icon} {service.label} (${service.price.toLocaleString()})
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {/* Selector de servicios */}
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-3">Servicios Adicionales Disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {EXTRA_SERVICES.map(service => {
                const isSelected = selectedServices.includes(service.id);
                const wasOriginal = originalServices.includes(service.id);
                
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{service.icon}</span>
                      <div>
                        <p className={`font-medium ${
                          isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {service.label}
                        </p>
                        {service.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">{service.description}</p>
                        )}
                        {wasOriginal && (
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">✓ Ya contratado</span>
                        )}
                      </div>
                    </div>
                    <span className={`font-bold ${
                      isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      ${service.price.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cambios realizados */}
          {(addedServices.length > 0 || removedServices.length > 0) && (
            <div className="border-t dark:border-gray-600 pt-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Resumen de Cambios</h3>
              
              {addedServices.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-2">✓ Servicios agregados:</p>
                  <div className="flex flex-wrap gap-2">
                    {addedServices.map(serviceId => {
                      const service = EXTRA_SERVICES.find(s => s.id === serviceId);
                      return service ? (
                        <span key={serviceId} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                          {service.icon} {service.label} (+${service.price.toLocaleString()})
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {removedServices.length > 0 && (
                <div>
                  <p className="text-sm text-red-700 dark:text-red-400 font-medium mb-2">✗ Servicios removidos:</p>
                  <div className="flex flex-wrap gap-2">
                    {removedServices.map(serviceId => {
                      const service = EXTRA_SERVICES.find(s => s.id === serviceId);
                      return service ? (
                        <span key={serviceId} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm">
                          {service.icon} {service.label} (-${service.price.toLocaleString()})
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notas adicionales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notas Adicionales (opcional)
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows="3"
              placeholder="Ej: Cliente solicitó cama extra al hacer check-in..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Totales */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Total de la habitación:</span>
              <span className="font-medium dark:text-white">${(reservation.totalPrice || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Servicios extras seleccionados:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">${servicesTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t dark:border-gray-600">
              <span className="font-bold text-lg dark:text-white">Nuevo Total:</span>
              <span className="font-bold text-2xl text-green-600 dark:text-green-400">
                ${((reservation.totalPrice || 0) + servicesTotal).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex-1"
            disabled={selectedServices.length === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            Actualizar Servicios
          </Button>
        </div>
      </div>
    </div>
  );
}
