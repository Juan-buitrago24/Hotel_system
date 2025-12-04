import React, { useState, useEffect } from 'react';
import { X, Settings, Image, Crown } from 'lucide-react';
import Button from './Button';
import InputField from './InputField';
import ImageUploader from './ImageUploader';
import { ROOM_AMENITIES } from '../constants/amenities';
import { useAuth } from '../context/AuthContext';
import { hasPlanFeature, PLAN_FEATURES } from '../utils/helpers';

const RoomModal = ({ isOpen, onClose, onSubmit, room, hotel }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
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

  // Verificar si el plan tiene acceso a Cloudinary
  const hotelPlan = hotel?.plan || user?.hotel?.plan || 'free';
  const hasCloudinaryAccess = hasPlanFeature(hotelPlan, 'cloudinary');
  
  // Debug
  console.log('🔍 RoomModal - Debug Cloudinary:', {
    hotelPlan,
    hotelFromProp: hotel,
    hasCloudinaryAccess,
    planFeatures: hotelPlan ? PLAN_FEATURES[hotelPlan] : null
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
      // Cambiar a pestaña de imágenes si ya existe la habitación
      setActiveTab(room._id ? 'details' : 'details');
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
      setActiveTab('details');
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
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {room ? `Habitación ${room.number}` : 'Nueva Habitación'}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Pestañas - Solo mostrar si la habitación ya existe */}
          {room && room._id && (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'details'
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                <Settings className="w-4 h-4" />
                Detalles
              </button>
              <button
                onClick={() => setActiveTab('images')}
                disabled={!hasCloudinaryAccess}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === 'images'
                    ? 'bg-white text-blue-600 font-semibold'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                } ${!hasCloudinaryAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Image className="w-4 h-4" />
                Imágenes {room.images?.length > 0 && `(${room.images.length})`}
                {!hasCloudinaryAccess && <Crown className="w-3 h-3 text-yellow-400 ml-1" />}
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Pestaña de Detalles */}
          {activeTab === 'details' && (
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Habitación
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Piso
              </label>
              <select
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map(floor => (
                  <option key={floor} value={floor}>Piso {floor}</option>
                ))}
              </select>
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Amenidades y Servicios
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700/50">
              {ROOM_AMENITIES.map(amenity => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    formData.amenities.includes(amenity.id)
                      ? 'bg-blue-500 text-white border-2 border-blue-600'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>{amenity.icon}</span>
                  <span className="text-xs">{amenity.label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {formData.amenities.length} amenidad{formData.amenities.length !== 1 ? 'es' : ''} seleccionada{formData.amenities.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Descripción de la habitación..."
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
            <Button type="submit" className="flex-1">
              {room ? 'Actualizar' : 'Crear'} Habitación
            </Button>
          </div>
        </form>
          )}

          {/* Pestaña de Imágenes */}
          {activeTab === 'images' && room && room._id && (
            <>
              {/* Debug Info */}
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm">
                <p className="font-semibold text-yellow-800 mb-1">🔍 Debug Info:</p>
                <p className="text-yellow-700">Plan del hotel: <strong>{hotelPlan || 'No detectado'}</strong></p>
                <p className="text-yellow-700">Tiene Cloudinary: <strong>{hasCloudinaryAccess ? 'Sí ✅' : 'No ❌'}</strong></p>
                <p className="text-yellow-700">Hotel prop: <strong>{hotel ? hotel.name : 'No pasado'}</strong></p>
              </div>

              {hasCloudinaryAccess ? (
                <ImageUploader
                  roomId={room._id}
                  images={room.images || []}
                  onImagesUpdated={() => {
                    // Recargar la habitación para obtener las imágenes actualizadas
                    if (onSubmit) {
                      // Esto forzará un refresh en el componente padre
                      onClose();
                    }
                  }}
                />
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-4">
                    <Crown className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Galería de Fotos Profesional
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Muestra tu hotel con fotos de alta calidad. Disponible desde el <span className="font-semibold text-blue-600">Plan Básico</span>.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Con el Plan Básico obtienes:</strong>
                    </p>
                    <ul className="text-left text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                      <li>✅ Hasta 10 habitaciones</li>
                      <li>✅ Galería de fotos ilimitada</li>
                      <li>✅ Almacenamiento profesional</li>
                      <li>✅ Optimización automática</li>
                      <li>✅ Gestión completa de reservas</li>
                      <li>✅ Panel administrativo</li>
                    </ul>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    onClick={() => window.open('mailto:support@hotelsystem.com?subject=Actualizar Plan', '_blank')}
                  >
                    Actualizar a Plan Básico - $29/mes
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomModal;

