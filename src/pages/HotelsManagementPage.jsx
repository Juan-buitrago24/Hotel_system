import React, { useState, useEffect } from 'react';
import { Hotel, Plus, Users, Bed, Calendar, TrendingUp, Edit, Trash2, CheckCircle, XCircle, Search, Filter, Download, Eye, DollarSign, Star } from 'lucide-react';
import Button from '../components/Button';
import RegisterHotelModal from '../components/RegisterHotelModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SkeletonGrid } from '../components/SkeletonLoader';

const HotelsManagementPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [newPlan, setNewPlan] = useState('');
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    // Aplicar filtros
    let result = hotels;
    
    // Filtro de búsqueda
    if (searchTerm) {
      result = result.filter(hotel =>
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtro de plan
    if (filterPlan !== 'all') {
      result = result.filter(hotel => hotel.plan === filterPlan);
    }
    
    // Filtro de estado
    if (filterStatus !== 'all') {
      result = result.filter(hotel => hotel.active === (filterStatus === 'active'));
    }
    
    setFilteredHotels(result);
  }, [hotels, searchTerm, filterPlan, filterStatus]);

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

  const handleChangePlan = (hotel) => {
    setSelectedHotel(hotel);
    setNewPlan(hotel.plan);
    setShowPlanModal(true);
  };

  const handleUpdatePlan = async () => {
    if (!selectedHotel || !newPlan) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/hotels/${selectedHotel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ plan: newPlan })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el plan');
      }

      toast.success('Plan actualizado exitosamente');
      setShowPlanModal(false);
      setSelectedHotel(null);
      fetchHotels();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el plan: ' + error.message);
    }
  };

  const handleExportCSV = () => {
    const csvData = [
      ['Nombre', 'Slug', 'Plan', 'Activo', 'Habitaciones', 'Reservas', 'Empleados', 'Email', 'Teléfono', 'Fecha Creación'],
      ...filteredHotels.map(h => [
        h.name,
        h.slug,
        h.plan,
        h.active ? 'Sí' : 'No',
        h.stats?.rooms || 0,
        h.stats?.reservations || 0,
        h.stats?.employees || 0,
        h.contact?.email || '',
        h.contact?.phone || '',
        new Date(h.createdAt).toLocaleDateString('es-ES')
      ])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hoteles-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Datos exportados exitosamente');
  };

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setShowDetailsModal(true);
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
          <p className="text-gray-600 mt-1">Total: {filteredHotels.length} de {hotels.length} hoteles</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportCSV}
            variant="secondary"
            className="px-4 py-2"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar CSV
          </Button>
          <Button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Hotel
          </Button>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre o slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro de Plan */}
          <div>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los planes</option>
              <option value="free">Gratuito</option>
              <option value="basic">Básico</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {/* Filtro de Estado */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
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
      {filteredHotels.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Hotel className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {hotels.length === 0 ? 'No hay hoteles registrados' : 'No se encontraron hoteles'}
          </h3>
          <p className="text-gray-500 mb-6">
            {hotels.length === 0 ? 'Comienza creando tu primer hotel' : 'Intenta con otros filtros de búsqueda'}
          </p>
          {hotels.length === 0 && (
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Crear Primer Hotel
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHotels.map((hotel) => (
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
                <div className="cursor-pointer" onClick={() => handleChangePlan(hotel)}>
                  {getPlanBadge(hotel.plan)}
                </div>
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
                  onClick={() => handleViewDetails(hotel)}
                  className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Ver detalles"
                >
                  <Eye className="w-5 h-5" />
                </button>
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
                  onClick={() => handleChangePlan(hotel)}
                  className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
                  title="Cambiar plan"
                >
                  <Star className="w-5 h-5" />
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

      {/* Modal de Cambio de Plan */}
      {showPlanModal && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Cambiar Plan - {selectedHotel.name}
            </h3>
            <p className="text-gray-600 mb-6">
              Plan actual: <span className="font-semibold">{selectedHotel.plan}</span>
            </p>

            <div className="space-y-3 mb-6">
              {['free', 'basic', 'premium', 'enterprise'].map((plan) => (
                <label
                  key={plan}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    newPlan === plan
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan}
                    checked={newPlan === plan}
                    onChange={(e) => setNewPlan(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {getPlanBadge(plan)}
                      {plan === 'enterprise' && (
                        <span className="text-xs text-yellow-600 font-semibold">Recomendado</span>
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPlanModal(false);
                  setSelectedHotel(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdatePlan}
                disabled={newPlan === selectedHotel.plan}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Actualizar Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalles */}
      {showDetailsModal && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedHotel.name}
                </h3>
                {getPlanBadge(selectedHotel.plan)}
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedHotel(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Información Básica */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-3">Información Básica</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Slug:</span>
                    <p className="font-medium">{selectedHotel.slug}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Estado:</span>
                    <p className="font-medium">
                      {selectedHotel.active ? (
                        <span className="text-green-600">✓ Activo</span>
                      ) : (
                        <span className="text-red-600">✗ Inactivo</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Fecha de Registro:</span>
                    <p className="font-medium">
                      {new Date(selectedHotel.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">ID:</span>
                    <p className="font-medium text-xs">{selectedHotel.id}</p>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              {selectedHotel.contact && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Contacto</h4>
                  <div className="space-y-2 text-sm">
                    {selectedHotel.contact.email && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Email:</span>
                        <a
                          href={`mailto:${selectedHotel.contact.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedHotel.contact.email}
                        </a>
                      </div>
                    )}
                    {selectedHotel.contact.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Teléfono:</span>
                        <a
                          href={`tel:${selectedHotel.contact.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedHotel.contact.phone}
                        </a>
                      </div>
                    )}
                    {selectedHotel.contact.address && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Dirección:</span>
                        <p>{selectedHotel.contact.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Estadísticas Detalladas */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-3">Estadísticas</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Bed className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedHotel.stats?.rooms || 0}
                    </p>
                    <p className="text-xs text-gray-600">Habitaciones</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Calendar className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedHotel.stats?.reservations || 0}
                    </p>
                    <p className="text-xs text-gray-600">Reservas</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedHotel.stats?.employees || 0}
                    </p>
                    <p className="text-xs text-gray-600">Empleados</p>
                  </div>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleChangePlan(selectedHotel);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Cambiar Plan
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleToggleActive(selectedHotel.id, selectedHotel.active);
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedHotel.active
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedHotel.active ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsManagementPage;
