import React, { useState } from 'react'
import { Hotel, User, Lock, Loader } from 'lucide-react'
import InputField from './InputField'
import Button from './Button'
import { authAPI } from '../services/api'
import { useToast } from '../context/ToastContext'

const LoginPage = ({ onLogin, onShowRegister, onShowForgotPassword }) => {
  const toast = useToast();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!credentials.username || !credentials.password) {
      toast.warning('Por favor ingresa usuario y contraseña');
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      toast.success('Inicio de sesión exitoso');
      onLogin(user, token);
    } catch (error) {
      console.error('Error de login:', error);
      const message = error.response?.data?.message || 'Usuario o contraseña incorrectos';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src="/Logo Hotel Manager.jpg" 
              alt="Hotel Manager Logo" 
              className="h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Hotel Manager</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestión Hotelera</p>
        </div>

        <div className="space-y-6">
          <InputField
            label="Usuario"
            icon={User}
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            onKeyPress={handleKeyPress}
            placeholder="Ingresa tu usuario"
          />

          <InputField
            label="Contraseña"
            type="password"
            icon={Lock}
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            onKeyPress={handleKeyPress}
            placeholder="Ingresa tu contraseña"
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
                <span>Iniciando sesión...</span>
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </Button>

          {/* Enlaces adicionales */}
          <div className="flex flex-col gap-2 text-center text-sm">
            <button
              onClick={onShowForgotPassword}
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
            <div className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <button
                onClick={onShowRegister}
                className="text-blue-600 hover:text-blue-700 hover:underline font-semibold"
              >
                Regístrate aquí
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-semibold mb-2">💡 Nota:</p>
          <p className="text-xs text-gray-600">Asegúrate de que el backend esté corriendo en el puerto 5000</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage
