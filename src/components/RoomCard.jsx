import React from 'react';
import { Bed, Users, DollarSign, Edit, Trash2, MapPin, Plus } from 'lucide-react';
import { getAmenityIcon, getAmenityLabel } from '../utils/amenitiesHelper';

const RoomCard = ({ room, onEdit, onDelete, onStatusChange, onAddServices, userRole }) => {
  const statusColors = {
    disponible: 'bg-green-100 text-green-800 border-green-200',
    ocupada: 'bg-red-100 text-red-800 border-red-200',
    limpieza: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    mantenimiento: 'bg-orange-100 text-orange-800 border-orange-200'
  };

  const typeLabels = {
    simple: 'Simple',
    doble: 'Doble',
    suite: 'Suite',
    familiar: 'Familiar'
  };

  const statusLabels = {
    disponible: 'Disponible',
    ocupada: 'Ocupada',
    limpieza: 'Limpieza',
    mantenimiento: 'Mantenimiento'
  };

  // Verificar si el usuario es administrador
  const isAdmin = userRole === 'hotel_admin' || userRole === 'admin' || userRole === 'admin_global';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold">Hab. {room.number}</h3>
            <p className="text-blue-100 text-sm">{typeLabels[room.type]}</p>
          </div>
          <div className="flex items-center gap-1 text-white">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Piso {room.floor}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Status */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Estado:</span>
          {isAdmin ? (
            <select
              value={room.status}
              onChange={(e) => onStatusChange(room._id, e.target.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[room.status]}`}
            >
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="limpieza">Limpieza</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          ) : (
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[room.status]}`}>
              {statusLabels[room.status]}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-gray-700">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Capacidad:</span>
            </div>
            <span className="font-semibold">{room.capacity} personas</span>
          </div>

          <div className="flex items-center justify-between text-gray-700">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-sm">Precio:</span>
            </div>
            <span className="font-semibold text-green-600">${room.price}/noche</span>
          </div>
        </div>

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600 mb-2">Servicios:</p>
            <div className="flex flex-wrap gap-1">
              {room.amenities.slice(0, 3).map((amenity, index) => {
                const icon = getAmenityIcon(amenity);
                const label = getAmenityLabel(amenity);
                return (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                  >
                    {icon} {label}
                  </span>
                );
              })}
              {room.amenities.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  +{room.amenities.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Description */}
        {room.description && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-600 line-clamp-2">{room.description}</p>
          </div>
        )}

        {/* Actions */}
        {/* Botón de servicios para admin Y empleado */}
        {(isAdmin || userRole === 'empleado') && room.status === 'ocupada' && onAddServices && (
          <div className="flex gap-2 pt-3 border-t">
            <button
              onClick={() => onAddServices(room)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition-colors"
              title="Agregar servicios extras"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Servicios</span>
            </button>
          </div>
        )}
        
        {/* Botones de admin (editar/eliminar) */}
        {isAdmin && (
          <div className="flex gap-2 pt-3 border-t">
            <button
              onClick={() => onEdit(room)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span className="text-sm font-medium">Editar</span>
            </button>
            <button
              onClick={() => onDelete(room._id)}
              className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm font-medium">Eliminar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
