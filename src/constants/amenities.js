// Lista de amenidades/servicios disponibles para habitaciones
export const ROOM_AMENITIES = [
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'tv', label: 'TV', icon: '📺' },
  { id: 'aire_acondicionado', label: 'Aire Acondicionado', icon: '❄️' },
  { id: 'minibar', label: 'Minibar', icon: '🍷' },
  { id: 'caja_fuerte', label: 'Caja Fuerte', icon: '🔒' },
  { id: 'escritorio', label: 'Escritorio', icon: '🖊️' },
  { id: 'balcon', label: 'Balcón', icon: '🪟' },
  { id: 'vista_mar', label: 'Vista al Mar', icon: '🌊' },
  { id: 'vista_ciudad', label: 'Vista a la Ciudad', icon: '🏙️' },
  { id: 'bañera', label: 'Bañera', icon: '🛁' },
  { id: 'ducha', label: 'Ducha', icon: '🚿' },
  { id: 'secador_pelo', label: 'Secador de Pelo', icon: '💨' },
  { id: 'plancha', label: 'Plancha', icon: '👔' },
  { id: 'telefono', label: 'Teléfono', icon: '☎️' },
  { id: 'servicio_habitacion', label: 'Servicio a la Habitación', icon: '🛎️' },
  { id: 'desayuno_incluido', label: 'Desayuno Incluido', icon: '🍳' },
  { id: 'cafetera', label: 'Cafetera', icon: '☕' },
  { id: 'microondas', label: 'Microondas', icon: '🔥' },
  { id: 'refrigerador', label: 'Refrigerador', icon: '🧊' },
  { id: 'jacuzzi', label: 'Jacuzzi', icon: '♨️' },
  { id: 'acceso_discapacitados', label: 'Acceso para Discapacitados', icon: '♿' },
  { id: 'no_fumar', label: 'Habitación para No Fumadores', icon: '🚭' },
  { id: 'mascotas', label: 'Se Permiten Mascotas', icon: '🐕' },
];

// Servicios extras que se pueden agregar con cargo adicional
export const EXTRA_SERVICES = [
  { id: 'cama_extra', label: 'Cama Extra', icon: '🛏️', price: 20000, description: 'Cama adicional en la habitación' },
  { id: 'cuna', label: 'Cuna para Bebé', icon: '👶', price: 15000, description: 'Cuna cómoda para bebés' },
  { id: 'desayuno_extra', label: 'Desayuno Adicional', icon: '🍳', price: 25000, description: 'Desayuno buffet por persona' },
  { id: 'late_checkout', label: 'Late Check-out', icon: '🕐', price: 30000, description: 'Salida hasta las 14:00' },
  { id: 'early_checkin', label: 'Early Check-in', icon: '🕙', price: 25000, description: 'Entrada desde las 10:00' },
  { id: 'parking', label: 'Estacionamiento Privado', icon: '🅿️', price: 10000, description: 'Espacio reservado por día' },
  { id: 'traslado_aeropuerto', label: 'Traslado Aeropuerto', icon: '✈️', price: 50000, description: 'Transporte ida o vuelta' },
  { id: 'spa', label: 'Acceso al Spa', icon: '💆', price: 80000, description: 'Día completo en el spa' },
  { id: 'gimnasio', label: 'Acceso al Gimnasio', icon: '🏋️', price: 20000, description: 'Pase diario al gimnasio' },
];

// Tipos de habitaciones con descripciones
export const ROOM_TYPES = {
  simple: {
    label: 'Simple',
    description: 'Habitación básica para 1 persona',
    icon: '🛏️',
    capacityRange: [1, 1]
  },
  doble: {
    label: 'Doble',
    description: 'Habitación confortable para 2 personas',
    icon: '🛏️🛏️',
    capacityRange: [1, 2]
  },
  suite: {
    label: 'Suite',
    description: 'Habitación amplia con sala de estar',
    icon: '🏰',
    capacityRange: [2, 4]
  },
  familiar: {
    label: 'Familiar',
    description: 'Habitación espaciosa para familias',
    icon: '👨‍👩‍👧‍👦',
    capacityRange: [3, 6]
  }
};

// Estados de habitación
export const ROOM_STATUS = {
  disponible: { label: 'Disponible', color: 'green' },
  ocupada: { label: 'Ocupada', color: 'red' },
  mantenimiento: { label: 'Mantenimiento', color: 'yellow' },
  limpieza: { label: 'Limpieza', color: 'blue' }
};
