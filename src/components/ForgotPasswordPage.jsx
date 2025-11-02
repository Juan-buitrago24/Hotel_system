import React, { useState } from 'react'
import { Mail, ArrowLeft, Loader, CheckCircle } from 'lucide-react'
import InputField from './InputField'
import Button from './Button'
import { authAPI } from '../services/api'

const ForgotPasswordPage = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert('Por favor ingresa un email válido');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.forgotPassword(email);
      setSuccess(true);
      
      // En desarrollo, mostrar el token
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
      }
    } catch (error) {
      console.error('Error:', error);
      // Siempre mostrar mensaje exitoso por seguridad
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Revisa tu email</h1>
            <p className="text-gray-600 mb-6">
              Si existe una cuenta con el email <strong>{email}</strong>, 
              recibirás instrucciones para resetear tu contraseña.
            </p>

            {resetToken && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
                <p className="text-sm font-semibold text-yellow-800 mb-2">
                  🔧 Modo Desarrollo:
                </p>
                <p className="text-xs text-yellow-700 mb-2">
                  Token de reset (copia y úsalo en la siguiente página):
                </p>
                <code className="block p-2 bg-yellow-100 rounded text-xs break-all">
                  {resetToken}
                </code>
                <p className="text-xs text-yellow-700 mt-2">
                  O usa este enlace:
                </p>
                <a 
                  href={`/reset-password/${resetToken}`}
                  className="text-xs text-blue-600 hover:underline break-all"
                >
                  /reset-password/{resetToken}
                </a>
              </div>
            )}

            <Button onClick={onBackToLogin} fullWidth>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <button
          onClick={onBackToLogin}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al login</span>
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">¿Olvidaste tu contraseña?</h1>
          <p className="text-gray-600 mt-2">
            Ingresa tu email y te enviaremos instrucciones para resetearla
          </p>
        </div>

        <div className="space-y-6">
          <InputField
            label="Email"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="tu@email.com"
          />

          <Button 
            onClick={handleSubmit} 
            fullWidth 
            className="py-3 shadow-lg"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="w-5 h-5 animate-spin" />
                <span>Enviando...</span>
              </div>
            ) : (
              'Enviar instrucciones'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage
