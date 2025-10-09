export const USERS_DB = {
  admin: { 
    username: 'admin', 
    password: 'admin123', 
    role: 'admin', 
    name: 'Administrador' 
  },
  empleado: { 
    username: 'empleado', 
    password: 'emp123', 
    role: 'empleado', 
    name: 'Empleado Hotel' 
  }
};

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const INITIAL_RESERVATIONS = [
  { 
    id: 1, 
    guestName: 'Juan Pérez', 
    room: '101', 
    checkIn: '2025-10-10', 
    checkOut: '2025-10-12', 
    status: 'confirmada',
    guests: 2
  },
  { 
    id: 2, 
    guestName: 'María García', 
    room: '205', 
    checkIn: '2025-10-11', 
    checkOut: '2025-10-15', 
    status: 'pendiente',
    guests: 1
  },
];
