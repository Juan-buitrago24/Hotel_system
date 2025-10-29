export const generateCalendarDays = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  return days;
};

export const formatDateString = (year, month, day) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export const getStatusColor = (status) => {
  const colors = {
    pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmada: 'bg-blue-100 text-blue-800 border-blue-300',
    en_curso: 'bg-green-100 text-green-800 border-green-300',
    completada: 'bg-gray-100 text-gray-800 border-gray-300',
    cancelada: 'bg-red-100 text-red-800 border-red-300'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
};

