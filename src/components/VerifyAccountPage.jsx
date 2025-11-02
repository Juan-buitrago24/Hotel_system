import React, { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import Button from './Button'
import { authAPI } from '../services/api'

const VerifyAccountPage = ({ token, onSuccess, onBackToLogin }) => {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        setError('Token de verificación no encontrado');
        setLoading(false);
        return;
      }

      try {
        await authAPI.verifyAccount(token);
        setSuccess(true);
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          onSuccess();
        }, 3000);
      } catch (error) {
        console.error('Error:', error);
        const message = error.response?.data?.message || 'Error al verificar la cuenta';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    verifyAccount();
  }, [token, onSuccess]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Verificando tu cuenta...
          </h1>
          <p className="text-gray-600">
            Por favor espera un momento
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Cuenta Verificada!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu cuenta ha sido verificada exitosamente. Ya puedes usar todas las funciones del sistema.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Redirigiendo al login...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <XCircle className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Error de Verificación
        </h1>
        <p className="text-gray-600 mb-6">
          {error}
        </p>
        <p className="text-sm text-gray-500 mb-6">
          El token puede haber expirado (válido por 24 horas) o ser inválido.
        </p>
        <Button onClick={onBackToLogin} fullWidth>
          Volver al Login
        </Button>
      </div>
    </div>
  );
};

export default VerifyAccountPage
