import { useState } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import Button from '../components/Button';
import { ROOM_AMENITIES, EXTRA_SERVICES } from '../constants/amenities';

export default function AmenitiesManagementPage() {
  const [amenities, setAmenities] = useState([...ROOM_AMENITIES]);
  const [extraServices, setExtraServices] = useState([...EXTRA_SERVICES]);
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTab, setActiveTab] = useState('amenities'); // 'amenities' or 'services'

  const [formData, setFormData] = useState({
    id: '',
    label: '',
    icon: '',
    price: 0,
    description: ''
  });

  const resetForm = () => {
    setFormData({
      id: '',
      label: '',
      icon: '',
      price: 0,
      description: ''
    });
    setEditingItem(null);
  };

  const handleOpenAmenityModal = (amenity = null) => {
    if (amenity) {
      setFormData({
        id: amenity.id,
        label: amenity.label,
        icon: amenity.icon,
        price: 0,
        description: ''
      });
      setEditingItem(amenity);
    } else {
      resetForm();
    }
    setShowAmenityModal(true);
  };

  const handleOpenServiceModal = (service = null) => {
    if (service) {
      setFormData({
        id: service.id,
        label: service.label,
        icon: service.icon,
        price: service.price,
        description: service.description || ''
      });
      setEditingItem(service);
    } else {
      resetForm();
    }
    setShowServiceModal(true);
  };

  const handleSaveAmenity = () => {
    if (!formData.id || !formData.label || !formData.icon) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const newAmenity = {
      id: formData.id.toLowerCase().replace(/\s+/g, '_'),
      label: formData.label,
      icon: formData.icon
    };

    if (editingItem) {
      setAmenities(amenities.map(a => 
        a.id === editingItem.id ? newAmenity : a
      ));
    } else {
      setAmenities([...amenities, newAmenity]);
    }

    setShowAmenityModal(false);
    resetForm();
  };

  const handleSaveService = () => {
    if (!formData.id || !formData.label || !formData.icon || !formData.price) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const newService = {
      id: formData.id.toLowerCase().replace(/\s+/g, '_'),
      label: formData.label,
      icon: formData.icon,
      price: parseFloat(formData.price),
      description: formData.description
    };

    if (editingItem) {
      setExtraServices(extraServices.map(s => 
        s.id === editingItem.id ? newService : s
      ));
    } else {
      setExtraServices([...extraServices, newService]);
    }

    setShowServiceModal(false);
    resetForm();
  };

  const handleDeleteAmenity = (id) => {
    if (confirm('¿Estás seguro de eliminar esta amenidad?')) {
      setAmenities(amenities.filter(a => a.id !== id));
    }
  };

  const handleDeleteService = (id) => {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      setExtraServices(extraServices.filter(s => s.id !== id));
    }
  };

  const exportToFile = () => {
    const content = `// Amenidades de habitaciones
export const ROOM_AMENITIES = ${JSON.stringify(amenities, null, 2)};

// Servicios extras con costo
export const EXTRA_SERVICES = ${JSON.stringify(extraServices, null, 2)};
`;

    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amenities.js';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Amenidades y Servicios</h1>
          <p className="text-gray-600 mt-2">Administra las amenidades disponibles y servicios adicionales</p>
        </div>
        <Button onClick={exportToFile} variant="secondary">
          💾 Exportar Cambios
        </Button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('amenities')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'amenities'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            🏨 Amenidades de Habitaciones ({amenities.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 px-6 py-4 font-medium transition-colors ${
              activeTab === 'services'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            💰 Servicios Extra ({extraServices.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'amenities' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Amenidades incluidas en las habitaciones</p>
                <Button onClick={() => handleOpenAmenityModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Amenidad
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {amenities.map(amenity => (
                  <div key={amenity.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{amenity.icon}</span>
                        <div>
                          <h3 className="font-medium text-gray-900">{amenity.label}</h3>
                          <p className="text-xs text-gray-500 font-mono">{amenity.id}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenAmenityModal(amenity)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAmenity(amenity.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Servicios adicionales con costo</p>
                <Button onClick={() => handleOpenServiceModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Servicio
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {extraServices.map(service => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-3xl">{service.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{service.label}</h3>
                          <p className="text-xs text-gray-500 font-mono mb-1">{service.id}</p>
                          {service.description && (
                            <p className="text-sm text-gray-600">{service.description}</p>
                          )}
                          <p className="text-lg font-bold text-green-600 mt-2">
                            ${service.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenServiceModal(service)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para Amenidades */}
      {showAmenityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">
                {editingItem ? 'Editar Amenidad' : 'Nueva Amenidad'}
              </h3>
              <button onClick={() => setShowAmenityModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID (sin espacios) *
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="wifi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={editingItem !== null}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="WiFi Gratis"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icono (Emoji) *
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="📶"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usa emojis de Windows (Win + .) o copia de: <a href="https://emojipedia.org" target="_blank" className="text-blue-600">emojipedia.org</a>
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <Button onClick={() => setShowAmenityModal(false)} variant="secondary" className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSaveAmenity} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Servicios */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold">
                {editingItem ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <button onClick={() => setShowServiceModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID (sin espacios) *
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="late_checkout"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={editingItem !== null}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Late Check-out"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icono (Emoji) *
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🕐"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio ($) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="30000"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Salida hasta las 14:00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t">
              <Button onClick={() => setShowServiceModal(false)} variant="secondary" className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSaveService} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
