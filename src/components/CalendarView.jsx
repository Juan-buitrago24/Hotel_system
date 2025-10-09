import React from 'react'
import { MONTH_NAMES, DAY_NAMES } from '../constants/data'
import { generateCalendarDays, formatDateString } from '../utils/helpers'
import CalendarDay from './CalendarDay'

const CalendarView = ({ selectedDate, onDateChange, reservations }) => {
  const days = generateCalendarDays(selectedDate);

  const getReservationsForDay = (day) => {
    if (!day) return [];
    const dateStr = formatDateString(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    return reservations.filter(r => r.checkIn === dateStr || r.checkOut === dateStr);
  };

  const changeMonth = (offset) => {
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + offset);
    onDateChange(newDate);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-bold"
        >
          ‹
        </button>
        <h3 className="text-xl font-bold text-gray-800">
          {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </h3>
        <button
          onClick={() => changeMonth(1)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-bold"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAY_NAMES.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
            {day}
          </div>
        ))}
        {days.map((day, idx) => (
          <CalendarDay
            key={idx}
            day={day}
            reservations={getReservationsForDay(day)}
            onClick={() => day && console.log(`Día ${day} seleccionado`)}
          />
        ))}
      </div>
    </div>
  );
};

export default CalendarView
