import React, { useState } from 'react'
import { Star, MapPin, User } from 'lucide-react'

const CalendarDay = ({ day, reservations, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!day) {
    return <div className="min-h-20 p-2 border rounded-lg bg-gray-50 border-gray-200" />;
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`min-h-20 p-2 border rounded-lg cursor-pointer transition relative ${
        reservations.length > 0 
          ? 'border-blue-400 bg-blue-50 hover:bg-blue-100' 
          : 'bg-white hover:bg-gray-50 border-gray-200'
      }`}
    >
      <div className="font-semibold text-gray-800 text-sm">{day}</div>
      {reservations.length > 0 && (
        <>
          <div className="text-xs text-blue-600 mt-1">
            {reservations.length} reserva{reservations.length > 1 ? 's' : ''}
          </div>
          
          {/* Tooltip con información de huéspedes */}
          {showTooltip && reservations.length > 0 && (
            <div className="absolute z-50 left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl p-3 min-w-64 max-w-xs">
              <div className="space-y-2">
                {reservations.slice(0, 3).map((reservation, idx) => {
                  const guestName = reservation.guest 
                    ? `${reservation.guest.firstName} ${reservation.guest.lastName}` 
                    : reservation.guestName;
                  const roomNumber = reservation.room?.number || reservation.roomNumber;
                  const isVIP = reservation.guest?.isVIP;

                  return (
                    <div key={idx} className="text-xs border-b last:border-0 pb-2 last:pb-0">
                      <div className="font-semibold text-gray-900 flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-500" />
                        {guestName}
                        {isVIP && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <div className="text-gray-600 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        Hab. {roomNumber}
                      </div>
                      {reservation.guestPhone && (
                        <div className="text-gray-500 mt-1">
                          📞 {reservation.guestPhone}
                        </div>
                      )}
                    </div>
                  );
                })}
                {reservations.length > 3 && (
                  <div className="text-xs text-gray-500 italic">
                    +{reservations.length - 3} más...
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CalendarDay
