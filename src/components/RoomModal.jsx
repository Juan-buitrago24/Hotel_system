import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import InputField from './InputField';

const RoomModal = ({ isOpen, onClose, onSubmit, room }) => {
  const [formData, setFormData] = useState({
    number: '',
    type: 'simple',
    capacity: 1,
    price: 0,
    floor: 1,
    status: 'disponible',
    amenities: '',
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
        amenities: room.amenities ? room.amenities.join(', ') : '',
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
        amenities: '',
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
      floor: parseInt(formData.floor),
      amenities: formData.amenities
        .split(',')
        .map(a => a.trim())
        .filter(a => a.length > 0)
    };

    onSubmit(submitData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

          {/* Servicios */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servicios (separados por coma)
            </label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="WiFi, TV, Aire acondicionado, Minibar"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
