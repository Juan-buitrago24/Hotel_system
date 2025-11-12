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

// Características disponibles por plan
export const PLAN_FEATURES = {
  free: {
    maxRooms: 10,
    maxUsers: 3,
    cloudinary: false,
    advancedCalendar: false,
    userRoles: false,
    reports: false,
    multiHotel: false,
    apiAccess: false,
    displayName: 'Free',
    price: 0
  },
  basic: {
    maxRooms: 10,
    maxUsers: 5,
    cloudinary: true, // ✅ Básico SÍ tiene Cloudinary
    advancedCalendar: false,
    userRoles: false,
    reports: false,
    multiHotel: false,
    apiAccess: false,
    displayName: 'Básico',
    price: 29
  },
  professional: {
    maxRooms: 100,
    maxUsers: 20,
    cloudinary: true,
    advancedCalendar: true,
    userRoles: true,
    reports: false,
    multiHotel: false,
    apiAccess: false,
    displayName: 'Profesional',
    price: 79
  },
  premium: {
    maxRooms: 100,
    maxUsers: 20,
    cloudinary: true,
    advancedCalendar: true,
    userRoles: true,
    reports: false,
    multiHotel: false,
    apiAccess: false,
    displayName: 'Premium',
    price: 79
  },
  enterprise: {
    maxRooms: Infinity,
    maxUsers: Infinity,
    cloudinary: true,
    advancedCalendar: true,
    userRoles: true,
    reports: true,
    multiHotel: true,
    apiAccess: true,
    displayName: 'Enterprise',
    price: 199
  }
};

// Verificar si el plan tiene una característica específica
export const hasPlanFeature = (planName, feature) => {
  const plan = PLAN_FEATURES[planName?.toLowerCase()] || PLAN_FEATURES.free;
  return plan[feature] || false;
};

// Obtener información del plan
export const getPlanInfo = (planName) => {
  return PLAN_FEATURES[planName?.toLowerCase()] || PLAN_FEATURES.free;
};

// Verificar si el usuario ha alcanzado el límite de habitaciones
export const hasReachedRoomLimit = (planName, currentRooms) => {
  const plan = PLAN_FEATURES[planName?.toLowerCase()] || PLAN_FEATURES.free;
  return currentRooms >= plan.maxRooms;
};

// Verificar si el usuario ha alcanzado el límite de usuarios
export const hasReachedUserLimit = (planName, currentUsers) => {
  const plan = PLAN_FEATURES[planName?.toLowerCase()] || PLAN_FEATURES.free;
  return currentUsers >= plan.maxUsers;
};

