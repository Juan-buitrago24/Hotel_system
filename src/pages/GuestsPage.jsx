import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Mail, Phone, MapPin, Calendar, Search, FileText, Star } from 'lucide-react';
import { guestAPI, reservationsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import InputField from '../components/InputField';
import AddServicesModal from '../components/AddServicesModal';
import ExtendStayModal from '../components/ExtendStayModal';
import { SkeletonTable } from '../components/SkeletonLoader';

const GuestsPage = ({ user }) => {
  const toast = useToast();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [guestHistory, setGuestHistory] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    documentType: 'CC',
    documentNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Colombia',
    dateOfBirth: '',
    nationality: 'Colombiana',
    notes: '',
    preferences: '',
    isVIP: false
  });

  useEffect(() => {
    if (user && user.hotel) {
      loadGuests();
    }
  }, [user]);

  const loadGuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await guestAPI.getAll();
      setGuests(data);
    } catch (error) {
      console.error('Error cargando huéspedes:', error);
      setError(error.message || 'Error al cargar huéspedes');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (guest = null) => {
    if (guest) {
      setEditingGuest(guest);
      setFormData({
        firstName: guest.firstName || '',
        lastName: guest.lastName || '',
        documentType: guest.documentType || 'CC',
        documentNumber: guest.documentNumber || '',
        email: guest.email || '',
        phone: guest.phone || '',
        address: guest.address || '',
        city: guest.city || '',
        country: guest.country || 'Colombia',
        dateOfBirth: guest.dateOfBirth ? guest.dateOfBirth.split('T')[0] : '',
        nationality: guest.nationality || 'Colombiana',
        notes: guest.notes || '',
        preferences: guest.preferences || '',
        isVIP: guest.isVIP || false
      });
    } else {
      setEditingGuest(null);
      setFormData({
        firstName: '',
        lastName: '',
        documentType: 'CC',
        documentNumber: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: 'Colombia',
        dateOfBirth: '',
        nationality: 'Colombiana',
        notes: '',
        preferences: '',
        isVIP: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGuest(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Agregar hotel al formData antes de enviar
      const guestData = {
        ...formData,
        hotel: user.hotel._id || user.hotel, // Asegurar que siempre tenga hotel
        email: formData.email?.trim() || undefined // Si está vacío, enviar undefined
      };
      
      if (editingGuest) {
        await guestAPI.update(editingGuest._id, guestData);
        toast.success('Huésped actualizado exitosamente');
      } else {
        await guestAPI.create(guestData);
        toast.success('Huésped creado exitosamente');
      }
      handleCloseModal();
      loadGuests();
    } catch (error) {
      console.error('Error guardando huésped:', error);
      toast.error(error.response?.data?.message || 'Error al guardar huésped');
    }
  };

  const handleDelete = async (guestId) => {
    if (!window.confirm('¿Estás seguro de eliminar este huésped?')) return;
    
    try {
      await guestAPI.delete(guestId);
      toast.success('Huésped eliminado exitosamente');
      loadGuests();
    } catch (error) {
      console.error('Error eliminando huésped:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar huésped');
    }
  };

  const handleShowHistory = async (guest) => {
    try {
      setSelectedGuest(guest);
      const history = await guestAPI.getHistory(guest._id);
      setGuestHistory(history);
      setShowHistory(true);
    } catch (error) {
      console.error('Error cargando historial:', error);
      toast.error('Error al cargar el historial');
    }
  };

  const handleAddServicesFromGuest = async (guest) => {
    try {
      // Buscar la reserva activa del huésped
      const allReservations = await reservationsAPI.getAll();
      const activeReservation = allReservations.find(
        (r) => r.guest?._id === guest._id && 
               (r.status === 'en_curso' || r.status === 'confirmada')
      );

      if (!activeReservation) {
        toast.error('No se encontró una reserva activa para este huésped');
        return;
      }

      setSelectedReservation(activeReservation);
      setShowServicesModal(true);
    } catch (error) {
      console.error('Error buscando reserva:', error);
      toast.error('Error al buscar la reserva del huésped');
    }
  };

  const handleSaveServices = async (reservationId, extraServices, additionalNotes) => {
    try {
      const reservation = selectedReservation;
      
      // Calcular el total de servicios
      const servicesTotal = extraServices.reduce((sum, serviceId) => {
        const service = EXTRA_SERVICES.find(s => s.id === serviceId);
        return sum + (service?.price || 0);
      }, 0);

      // Calcular nuevo total
      const roomTotal = reservation.totalPrice - (reservation.extraServices?.reduce((sum, serviceId) => {
        const service = EXTRA_SERVICES.find(s => s.id === serviceId);
        return sum + (service?.price || 0);
      }, 0) || 0);
      
      const newTotal = roomTotal + servicesTotal;

      // Preparar notas con información de servicios agregados
      let notesUpdate = reservation.notes || '';
      if (additionalNotes) {
        const timestamp = new Date().toLocaleString('es-CO');
        notesUpdate += `\n[${timestamp} - Servicios agregados]: ${additionalNotes}`;
      }

      await reservationsAPI.update(reservationId, {
        extraServices,
        totalPrice: newTotal,
        notes: notesUpdate
      });

      toast.success(`Servicios actualizados. Nuevo total: $${newTotal.toFixed(2)}`);
      setShowServicesModal(false);
      setSelectedReservation(null);
    } catch (error) {
      console.error('Error actualizando servicios:', error);
      toast.error('Error al actualizar los servicios');
    }
  };

  const handleOpenExtendModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowExtendModal(true);
  };

  const handleExtendStay = async (extensionData) => {
    try {
      await reservationsAPI.extendStay(extensionData.reservationId, extensionData);
      
      toast.success('Estadía extendida exitosamente');
      setShowExtendModal(false);
      setSelectedReservation(null);
      
      // Recargar historial si está abierto
      if (showHistory && selectedGuest) {
        loadGuestHistory(selectedGuest._id);
      }
    } catch (error) {
      console.error('Error extending stay:', error);
      toast.error(error.response?.data?.message || 'Error al extender la estadía');
    }
  };

  const canExtend = (reservation) => {
    if (!reservation) return false;
    if (!['confirmada', 'en_curso'].includes(reservation.status)) {
      return false;
    }
    const checkOut = new Date(reservation.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkOut >= today;
  };


  const filteredGuests = guests.filter(g =>
    g.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.documentNumber?.includes(searchTerm) ||
    g.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.phone?.includes(searchTerm)
  );

  const canEdit = user?.role === 'hotel_admin' || user?.role === 'admin_global' || user?.role === 'empleado';
  const canDelete = user?.role === 'hotel_admin' || user?.role === 'admin_global';

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="skeleton h-8 w-64 rounded mb-2"></div>
            <div className="skeleton h-4 w-80 rounded"></div>
          </div>
          <div className="skeleton h-10 w-40 rounded-lg"></div>
        </div>

        {/* Search Skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="skeleton h-10 w-full rounded-lg"></div>
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

        {/* Table Skeleton */}
        <SkeletonTable rows={8} columns={8} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            Gestión de Huéspedes
          </h1>
          <p className="text-gray-600 mt-1">
            Administra la información de tus huéspedes
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => handleOpenModal()}>
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Huésped
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, documento, email o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando huéspedes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error: {error}</p>
            <Button onClick={loadGuests} className="mt-4">Reintentar</Button>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No hay huéspedes registrados</p>
            <p className="text-gray-400 text-sm mt-2">Comienza agregando tu primer huésped</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Huésped
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ciudad
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuests.map((guest) => (
                <tr key={guest._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">
                          {guest.firstName?.[0]}{guest.lastName?.[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {guest.firstName} {guest.lastName}
                          {guest.isVIP && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{guest.nationality}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{guest.documentType}</div>
                    <div className="text-sm text-gray-500">{guest.documentNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    {guest.email && (
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{guest.email}</span>
                      </div>
                    )}
                    {guest.phone && (
                      <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{guest.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {guest.city || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleShowHistory(guest)}
                      className="text-green-600 hover:text-green-900 mr-4 inline-flex items-center"
                      title="Ver historial"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Historial
                    </button>
                    {canEdit && (
                      <button
                        onClick={() => handleAddServicesFromGuest(guest)}
                        className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center"
                        title="Agregar servicios"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Servicios
                      </button>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => handleOpenModal(guest)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4 inline-flex items-center"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Editar
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(guest._id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Create/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingGuest ? 'Editar Huésped' : 'Nuevo Huésped'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Información Personal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Nombre"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                    
                    <InputField
                      label="Apellido"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                    
                    <InputField
                      label="Tipo de Documento"
                      type="select"
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                      required
                    >
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="TI">Tarjeta de Identidad</option>
                    </InputField>
                    
                    <InputField
                      label="Número de Documento"
                      type="text"
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                      required
                      disabled={editingGuest}
                    />
                    
                    <InputField
                      label="Fecha de Nacimiento"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    />
                    
                    <InputField
                      label="Nacionalidad"
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    />
                  </div>
                </div>

                {/* Información de Contacto */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Información de Contacto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Teléfono"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                    
                    <InputField
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    
                    <InputField
                      label="Dirección"
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                    
                    <InputField
                      label="Ciudad"
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    
                    <InputField
                      label="País"
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                </div>

                {/* Notas y Preferencias */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-700">Notas y Preferencias</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Información adicional sobre el huésped..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preferencias
                      </label>
                      <textarea
                        value={formData.preferences}
                        onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Habitación alta, vista al mar, no mascotas..."
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isVIP"
                        checked={formData.isVIP}
                        onChange={(e) => setFormData({ ...formData, isVIP: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isVIP" className="ml-2 block text-sm text-gray-700 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Marcar como huésped VIP
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingGuest ? 'Actualizar' : 'Crear Huésped'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal History */}
      {showHistory && selectedGuest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Historial de {selectedGuest.firstName} {selectedGuest.lastName}
                </h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {guestHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No hay reservas registradas para este huésped</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {guestHistory.map((reservation) => (
                    <div key={reservation._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Habitación {reservation.room?.number} - {reservation.room?.type}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Check-in: {new Date(reservation.checkIn).toLocaleDateString('es-ES')}
                          </p>
                          <p className="text-sm text-gray-600">
                            Check-out: {new Date(reservation.checkOut).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          reservation.status === 'confirmada' ? 'bg-blue-100 text-blue-800' :
                          reservation.status === 'en_curso' ? 'bg-green-100 text-green-800' :
                          reservation.status === 'completada' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {reservation.status === 'confirmada' ? 'Confirmada' :
                           reservation.status === 'en_curso' ? 'En Curso' :
                           reservation.status === 'completada' ? 'Completada' :
                           'Cancelada'}
                        </span>
                      </div>
                      {reservation.totalPrice && (
                        <p className="text-sm text-gray-600 mt-2">
                          Total: ${reservation.totalPrice.toLocaleString()}
                        </p>
                      )}
                      {/* Botones de acción para reservas activas */}
                      {(reservation.status === 'confirmada' || reservation.status === 'en_curso') && (
                        <div className="flex gap-2 mt-3 pt-3 border-t">
                          <button
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setShowServicesModal(true);
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Servicios
                          </button>
                          {canExtend(reservation) && (
                            <button
                              onClick={() => handleOpenExtendModal(reservation)}
                              className="flex items-center gap-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors text-sm"
                            >
                              <Calendar className="w-4 h-4" />
                              Extender
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end mt-6 pt-6 border-t">
                <Button onClick={() => setShowHistory(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Services */}
      {showServicesModal && selectedReservation && (
        <AddServicesModal
          reservation={selectedReservation}
          onClose={() => {
            setShowServicesModal(false);
            setSelectedReservation(null);
          }}
          onSave={handleSaveServices}
        />
      )}

      {/* Modal Extend Stay */}
      {showExtendModal && selectedReservation && (
        <ExtendStayModal
          isOpen={showExtendModal}
          onClose={() => {
            setShowExtendModal(false);
            setSelectedReservation(null);
          }}
          reservation={selectedReservation}
          onSave={handleExtendStay}
        />
      )}
    </div>
  );
};

export default GuestsPage;
