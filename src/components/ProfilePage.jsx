import React, { useState, useEffect } from 'react'
import { User, Mail, Lock, Save, Loader, CheckCircle, AlertCircle } from 'lucide-react'
import InputField from './InputField'
import Button from './Button'
import { authAPI } from '../services/api'

const ProfilePage = ({ user, onUpdateUser, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleSubmit = async () => {
    setMessage({ type: '', text: '' });

    // Validaciones
    if (!formData.name) {
      setMessage({ type: 'error', text: 'El nombre es requerido' });
      return;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage({ type: 'error', text: 'Email inválido' });
      return;
    }

    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres' });
        return;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
        return;
      }

      if (!formData.currentPassword) {
        setMessage({ type: 'error', text: 'Debes ingresar tu contraseña actual para cambiarla' });
        return;
      }
    }

    try {
      setLoading(true);
      const updateData = {
        name: formData.name,
        email: formData.email || undefined
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await authAPI.updateProfile(updateData);
      
      setMessage({ type: 'success', text: response.data.message || 'Perfil actualizado exitosamente' });
      
      // Actualizar usuario en el contexto
      onUpdateUser(response.data.user);

      // Limpiar campos de contraseña
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error.response?.data?.message || 'Error al actualizar el perfil';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Estado de verificación */}
        {user && !user.verified && (
          <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                  ⚠️ Cuenta Sin Verificar
                </h3>
                <p className="text-sm text-yellow-700 mb-2">
                  Tu cuenta aún no ha sido verificada. Verifica tu cuenta para acceder a todas las funcionalidades.
                </p>
                <Button
                  onClick={() => window.open('/verify-account.html', '_blank')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white text-sm py-2 px-4"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Verificar Ahora
                </Button>
              </div>
            </div>
          </div>
        )}

        {user && user.verified && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-sm text-green-700 font-medium">✅ Cuenta Verificada</span>
          </div>
        )}

        {message.text && (
          <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            )}
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Información de cuenta */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Información de Cuenta</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Usuario:</strong> {user.username}</p>
              <p><strong>Rol:</strong> {
                user.role === 'admin_global' ? 'Administrador Global' :
                user.role === 'hotel_admin' || user.role === 'admin' ? 'Administrador del Hotel' :
                user.role === 'empleado' ? 'Empleado' :
                user.role === 'cliente' ? 'Cliente' :
                user.role
              }</p>
              {user.verified !== undefined && (
                <p>
                  <strong>Estado:</strong>{' '}
                  <span className={user.verified ? 'text-green-600' : 'text-yellow-600'}>
                    {user.verified ? 'Verificado ✓' : 'Pendiente de verificación'}
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Datos personales */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Datos Personales</h3>
            <div className="space-y-4">
              <InputField
                label="Nombre Completo"
                icon={User}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Tu nombre completo"
              />

              <InputField
                label="Email"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="tu@email.com"
              />
            </div>
          </div>

          {/* Cambiar contraseña */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Cambiar Contraseña</h3>
            <div className="space-y-4">
              <InputField
                label="Contraseña Actual"
                type="password"
                icon={Lock}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="Tu contraseña actual"
              />

              <InputField
                label="Nueva Contraseña"
                type="password"
                icon={Lock}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Mínimo 6 caracteres"
              />

              <InputField
                label="Confirmar Nueva Contraseña"
                type="password"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Repite la nueva contraseña"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Guardando...</span>
                </div>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
            <Button 
              onClick={onClose}
              variant="secondary"
              className="px-6"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage
