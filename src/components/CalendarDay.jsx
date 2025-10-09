import React from 'react'

const CalendarDay = ({ day, reservations, onClick }) => {
  if (!day) {
    return <div className="min-h-20 p-2 border rounded-lg bg-gray-50 border-gray-200" />;
  }

  return (
    <div
      onClick={onClick}
      className={`min-h-20 p-2 border rounded-lg cursor-pointer transition ${
        reservations.length > 0 
          ? 'border-blue-400 bg-blue-50 hover:bg-blue-100' 
          : 'bg-white hover:bg-gray-50 border-gray-200'
      }`}
    >
      <div className="font-semibold text-gray-800 text-sm">{day}</div>
      {reservations.length > 0 && (
        <div className="text-xs text-blue-600 mt-1">
          {reservations.length} reserva{reservations.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default CalendarDay
