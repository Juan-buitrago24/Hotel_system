import React from 'react'
import { getStatusColor } from '../utils/helpers'

const ReservationRow = ({ reservation, onStatusChange, onDelete, canDelete }) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="py-3 px-4">{reservation.guestName}</td>
    <td className="py-3 px-4">{reservation.room}</td>
    <td className="py-3 px-4">{reservation.checkIn}</td>
    <td className="py-3 px-4">{reservation.checkOut}</td>
    <td className="py-3 px-4">
      <select
        value={reservation.status}
        onChange={(e) => onStatusChange(reservation.id, e.target.value)}
        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(reservation.status)}`}
      >
        <option value="pendiente">Pendiente</option>
        <option value="confirmada">Confirmada</option>
        <option value="cancelada">Cancelada</option>
      </select>
    </td>
    <td className="py-3 px-4">
      <button
        onClick={() => onDelete(reservation.id)}
        className="text-red-600 hover:text-red-800 font-semibold text-sm"
        disabled={!canDelete}
      >
        Eliminar
      </button>
    </td>
  </tr>
);

export default ReservationRow
