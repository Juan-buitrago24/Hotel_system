import React from 'react'
import ReservationRow from './ReservationRow'

const ReservationsTable = ({ reservations, onStatusChange, onDelete, onAddServices, onExtendStay, canExtend, userRole }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Reservas Actuales ({reservations.length})</h3>
    {reservations.length === 0 ? (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No hay reservas registradas</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Huésped</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Habitación</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Check-in</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Check-out</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Estado</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Precio</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
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
