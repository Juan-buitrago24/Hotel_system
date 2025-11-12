import React, { useState, useEffect } from 'react'
import InputField from './InputField'
import Button from './Button'
import { X, Search, User, Star } from 'lucide-react'
import { guestAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

const NewReservationModal = ({ isOpen, onClose, onSubmit, rooms = [] }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    guest: null, // ID del huésped si se selecciona uno existente
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    room: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    notes: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showGuestSearch, setShowGuestSearch] = useState(false);
  const [allGuests, setAllGuests] = useState([]);

  // Cargar todos los huéspedes al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadGuests();
    }
  }, [isOpen]);

  const loadGuests = async () => {
    try {
      const guests = await guestAPI.getAll();
      setAllGuests(guests);
    } catch (error) {
      console.error('Error cargando huéspedes:', error);
    }
  };

  // Buscar huéspedes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const results = allGuests.filter(g =>
      g.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.documentNumber?.includes(searchTerm) ||
      g.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.phone?.includes(searchTerm)
    ).slice(0, 5); // Limitar a 5 resultados

    setSearchResults(results);
  }, [searchTerm, allGuests]);

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        guest: null,
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        room: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        notes: ''
      });
      setSearchTerm('');
      setSearchResults([]);
      setShowGuestSearch(false);
    }
  }, [isOpen]);

  const handleSelectGuest = (guest) => {
    setFormData({
      ...formData,
      guest: guest._id,
      guestName: `${guest.firstName} ${guest.lastName}`,
      guestEmail: guest.email || '',
      guestPhone: guest.phone || ''
    });
    setSearchTerm('');
    setSearchResults([]);
    setShowGuestSearch(false);
  };

  const handleClearGuest = () => {
    setFormData({
      ...formData,
      guest: null,
      guestName: '',
      guestEmail: '',
      guestPhone: ''
    });
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.guestName || !formData.room || !formData.checkIn || !formData.checkOut) {
      toast.warning('Por favor complete los campos obligatorios');
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      toast.warning('La fecha de salida debe ser posterior a la fecha de entrada');
      return;
    }

    onSubmit(formData);
  };

  const availableRooms = rooms.filter(r => r.status === 'disponible');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <h3 className="text-2xl font-bold">Nueva Reserva</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Búsqueda de Huésped Existente */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Información del Huésped
              </h4>
              {!formData.guest && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowGuestSearch(!showGuestSearch)}
                  className="text-sm"
                >
                  <Search className="w-4 h-4 mr-1" />
                  {showGuestSearch ? 'Nuevo Huésped' : 'Buscar Existente'}
                </Button>
              )}
              {formData.guest && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClearGuest}
                  className="text-sm"
                >
                  Cambiar Huésped
                </Button>
              )}
            </div>

            {showGuestSearch && !formData.guest && (
              <div className="mb-4 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, documento, email o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 dark:placeholder-gray-500"
                  />
                </div>
                
                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {searchResults.map((guest) => (
                      <button
                        key={guest._id}
                        type="button"
                        onClick={() => handleSelectGuest(guest)}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors border-b border-gray-100 dark:border-gray-600 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              {guest.firstName} {guest.lastName}
                              {guest.isVIP && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {guest.documentType} {guest.documentNumber}
                            </p>
                            {guest.email && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">{guest.email}</p>
                            )}
                          </div>
                          {guest.phone && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">{guest.phone}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nombre del Huésped *"
              value={formData.guestName}
              onChange={(e) => setFormData({...formData, guestName: e.target.value})}
              placeholder="Juan Pérez"
              required
              disabled={!!formData.guest}
            />

            <InputField
              label="Email"
              type="email"
              value={formData.guestEmail}
              onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
              placeholder="juan@email.com"
              disabled={!!formData.guest}
            />

            <InputField
              label="Teléfono"
              type="tel"
              value={formData.guestPhone}
              onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
              placeholder="+57 300 123 4567"
              disabled={!!formData.guest}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Habitación *
              </label>
              <select
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar habitación</option>
                {availableRooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    Hab. {room.number} - {room.type} (${room.price}/noche)
                  </option>
                ))}
              </select>
              {availableRooms.length === 0 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">No hay habitaciones disponibles</p>
              )}
            </div>

            <InputField
              label="Fecha de Entrada *"
              type="date"
              value={formData.checkIn}
              onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
              required
            />

            <InputField
              label="Fecha de Salida *"
              type="date"
              value={formData.checkOut}
              onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
              required
            />

            <InputField
              label="Número de Huéspedes *"
              type="number"
              min="1"
              value={formData.guests}
              onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notas adicionales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows="3"
              placeholder="Peticiones especiales, alergias, etc."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={availableRooms.length === 0}
            >
              Crear Reserva
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewReservationModal
