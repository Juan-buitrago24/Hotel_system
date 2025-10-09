import React, { useState } from 'react'
import { Hotel, User, Lock } from 'lucide-react'
import InputField from './InputField'
import Button from './Button'
import { USERS_DB } from '../constants/data'

const LoginPage = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleSubmit = () => {
    const user = Object.values(USERS_DB).find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      onLogin(user);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Hotel className="w-8 h-8 text-blue-600" />
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

          <Button onClick={handleSubmit} fullWidth className="py-3 shadow-lg">
            Iniciar Sesión
          </Button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 font-semibold mb-2">Usuarios de prueba:</p>
          <p className="text-xs text-gray-600">👤 Admin: admin / admin123</p>
          <p className="text-xs text-gray-600">👤 Empleado: empleado / emp123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage
