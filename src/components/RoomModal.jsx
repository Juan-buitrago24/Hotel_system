import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import InputField from './InputField';
import { ROOM_AMENITIES } from '../constants/amenities';

const RoomModal = ({ isOpen, onClose, onSubmit, room }) => {
  const [formData, setFormData] = useState({
    number: '',
    type: 'simple',
    capacity: 1,
    price: 0,
    floor: 1,
    status: 'disponible',
    amenities: [],
    description: ''
  });

  useEffect(() => {
    if (room) {
      setFormData({
        number: room.number || '',
        type: room.type || 'simple',
        capacity: room.capacity || 1,
        price: room.price || 0,
        floor: room.floor || 1,
        status: room.status || 'disponible',
        amenities: room.amenities || [],
        description: room.description || ''
      });
    } else {
      setFormData({
        number: '',
        type: 'simple',
        capacity: 1,
        price: 0,
        floor: 1,
        status: 'disponible',
        amenities: [],
        description: ''
      });
    }
  }, [room, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      capacity: parseInt(formData.capacity),
      price: parseFloat(formData.price),
      floor: parseInt(formData.floor)
    };

    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleAmenity = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {room ? 'Editar Habitación' : 'Nueva Habitación'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Número */}
            <InputField
              label="Número de Habitación"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="101"
              required
            />

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Habitación
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="simple">Simple</option>
                <option value="doble">Doble</option>
                <option value="suite">Suite</option>
                <option value="familiar">Familiar</option>
              </select>
            </div>

            {/* Capacidad */}
            <InputField
              label="Capacidad (personas)"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="1"
              max="10"
              required
            />

            {/* Precio */}
            <InputField
              label="Precio por noche ($)"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />

            {/* Piso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Piso
              </label>
              <select
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map(floor => (
                  <option key={floor} value={floor}>Piso {floor}</option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="limpieza">Limpieza</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>

          {/* Amenidades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Amenidades y Servicios
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {ROOM_AMENITIES.map(amenity => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    formData.amenities.includes(amenity.id)
                      ? 'bg-blue-500 text-white border-2 border-blue-600'
                      : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span>{amenity.icon}</span>
                  <span className="text-xs">{amenity.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formData.amenities.length} amenidad{formData.amenities.length !== 1 ? 'es' : ''} seleccionada{formData.amenities.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Descripción de la habitación..."
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
            <Button type="submit" className="flex-1">
              {room ? 'Actualizar' : 'Crear'} Habitación
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
