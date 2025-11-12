import React, { useState } from 'react';
import { X, Hotel, User, Mail, Phone, MapPin, Lock, Building } from 'lucide-react';
import Button from './Button';
import InputField from './InputField';
import { useToast } from '../context/ToastContext';

const RegisterHotelModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    // Datos del hotel
    hotelName: '',
    address: '',
    city: '',
    country: 'Colombia',
    phone: '',
    email: '',
    plan: 'free',
    
    // Datos del administrador
    adminName: '',
    adminUsername: '',
    adminEmail: '',
    adminPassword: '',
    adminPhone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.hotelName || !formData.adminName || !formData.adminUsername || 
        !formData.adminEmail || !formData.adminPassword) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/hotels/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el hotel');
      }

      toast.success(`Hotel "${data.hotel.name}" registrado exitosamente. Credenciales enviadas al administrador.`);
      toast.info(`Username: ${data.admin.username}, Email: ${data.admin.email}`, 8000);
      
      // Resetear formulario
      setFormData({
        hotelName: '',
        address: '',
        city: '',
        country: 'Colombia',
        phone: '',
        email: '',
        plan: 'free',
        adminName: '',
        adminUsername: '',
        adminEmail: '',
        adminPassword: '',
        adminPhone: ''
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex justify-between items-center sticky top-0">
          <div className="flex items-center gap-3">
            <Hotel className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">Registrar Nuevo Hotel</h2>
              <p className="text-blue-100 text-sm">Complete la información del hotel y su administrador</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Información del Hotel */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Información del Hotel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Nombre del Hotel *"
                icon={Hotel}
                value={formData.hotelName}
                onChange={(e) => handleChange('hotelName', e.target.value)}
                placeholder="Hotel Paradise"
                required
              />

              <InputField
                label="Plan"
                icon={Building}
                value={formData.plan}
                onChange={(e) => handleChange('plan', e.target.value)}
                as="select"
              >
                <option value="free">Gratuito (10 habitaciones)</option>
                <option value="basic">Básico (50 habitaciones)</option>
                <option value="premium">Premium (Ilimitado)</option>
                <option value="enterprise">Enterprise (Personalizado)</option>
              </InputField>

              <InputField
                label="Dirección"
                icon={MapPin}
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Calle 123 #45-67"
              />

              <InputField
                label="Ciudad"
                icon={MapPin}
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Bogotá"
              />

              <InputField
                label="País"
                icon={MapPin}
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                placeholder="Colombia"
              />

              <InputField
                label="Teléfono del Hotel"
                icon={Phone}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="3001234567"
              />

              <InputField
                label="Email del Hotel"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="contacto@hotel.com"
                className="md:col-span-2"
              />
            </div>
          </div>

          {/* Información del Administrador */}
          <div className="border-t dark:border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Administrador del Hotel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Nombre Completo *"
                icon={User}
                value={formData.adminName}
                onChange={(e) => handleChange('adminName', e.target.value)}
                placeholder="Juan Pérez"
                required
              />

              <InputField
                label="Username *"
                icon={User}
                value={formData.adminUsername}
                onChange={(e) => handleChange('adminUsername', e.target.value)}
                placeholder="juanperez"
                required
              />

              <InputField
                label="Email del Administrador *"
                type="email"
                icon={Mail}
                value={formData.adminEmail}
                onChange={(e) => handleChange('adminEmail', e.target.value)}
                placeholder="juan@hotel.com"
                required
              />

              <InputField
                label="Teléfono del Administrador"
                icon={Phone}
                value={formData.adminPhone}
                onChange={(e) => handleChange('adminPhone', e.target.value)}
                placeholder="3009876543"
              />

              <InputField
                label="Contraseña *"
                type="password"
                icon={Lock}
                value={formData.adminPassword}
                onChange={(e) => handleChange('adminPassword', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="md:col-span-2"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="px-8"
            >
              {loading ? 'Registrando...' : 'Registrar Hotel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterHotelModal;
