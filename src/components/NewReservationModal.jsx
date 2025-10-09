import React, { useState } from 'react'
import InputField from './InputField'
import Button from './Button'

const NewReservationModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    guestName: '',
    room: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    status: 'pendiente'
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.guestName || !formData.room || !formData.checkIn || !formData.checkOut) {
      alert('Por favor complete todos los campos');
      return;
    }
    onSubmit(formData);
    setFormData({ guestName: '', room: '', checkIn: '', checkOut: '', guests: 1, status: 'pendiente' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Nueva Reserva</h3>
        <div className="space-y-4">
          <InputField
            label="Nombre del Huésped"
            value={formData.guestName}
            onChange={(e) => setFormData({...formData, guestName: e.target.value})}
          />
          <InputField
            label="Habitación"
            value={formData.room}
            onChange={(e) => setFormData({...formData, room: e.target.value})}
          />
          <InputField
            label="Check-in"
            type="date"
            value={formData.checkIn}
            onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
          />
          <InputField
            label="Check-out"
            type="date"
            value={formData.checkOut}
            onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
          />
          <InputField
            label="Número de Huéspedes"
            type="number"
            min="1"
            value={formData.guests}
            onChange={(e) => setFormData({...formData, guests: parseInt(e.target.value)})}
          />
          <div className="flex space-x-3 pt-4">
            <Button variant="secondary" onClick={onClose} fullWidth>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} fullWidth>
              Crear Reserva
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReservationModal
