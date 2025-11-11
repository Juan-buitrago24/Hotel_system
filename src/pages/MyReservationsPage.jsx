import { useState, useEffect } from 'react';
import { reservationsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { EXTRA_SERVICES } from '../constants/amenities';

export default function MyReservationsPage({ currentUser }) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const toast = useToast(); // Corregido: no desestructurar

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const response = await reservationsAPI.getAll();
      console.log('Reservations response:', response);
      
      // La API puede devolver { reservations: [...] } o directamente [...]
      const reservationsData = Array.isArray(response) ? response : (response.reservations || response.data || []);
      
      console.log('All reservations:', reservationsData);
      console.log('Current user ID:', currentUser._id);
      
      // Filter reservations for current user (as guest)
      const userReservations = reservationsData.filter(res => {
        const guestId = res.guest?._id || res.guest;
        const matches = guestId === currentUser._id;
        console.log('Checking reservation:', { 
          resId: res._id, 
          guestId, 
          currentUserId: currentUser._id, 
          matches 
        });
        return matches;
      });
      
      console.log('User reservations after filter:', userReservations);
      
      // Sort by check-in date (newest first)
      userReservations.sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
      
      setReservations(userReservations);
    } catch (error) {
      console.error('Error loading reservations:', error);
      toast.error('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) {
      return;
    }

    try {
      await reservationsAPI.update(reservationId, { status: 'cancelada' }); // Cambiar a español
      toast.success('Reserva cancelada exitosamente');
      loadReservations(); // Reload to show updated status
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Error al cancelar la reserva');
    }
  };

  // Filter reservations by status
  const getFilteredReservations = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'upcoming':
        return reservations.filter(res => {
          const checkIn = new Date(res.checkIn);
          return checkIn >= today && res.status !== 'cancelada';
        });
      case 'past':
        return reservations.filter(res => {
          const checkOut = new Date(res.checkOut);
          return checkOut < today || res.status === 'cancelada';
        });
      case 'all':
      default:
        return reservations;
    }
  };

  const filteredReservations = getFilteredReservations();

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return nights;
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const badges = {
      pendiente: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pendiente' },
      confirmada: { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmada' },
      en_curso: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'En curso' },
      completada: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Completada' },
      cancelada: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelada' }
    };

    const badge = badges[status] || badges.pendiente;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  // Check if reservation can be cancelled
  const canCancel = (reservation) => {
    if (reservation.status === 'cancelada' || reservation.status === 'completada') {
      return false;
    }
    const checkIn = new Date(reservation.checkIn);
    const today = new Date();
    return checkIn > today;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />
        <SkeletonGrid columns={1} items={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
        <p className="text-gray-600 mt-1">Gestiona tus reservas de hotel</p>
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Próximas ({reservations.filter(r => {
              const checkIn = new Date(r.checkIn);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return checkIn >= today && r.status !== 'cancelada';
            }).length})
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'past'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pasadas ({reservations.filter(r => {
              const checkOut = new Date(r.checkOut);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return checkOut < today || r.status === 'cancelada';
            }).length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({reservations.length})
          </button>
        </div>
      </div>

      {/* Reservations list */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {filter === 'upcoming' && 'No tienes reservas próximas'}
            {filter === 'past' && 'No tienes reservas pasadas'}
            {filter === 'all' && 'No tienes reservas'}
          </h3>
          <p className="text-gray-600">
            Comienza a explorar hoteles y crea tu primera reserva
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map(reservation => {
            const nights = calculateNights(reservation.checkIn, reservation.checkOut);
            const hotelName = reservation.hotel?.name || 'Hotel';
            const roomNumber = reservation.room?.roomNumber || 'N/A';
            const roomType = reservation.room?.roomType || '';

            return (
              <div
                key={reservation._id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Reservation info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{hotelName}</h3>
                        <p className="text-gray-600">
                          Habitación {roomNumber} {roomType && `- ${roomType}`}
                        </p>
                      </div>
                      {getStatusBadge(reservation.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Check-in:</span>
                        <span className="ml-2 font-medium">{formatDate(reservation.checkIn)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Check-out:</span>
                        <span className="ml-2 font-medium">{formatDate(reservation.checkOut)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Noches:</span>
                        <span className="ml-2 font-medium">{nights}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Huéspedes:</span>
                        <span className="ml-2 font-medium">{reservation.guests}</span>
                      </div>
                    </div>

                    {reservation.extraServices && reservation.extraServices.length > 0 && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Servicios adicionales:</p>
                        <div className="flex flex-wrap gap-2">
                          {reservation.extraServices.map((serviceId, index) => {
                            const service = EXTRA_SERVICES.find(s => s.id === serviceId);
                            return service ? (
                              <span key={index} className="px-2 py-1 bg-white rounded text-xs border border-blue-200">
                                {service.icon} {service.label} (+${service.price.toLocaleString()})
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {reservation.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Solicitudes especiales:</span> {reservation.notes}
                        </p>
                      </div>
                    )}

                    {reservation.specialRequests && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Solicitudes especiales:</span> {reservation.specialRequests}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Price and actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ${reservation.totalPrice}
                      </div>
                      <div className="text-sm text-gray-600">Total</div>
                    </div>

                    {canCancel(reservation) && (
                      <Button
                        onClick={() => handleCancelReservation(reservation._id)}
                        variant="danger"
                        className="text-sm"
                      >
                        Cancelar Reserva
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
