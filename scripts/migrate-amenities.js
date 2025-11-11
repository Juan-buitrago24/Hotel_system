// Script para migrar amenidades de texto a IDs en habitaciones existentes
// Ejecutar este script desde la consola del navegador cuando estés logueado como admin

const AMENITY_MAP = {
  'wifi': ['wifi', 'wi-fi', 'internet', 'wireless'],
  'tv': ['tv', 'television', 'televisión', 'televisor'],
  'aire_acondicionado': ['aire acondicionado', 'ac', 'a/c', 'climatizacion', 'climatización'],
  'calefaccion': ['calefaccion', 'calefacción', 'heating'],
  'minibar': ['minibar', 'mini-bar', 'mini bar', 'nevera'],
  'caja_fuerte': ['caja fuerte', 'caja-fuerte', 'safe', 'seguridad'],
  'escritorio': ['escritorio', 'desk', 'mesa de trabajo'],
  'balcon': ['balcon', 'balcón', 'terraza', 'balcony'],
  'bano_privado': ['baño privado', 'bano privado', 'bathroom', 'baño'],
  'secador': ['secador', 'secador de pelo', 'hair dryer'],
  'telefono': ['telefono', 'teléfono', 'phone'],
  'servicio_habitacion': ['servicio habitacion', 'servicio de habitación', 'room service'],
  'ropa_cama': ['ropa de cama', 'sabanas', 'sábanas', 'bedding'],
  'toallas': ['toallas', 'towels'],
  'articulos_aseo': ['articulos de aseo', 'artículos de aseo', 'amenities', 'toiletries'],
  'plancha': ['plancha', 'iron'],
  'cafetera': ['cafetera', 'coffee maker', 'café'],
  'agua_gratis': ['agua gratis', 'agua gratuita', 'free water'],
  'netflix': ['netflix', 'streaming'],
  'jacuzzi': ['jacuzzi', 'tina', 'bañera', 'bathtub'],
  'vista_ciudad': ['vista ciudad', 'vista a la ciudad', 'city view'],
  'vista_mar': ['vista mar', 'vista al mar', 'ocean view', 'sea view'],
  'insonorizado': ['insonorizado', 'soundproof', 'aislamiento acústico'],
  'accesible': ['accesible', 'accessible', 'discapacitados'],
  'mascotas': ['mascotas', 'pets', 'se permiten mascotas', 'pet friendly']
};

// Función para convertir una amenidad de texto a ID
function convertAmenityToId(amenityText) {
  const normalized = amenityText.toLowerCase().trim();
  
  for (const [id, variations] of Object.entries(AMENITY_MAP)) {
    if (variations.some(v => normalized.includes(v))) {
      return id;
    }
  }
  
  // Si no encuentra coincidencia, devolver el texto original
  return amenityText;
}

// Función para migrar habitaciones
async function migrateRoomAmenities() {
  try {
    console.log('🔄 Iniciando migración de amenidades...');
    
    // Obtener todas las habitaciones
    const response = await fetch('/api/rooms', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const rooms = await response.json();
    const roomsData = Array.isArray(rooms) ? rooms : (rooms.data || []);
    
    console.log(`📊 Total de habitaciones: ${roomsData.length}`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const room of roomsData) {
      if (!room.amenities || room.amenities.length === 0) {
        skipped++;
        continue;
      }
      
      // Convertir amenidades
      const originalAmenities = [...room.amenities];
      const newAmenities = room.amenities.map(amenity => convertAmenityToId(amenity));
      
      // Solo actualizar si hay cambios
      const hasChanges = JSON.stringify(originalAmenities) !== JSON.stringify(newAmenities);
      
      if (hasChanges) {
        console.log(`📝 Actualizando habitación ${room.number}:`, {
          antes: originalAmenities,
          despues: newAmenities
        });
        
        // Actualizar habitación
        await fetch(`/api/rooms/${room._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...room,
            amenities: newAmenities
          })
        });
        
        updated++;
      } else {
        skipped++;
      }
    }
    
    console.log('✅ Migración completada:');
    console.log(`   - Habitaciones actualizadas: ${updated}`);
    console.log(`   - Habitaciones sin cambios: ${skipped}`);
    
    return { updated, skipped, total: roomsData.length };
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    throw error;
  }
}

// Ejecutar migración
console.log('⚠️  IMPORTANTE: Este script actualizará todas las habitaciones del hotel actual');
console.log('⚠️  Asegúrate de estar logueado como administrador del hotel');
console.log('⚠️  Para ejecutar la migración, escribe: migrateRoomAmenities()');
console.log('');

// Exportar para uso manual
if (typeof window !== 'undefined') {
  window.migrateRoomAmenities = migrateRoomAmenities;
  console.log('✅ Script cargado. Ejecuta migrateRoomAmenities() para iniciar.');
}
