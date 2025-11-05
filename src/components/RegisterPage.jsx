import React, { useState } from 'react'
import { Hotel, User, Lock, Mail, UserPlus, Loader, ArrowLeft, AlertCircle } from 'lucide-react'
import InputField from './InputField'
import Button from './Button'
import { authAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

const RegisterPage = ({ onRegister, onBackToLogin }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.register({
        username: formData.username,
        password: formData.password,
        name: formData.name,
        email: formData.email || undefined
      });

      const { token, user, message } = response.data;
      
      // Mostrar información de verificación
      toast.success('Cuenta creada exitosamente. Esperando verificación del administrador.');
      setShowVerificationInfo(true);
    } catch (error) {
      console.error('Error en registro:', error);
      const message = error.response?.data?.message || 'Error al crear la cuenta';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  // Si se muestra información de verificación
  if (showVerificationInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">¡Cuenta Creada!</h1>
            <p className="text-gray-600">Tu cuenta ha sido creada exitosamente</p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-yellow-800 mb-1">
                  ⚠️ Verificación Pendiente
                </h3>
                <p className="text-sm text-yellow-700">
                  Tu cuenta necesita ser verificada antes de poder iniciar sesión.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">
              📧 Cómo verificar tu cuenta:
            </h3>
            <ol className="text-sm text-blue-700 space-y-2 ml-4 list-decimal">
              <li>
                <strong>Revisa la consola del backend</strong> (terminal del servidor)
              </li>
              <li>
                Busca el mensaje: <code className="bg-blue-100 px-1 rounded text-xs">Token de verificación para {formData.email}</code>
              </li>
              <li>
                Copia el token que aparece después del correo
              </li>
              <li>
                Visita esta página para verificar:
                <div className="mt-2 bg-white p-2 rounded border border-blue-200">
                  <a 
                    href="/verify-account.html" 
                    target="_blank"
                    className="text-blue-600 hover:text-blue-800 underline text-xs break-all"
                  >
                    {window.location.origin}/verify-account.html
                  </a>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-purple-800">
              <strong>💡 Tip:</strong> También puedes verificar tu cuenta directamente visitando:
            </p>
            <p className="text-xs text-purple-700 mt-2 font-mono bg-purple-100 p-2 rounded break-all">
              {window.location.origin}/verify/[TU_TOKEN_AQUÍ]
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => window.open('/verify-account.html', '_blank')}
              fullWidth
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Mail className="w-5 h-5 mr-2" />
              Abrir Página de Verificación
            </Button>
            
            <Button 
              onClick={onBackToLogin}
              fullWidth
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Login
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Una vez verificada tu cuenta, podrás iniciar sesión normalmente
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al login</span>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Crear Cuenta</h1>
          <p className="text-gray-600 mt-2">Únete al sistema de gestión hotelera</p>
        </div>

        <div className="space-y-4">
          <InputField
            label="Nombre Completo"
            icon={User}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ej: Juan Pérez"
            error={errors.name}
          />

          <InputField
            label="Usuario"
            icon={User}
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="Ej: juanperez"
            error={errors.username}
          />

          <InputField
            label="Email (Opcional)"
            type="email"
            icon={Mail}
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="tu@email.com"
            error={errors.email}
          />

          <InputField
            label="Contraseña"
            type="password"
            icon={Lock}
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder="Mínimo 6 caracteres"
            error={errors.password}
          />

          <InputField
            label="Confirmar Contraseña"
            type="password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="Repite la contraseña"
            error={errors.confirmPassword}
          />

          <Button 
            onClick={handleSubmit} 
            fullWidth 
            className="py-3 shadow-lg mt-6"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Creando cuenta...</span>
              </div>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Crear Cuenta
              </>
            )}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Nota:</strong> Si proporcionas un email, recibirás un código de verificación.
          </p>
          <p className="text-xs text-blue-700 mt-2">
            🔧 <strong>En desarrollo:</strong> Revisa la consola del backend para obtener el token de verificación 
            y visita: <code className="bg-blue-100 px-1 rounded">/verify/[TOKEN]</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage
