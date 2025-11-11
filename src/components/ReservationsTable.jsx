import React from 'react'
import ReservationRow from './ReservationRow'

const ReservationsTable = ({ reservations, onStatusChange, onDelete, onAddServices, onExtendStay, canExtend, userRole }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Reservas Actuales ({reservations.length})</h3>
    {reservations.length === 0 ? (
      <div className="text-center py-8 text-gray-500">
        <p>No hay reservas registradas</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Huésped</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Habitación</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Check-in</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Check-out</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Precio</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map(reservation => (
              <ReservationRow
                key={reservation._id}
                reservation={reservation}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onAddServices={onAddServices}
                onExtendStay={onExtendStay}
                canExtend={canExtend}
                canDelete={userRole === 'hotel_admin' || userRole === 'admin' || userRole === 'admin_global'}
              />
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default ReservationsTable
