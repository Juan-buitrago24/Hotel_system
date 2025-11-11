import React from 'react'
import { getStatusColor } from '../utils/helpers'
import { Trash2, Star, Plus, Calendar } from 'lucide-react'

const ReservationRow = ({ reservation, onStatusChange, onDelete, onAddServices, onExtendStay, canExtend, canDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const roomNumber = reservation.room?.number || reservation.roomNumber || 'N/A';
  
  // Información del huésped desde el modelo Guest o del campo directo
  const guestName = reservation.guest 
    ? `${reservation.guest.firstName} ${reservation.guest.lastName}` 
    : reservation.guestName;
  const guestDocument = reservation.guest?.documentNumber;
  const isVIP = reservation.guest?.isVIP;

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">
        <div>
          <div className="font-medium text-gray-900 flex items-center gap-2">
            {guestName}
            {isVIP && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
          </div>
          {guestDocument && (
            <div className="text-xs text-gray-500">Doc: {guestDocument}</div>
          )}
          {reservation.guestEmail && (
            <div className="text-xs text-gray-500">{reservation.guestEmail}</div>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
          {roomNumber}
        </span>
      </td>
      <td className="py-3 px-4 text-sm">{formatDate(reservation.checkIn)}</td>
      <td className="py-3 px-4 text-sm">{formatDate(reservation.checkOut)}</td>
      <td className="py-3 px-4">
        <select
          value={reservation.status}
          onChange={(e) => onStatusChange(reservation._id, e.target.value)}
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(reservation.status)}`}
        >
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="en_curso">En Curso</option>
          <option value="completada">Completada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </td>
      <td className="py-3 px-4 font-semibold text-green-600">
        <div>
          <div>${reservation.totalPrice?.toFixed(2)}</div>
          {reservation.extraServices && reservation.extraServices.length > 0 && (
            <div className="text-xs text-blue-600">
              +{reservation.extraServices.length} servicio{reservation.extraServices.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <button
            onClick={() => onAddServices(reservation)}
            className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded hover:bg-blue-50"
            title="Agregar servicios extras"
          >
            <Plus className="w-4 h-4" />
          </button>
          {canExtend && canExtend(reservation) && (
            <button
              onClick={() => onExtendStay(reservation)}
              className="text-purple-600 hover:text-purple-800 transition-colors p-2 rounded hover:bg-purple-50"
              title="Extender estadía"
            >
              <Calendar className="w-4 h-4" />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(reservation._id)}
              className="text-red-600 hover:text-red-800 transition-colors p-2 rounded hover:bg-red-50"
              title="Eliminar reserva"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ReservationRow
