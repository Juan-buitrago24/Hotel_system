import React from 'react';
import { Building2, MapPin, Phone, Mail } from 'lucide-react';

const HotelBanner = ({ hotel, user }) => {
  if (!hotel) return null;

  // Si es admin_global, no mostrar banner (no tiene hotel asignado)
  if (user?.role === 'admin_global') return null;

  const getRoleBadge = () => {
    const roleConfig = {
      'hotel_admin': { label: 'Administrador', color: 'bg-blue-100 text-blue-800' },
      'admin': { label: 'Administrador', color: 'bg-blue-100 text-blue-800' },
      'empleado': { label: 'Empleado', color: 'bg-green-100 text-green-800' },
      'cliente': { label: 'Cliente', color: 'bg-gray-100 text-gray-800' }
    };

    const config = roleConfig[user?.role] || { label: 'Usuario', color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Información del Hotel */}
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">{hotel.name}</h2>
                {getRoleBadge()}
              </div>
              <div className="flex items-center gap-4 text-sm text-blue-100">
                {hotel.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.address}</span>
                  </div>
                )}
                {hotel.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{hotel.phone}</span>
                  </div>
                )}
                {hotel.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{hotel.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Usuario actual */}
          <div className="text-right">
            <p className="text-sm text-blue-100">Sesión iniciada como</p>
            <p className="font-semibold text-lg">{user?.name || user?.username}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBanner;
