import { useState, useEffect } from 'react';
import { reservationsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import { EXTRA_SERVICES } from '../constants/amenities';

export default function ClientReservationForm({ 
  hotel, 
  room, 
  currentUser,
  onBack, 
  onSuccess 
}) {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
    extraServices: []
  });
  const [loading, setLoading] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const toast = useToast(); // No desestructurar, usar directamente

  // Load occupied dates for this room
  useEffect(() => {
    loadOccupiedDates();
  }, [room._id]);

  const loadOccupiedDates = async () => {
    try {
      const response = await reservationsAPI.getAll();
      const reservationsData = Array.isArray(response) 
        ? response 
        : (response.reservations || response.data || []);
      
      // Filter reservations for this room that are confirmed or pending
      const roomReservations = reservationsData.filter(res => 
        (res.room === room._id || res.room?._id === room._id) &&
        (res.status === 'confirmada' || res.status === 'pendiente' || res.status === 'en_curso')
      );
      
      // Extract occupied date ranges
      const dates = roomReservations.map(res => ({
        checkIn: new Date(res.checkIn),
        checkOut: new Date(res.checkOut)
      }));
      
      setOccupiedDates(dates);
    } catch (error) {
      console.error('Error loading occupied dates:', error);
    }
  };

  // Calculate number of nights and total price
  const calculateStay = () => {
    if (!formData.checkIn || !formData.checkOut) {
      return { nights: 0, roomTotal: 0, servicesTotal: 0, total: 0 };
    }
    
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const diffTime = checkOutDate - checkInDate;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return { nights: 0, roomTotal: 0, servicesTotal: 0, total: 0 };
    
    const roomTotal = nights * (room.price || room.pricePerNight || 0);
    
    // Calculate extra services total
    const servicesTotal = formData.extraServices.reduce((sum, serviceId) => {
      const service = EXTRA_SERVICES.find(s => s.id === serviceId);
      return sum + (service?.price || 0);
    }, 0);
    
    const total = roomTotal + servicesTotal;
    return { nights, roomTotal, servicesTotal, total };
  };

  const { nights, roomTotal, servicesTotal, total } = calculateStay();

  const toggleExtraService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      extraServices: prev.extraServices.includes(serviceId)
        ? prev.extraServices.filter(s => s !== serviceId)
        : [...prev.extraServices, serviceId]
    }));
  };

  // Get today's date in YYYY-MM-DD format for min date
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get minimum checkout date (day after check-in)
  const getMinCheckOutDate = () => {
    if (!formData.checkIn) return getTodayDate();
    const checkIn = new Date(formData.checkIn);
    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString().split('T')[0];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if dates overlap with existing reservations
  const checkDateAvailability = (checkIn, checkOut) => {
    const newCheckIn = new Date(checkIn);
    const newCheckOut = new Date(checkOut);
    
    for (const occupied of occupiedDates) {
      // Check if dates overlap
      if (newCheckIn < occupied.checkOut && newCheckOut > occupied.checkIn) {
        return false; // Dates overlap
      }
    }
    return true; // Dates are available
  };

  // Disable occupied dates in date inputs
  const getDisabledDates = () => {
    const disabled = [];
    occupiedDates.forEach(({ checkIn, checkOut }) => {
      let current = new Date(checkIn);
      const end = new Date(checkOut);
      
      while (current < end) {
        disabled.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }
    });
    return disabled;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.checkIn) {
      errors.checkIn = 'Selecciona la fecha de entrada';
    }

    if (!formData.checkOut) {
      errors.checkOut = 'Selecciona la fecha de salida';
    }

    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      
      if (checkOut <= checkIn) {
        errors.checkOut = 'La fecha de salida debe ser posterior a la entrada';
      }

      // Check if dates are available
      if (!checkDateAvailability(formData.checkIn, formData.checkOut)) {
        errors.checkOut = 'Las fechas seleccionadas no están disponibles. Esta habitación ya está reservada en ese período.';
      }
    }

    if (formData.guests < 1) {
      errors.guests = 'Debe haber al menos 1 huésped';
    }

    if (formData.guests > room.capacity) {
      errors.guests = `Esta habitación tiene capacidad máxima de ${room.capacity} personas`;
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      toast.warning(firstError);
      return;
    }

    try {
      setLoading(true);

      const reservationData = {
        hotel: hotel._id || hotel.id,
        room: room._id,
        guest: currentUser._id,
        guestName: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name,
        guestEmail: currentUser.email,
        guestPhone: currentUser.phone || '',
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: parseInt(formData.guests),
        totalPrice: total,
        extraServices: formData.extraServices,
        notes: formData.specialRequests,
        status: 'confirmada' // Auto-confirm for clients
      };

      console.log('Sending reservation data:', reservationData);

      await reservationsAPI.create(reservationData);
      
      toast.success('¡Reserva creada exitosamente!');
      
      // Reset form and call success callback
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (error) {
      console.error('Error creating reservation:', error);
      
      // Mostrar mensaje de error apropiado
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al crear la reserva. Intenta nuevamente.';
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="secondary">
          ← Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Reserva</h1>
          <p className="text-gray-600">Completa los detalles de tu reserva</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reservation Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {/* Hotel and Room Info */}
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h2>
              <p className="text-gray-600">{hotel.city}, {hotel.country}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">
                  Habitación {room.number}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg">
                  {room.type}
                </span>
              </div>
            </div>

            {/* Availability Warning */}
            {occupiedDates.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  <div className="text-sm text-yellow-800">
                    <strong>Nota:</strong> Esta habitación tiene {occupiedDates.length} {occupiedDates.length === 1 ? 'reserva' : 'reservas'} activas. Verifica las fechas disponibles antes de reservar.
                  </div>
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Entrada *
                </label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleInputChange}
                  min={getTodayDate()}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Salida *
                </label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleInputChange}
                  min={getMinCheckOutDate()}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Number of Guests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Huéspedes *
              </label>
              <input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                min="1"
                max={room.capacity}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-sm text-gray-500">
                Capacidad máxima: {room.capacity} personas
              </p>
            </div>

            {/* Extra Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Servicios Adicionales (Opcional)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {EXTRA_SERVICES.map(service => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleExtraService(service.id)}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      formData.extraServices.includes(service.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{service.icon}</span>
                      <div className="text-left">
                        <p className={`font-medium ${
                          formData.extraServices.includes(service.id) 
                            ? 'text-blue-700' 
                            : 'text-gray-700'
                        }`}>
                          {service.label}
                        </p>
                        {service.description && (
                          <p className="text-xs text-gray-500">{service.description}</p>
                        )}
                      </div>
                    </div>
                    <span className={`font-bold ${
                      formData.extraServices.includes(service.id)
                        ? 'text-blue-600'
                        : 'text-gray-600'
                    }`}>
                      ${service.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
              {formData.extraServices.length > 0 && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ {formData.extraServices.length} servicio{formData.extraServices.length !== 1 ? 's' : ''} adicional{formData.extraServices.length !== 1 ? 'es' : ''} seleccionado{formData.extraServices.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Solicitudes Especiales (Opcional)
              </label>
              <textarea
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows="4"
                placeholder="Ej: Cama adicional, vista específica, alergias alimentarias, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={onBack}
                variant="secondary"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
                disabled={loading || nights <= 0}
              >
                {loading ? 'Procesando...' : 'Confirmar Reserva'}
              </Button>
            </div>
          </form>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900">Resumen de Reserva</h3>

            {/* Room Image Placeholder */}
            <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-4xl font-bold">{room.number}</div>
                <div className="text-sm mt-1">{room.type}</div>
              </div>
            </div>

            {/* Price Details */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Precio por noche</span>
                <span className="font-medium">${(room.price || 0).toLocaleString()}</span>
              </div>

              {nights > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {nights} {nights === 1 ? 'noche' : 'noches'}
                    </span>
                    <span className="font-medium">${(room.price || 0).toLocaleString()} × {nights}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal habitación</span>
                    <span className="font-medium">${roomTotal.toLocaleString()}</span>
                  </div>

                  {formData.extraServices.length > 0 && (
                    <div className="border-t pt-2 space-y-2">
                      <p className="text-xs font-medium text-gray-700">Servicios Adicionales:</p>
                      {formData.extraServices.map(serviceId => {
                        const service = EXTRA_SERVICES.find(s => s.id === serviceId);
                        return service ? (
                          <div key={serviceId} className="flex justify-between text-sm">
                            <span className="text-gray-600">{service.icon} {service.label}</span>
                            <span className="font-medium text-blue-600">${service.price.toLocaleString()}</span>
                          </div>
                        ) : null;
                      })}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal servicios</span>
                        <span className="font-medium">${servicesTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Huéspedes</span>
                    <span className="font-medium">{formData.guests}</span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl text-blue-600">${total.toLocaleString()}</span>
                    </div>
                  </div>
                </>
              )}

              {nights === 0 && formData.checkIn && formData.checkOut && (
                <div className="text-sm text-red-600 text-center">
                  Selecciona fechas válidas
                </div>
              )}
            </div>

            {/* Amenities */}
            {room.amenities && room.amenities.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Servicios incluidos</h4>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
