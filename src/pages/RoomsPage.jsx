import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { roomsAPI, reservationsAPI } from '../services/api';
import RoomCard from '../components/RoomCard';
import RoomModal from '../components/RoomModal';
import AddServicesModal from '../components/AddServicesModal';
import Button from '../components/Button';
import RoleGuard, { useRole } from '../components/RoleGuard';
import { Plus, Filter, Lock } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { ROOM_AMENITIES } from '../constants/amenities';
import { getAmenityIcon, getAmenityLabel } from '../utils/amenitiesHelper';

const RoomsPage = () => {
  const { user } = useAuth();
  const { isAdmin, hasRole } = useRole();
  const toast = useToast();
  
  // Debug: mostrar el rol del usuario
  console.log('👤 Usuario actual:', user);
  console.log('🔑 Rol:', user?.role);
  console.log('✅ isAdmin():', isAdmin());
  
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    floor: '',
    amenities: []
  });
  const [showAmenityFilters, setShowAmenityFilters] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, rooms]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await roomsAPI.getAll();
      setRooms(response.data);
    } catch (error) {
      console.error('Error al cargar habitaciones:', error);
      toast.error('Error al cargar las habitaciones');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...rooms];

    if (filters.status) {
      filtered = filtered.filter(room => room.status === filters.status);
    }
    if (filters.type) {
      filtered = filtered.filter(room => room.type === filters.type);
    }
    if (filters.floor) {
      filtered = filtered.filter(room => room.floor === parseInt(filters.floor));
    }
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(room => {
        if (!room.amenities || room.amenities.length === 0) return false;
        
        // Room must have ALL selected amenities
        return filters.amenities.every(selectedAmenityId => {
          const amenityObj = ROOM_AMENITIES.find(a => a.id === selectedAmenityId);
          if (!amenityObj) return false;
          
          // Check both by ID and label for compatibility
          return room.amenities.some(roomAmenity => 
            roomAmenity === selectedAmenityId || 
            roomAmenity.toLowerCase() === amenityObj.label.toLowerCase() ||
            roomAmenity.toLowerCase().includes(amenityObj.label.toLowerCase().split(' ')[0])
          );
        });
      });
    }

    setFilteredRooms(filtered);
  };

  const handleCreateOrUpdate = async (roomData) => {
    try {
      if (editingRoom) {
        await roomsAPI.update(editingRoom._id, roomData);
        toast.success('Habitación actualizada exitosamente');
      } else {
        await roomsAPI.create(roomData);
        toast.success('Habitación creada exitosamente');
      }
      await fetchRooms();
      setShowModal(false);
      setEditingRoom(null);
    } catch (error) {
      console.error('Error al guardar habitación:', error);
      const message = error.response?.data?.message || 'Error al guardar la habitación';
      toast.error(message);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta habitación?')) return;

    try {
      await roomsAPI.delete(id);
      await fetchRooms();
      toast.success('Habitación eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      const message = error.response?.data?.message || 'Error al eliminar la habitación';
      toast.error(message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await roomsAPI.updateStatus(id, newStatus);
      await fetchRooms();
      toast.success('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenityFilter = (amenityId) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const clearFilters = () => {
    setFilters({ status: '', type: '', floor: '', amenities: [] });
    setShowAmenityFilters(false);
  };

  const getStatusCount = (status) => {
    return rooms.filter(room => room.status === status).length;
  };

  const handleAddServicesFromRoom = async (room) => {
    try {
      // Buscar la reserva activa de esta habitación
      const response = await reservationsAPI.getAll();
      const reservationsData = Array.isArray(response) ? response : (response.data || []);
      
      const activeReservation = reservationsData.find(r => 
        (r.room?._id === room._id || r.room === room._id) &&
        (r.status === 'en_curso' || r.status === 'confirmada')
      );

      if (!activeReservation) {
        toast.error('No se encontró una reserva activa para esta habitación');
        return;
      }

      // Cargar datos completos de la reserva si es necesario
      setSelectedReservation(activeReservation);
      setShowServicesModal(true);
    } catch (error) {
      console.error('Error al buscar reserva:', error);
      toast.error('Error al buscar la reserva activa');
    }
  };

  const handleSaveServices = async (data) => {
    try {
      await reservationsAPI.update(data.reservationId, {
        extraServices: data.extraServices,
        totalPrice: data.newTotal,
        notes: data.additionalNotes 
          ? `${selectedReservation.notes || ''}\n[Servicios agregados]: ${data.additionalNotes}`.trim()
          : selectedReservation.notes
      });

      setShowServicesModal(false);
      setSelectedReservation(null);
      
      toast.success(`Servicios actualizados. Nuevo total: $${data.newTotal.toLocaleString()}`);
    } catch (error) {
      console.error('Error al actualizar servicios:', error);
      const message = error.response?.data?.message || 'Error al actualizar los servicios';
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="skeleton h-8 w-48 rounded"></div>
          <div className="skeleton h-10 w-40 rounded-lg"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4">
              <div className="skeleton h-4 w-24 rounded mb-2"></div>
              <div className="skeleton h-8 w-16 rounded"></div>
            </div>
          ))}
        </div>

        {/* Grid Skeleton */}
        <SkeletonGrid items={6} columns={3} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Habitaciones</h2>
          <p className="text-gray-600 mt-1">Total: {rooms.length} habitaciones</p>
        </div>
        
        {/* Botón para admin y hotel_admin */}
        {(user?.role === 'admin' || user?.role === 'hotel_admin' || user?.role === 'admin_global') && (
          <Button 
            onClick={() => {
              setEditingRoom(null);
              setShowModal(true);
            }} 
            className="w-full sm:w-auto px-6 py-3 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nueva Habitación
          </Button>
        )}

        {/* Mensaje para empleados */}
        {user?.role === 'empleado' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700 flex items-start gap-2">
            <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Solo administradores pueden crear nuevas habitaciones</span>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-600 text-sm font-medium">Disponibles</p>
          <p className="text-2xl font-bold text-green-700">{getStatusCount('disponible')}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm font-medium">Ocupadas</p>
          <p className="text-2xl font-bold text-red-700">{getStatusCount('ocupada')}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-600 text-sm font-medium">Limpieza</p>
          <p className="text-2xl font-bold text-yellow-700">{getStatusCount('limpieza')}</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-600 text-sm font-medium">Mantenimiento</p>
          <p className="text-2xl font-bold text-orange-700">{getStatusCount('mantenimiento')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="ocupada">Ocupada</option>
            <option value="limpieza">Limpieza</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los tipos</option>
            <option value="simple">Simple</option>
            <option value="doble">Doble</option>
            <option value="suite">Suite</option>
            <option value="familiar">Familiar</option>
          </select>

          <select
            value={filters.floor}
            onChange={(e) => handleFilterChange('floor', e.target.value)}
            className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos los pisos</option>
            {[1, 2, 3, 4, 5].map(floor => (
              <option key={floor} value={floor}>Piso {floor}</option>
            ))}
          </select>

          <button
            onClick={clearFilters}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            Limpiar filtros
          </button>
        </div>

        {/* Amenities filter toggle */}
        <button
          onClick={() => setShowAmenityFilters(!showAmenityFilters)}
          className="w-full mt-3 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <span className="font-medium">
            🔍 Filtrar por Amenidades {filters.amenities.length > 0 && `(${filters.amenities.length})`}
          </span>
          <span>{showAmenityFilters ? '▲' : '▼'}</span>
        </button>

        {/* Amenities filters */}
        {showAmenityFilters && (
          <div className="mt-3 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {ROOM_AMENITIES.map(amenity => (
                <button
                  key={amenity.id}
                  onClick={() => toggleAmenityFilter(amenity.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    filters.amenities.includes(amenity.id)
                      ? 'bg-blue-500 text-white border-2 border-blue-600'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1">{amenity.icon}</span>
                  <span className="text-xs">{amenity.label}</span>
                </button>
              ))}
            </div>
            {filters.amenities.length > 0 && (
              <p className="text-sm text-blue-600 mt-2">
                {filters.amenities.length} amenidad{filters.amenities.length !== 1 ? 'es' : ''} seleccionada{filters.amenities.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">No se encontraron habitaciones</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              onAddServices={handleAddServicesFromRoom}
              userRole={user.role}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <RoomModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingRoom(null);
        }}
        onSubmit={handleCreateOrUpdate}
        room={editingRoom}
      />

      {/* Modal de Servicios */}
      <AddServicesModal
        isOpen={showServicesModal}
        onClose={() => {
          setShowServicesModal(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        onSave={handleSaveServices}
      />
    </div>
  );
};

export default RoomsPage;
