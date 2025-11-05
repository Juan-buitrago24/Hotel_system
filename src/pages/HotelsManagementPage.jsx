import React, { useState, useEffect } from 'react';
import { Hotel, Plus, Users, Bed, Calendar, TrendingUp, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Button from '../components/Button';
import RegisterHotelModal from '../components/RegisterHotelModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SkeletonGrid } from '../components/SkeletonLoader';

const HotelsManagementPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/hotels`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar hoteles');
      }

      const data = await response.json();
      setHotels(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar los hoteles: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (hotelId, currentStatus) => {
    if (!confirm(`¿Estás seguro de ${currentStatus ? 'desactivar' : 'activar'} este hotel?`)) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/hotels/${hotelId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ active: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el hotel');
      }

      toast.success(`Hotel ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
      fetchHotels();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el hotel: ' + error.message);
    }
  };

  const getPlanBadge = (plan) => {
    const plans = {
      free: { label: 'Gratuito', color: 'bg-gray-100 text-gray-800' },
      basic: { label: 'Básico', color: 'bg-blue-100 text-blue-800' },
      premium: { label: 'Premium', color: 'bg-purple-100 text-purple-800' },
      enterprise: { label: 'Enterprise', color: 'bg-yellow-100 text-yellow-800' }
    };
    const { label, color } = plans[plan] || plans.free;
    return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{label}</span>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <div className="skeleton h-8 w-48 rounded mb-2"></div>
            <div className="skeleton h-4 w-64 rounded"></div>
          </div>
          <div className="skeleton h-10 w-40 rounded-lg"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="skeleton h-5 w-32 rounded mb-2"></div>
              <div className="skeleton h-10 w-20 rounded"></div>
            </div>
          ))}
        </div>

        {/* Hotels Grid Skeleton */}
        <SkeletonGrid items={6} columns={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Gestión de Hoteles</h2>
          <p className="text-gray-600 mt-1">Total: {hotels.length} hoteles registrados</p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-6 py-3 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Hotel
        </Button>
      </div>

      {/* Estadísticas Globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <Hotel className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-blue-100 text-sm">Total Hoteles</p>
          <p className="text-3xl font-bold">{hotels.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <CheckCircle className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-green-100 text-sm">Hoteles Activos</p>
          <p className="text-3xl font-bold">{hotels.filter(h => h.active).length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Bed className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-purple-100 text-sm">Total Habitaciones</p>
          <p className="text-3xl font-bold">{hotels.reduce((sum, h) => sum + (h.stats?.rooms || 0), 0)}</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <Calendar className="w-8 h-8 mb-2 opacity-80" />
          <p className="text-orange-100 text-sm">Total Reservas</p>
          <p className="text-3xl font-bold">{hotels.reduce((sum, h) => sum + (h.stats?.reservations || 0), 0)}</p>
        </div>
      </div>

      {/* Lista de Hoteles */}
      {hotels.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Hotel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay hoteles registrados</h3>
          <p className="text-gray-500 mb-6">Comienza creando tu primer hotel</p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Crear Primer Hotel
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6"
            >
              {/* Header del Hotel */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{hotel.name}</h3>
                    {hotel.active ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Slug: {hotel.slug}</p>
                </div>
                {getPlanBadge(hotel.plan)}
              </div>

              {/* Información de Contacto */}
              {hotel.contact && (
                <div className="mb-4 space-y-1 text-sm text-gray-600">
                  {hotel.contact.email && (
                    <div className="flex items-center gap-2">
                      <span>📧</span>
                      <span>{hotel.contact.email}</span>
                    </div>
                  )}
                  {hotel.contact.phone && (
                    <div className="flex items-center gap-2">
                      <span>📱</span>
                      <span>{hotel.contact.phone}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Bed className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-800">{hotel.stats?.rooms || 0}</p>
                  <p className="text-xs text-gray-600">Habitaciones</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-800">{hotel.stats?.reservations || 0}</p>
                  <p className="text-xs text-gray-600">Reservas</p>
                </div>
                <div className="text-center">
                  <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-800">{hotel.stats?.employees || 0}</p>
                  <p className="text-xs text-gray-600">Empleados</p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActive(hotel.id, hotel.active)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    hotel.active
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {hotel.active ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Editar hotel"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              {/* Fecha de Creación */}
              <p className="text-xs text-gray-400 mt-3 text-center">
                Registrado: {new Date(hotel.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Registro */}
      <RegisterHotelModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchHotels}
      />
    </div>
  );
};

export default HotelsManagementPage;
