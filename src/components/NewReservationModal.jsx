import React, { useState, useEffect } from 'react'
import InputField from './InputField'
import Button from './Button'
import { X } from 'lucide-react'

const NewReservationModal = ({ isOpen, onClose, onSubmit, rooms = [] }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    room: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    notes: ''
  });

  // Resetear formulario cuando se abre/cierra
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        room: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        notes: ''
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.guestName || !formData.room || !formData.checkIn || !formData.checkOut) {
      alert('Por favor complete los campos obligatorios');
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      alert('La fecha de salida debe ser posterior a la fecha de entrada');
      return;
    }

    onSubmit(formData);
  };

  const availableRooms = rooms.filter(r => r.status === 'disponible');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nombre del Huésped *"
              value={formData.guestName}
              onChange={(e) => setFormData({...formData, guestName: e.target.value})}
              placeholder="Juan Pérez"
              required
            />

            <InputField
              label="Email"
              type="email"
              value={formData.guestEmail}
              onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
              placeholder="juan@email.com"
            />

            <InputField
              label="Teléfono"
              type="tel"
              value={formData.guestPhone}
              onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
              placeholder="+57 300 123 4567"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habitación *
              </label>
              <select
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccionar habitación</option>
                {availableRooms.map((room) => (
                  <option key={room._id} value={room._id}>
                    Hab. {room.number} - {room.type} (${room.price}/noche)
                  </option>
                ))}
              </select>
              {availableRooms.length === 0 && (
                <p className="text-xs text-red-600 mt-1">No hay habitaciones disponibles</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas adicionales
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows="3"
              placeholder="Peticiones especiales, alergias, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
