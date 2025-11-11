import { ROOM_AMENITIES } from '../constants/amenities';

/**
 * Convierte amenidades de texto legacy a IDs del sistema
 * Por ejemplo: "WiFi" -> "wifi", "TV" -> "tv"
 */
export const convertLegacyAmenitiesToIds = (amenities) => {
  if (!amenities || !Array.isArray(amenities)) return [];
  
  return amenities.map(amenity => {
    // Si ya es un ID válido, devolverlo
    if (ROOM_AMENITIES.some(a => a.id === amenity)) {
      return amenity;
    }
    
    // Intentar encontrar por label (case-insensitive)
    const found = ROOM_AMENITIES.find(a => 
      a.label.toLowerCase() === amenity.toLowerCase() ||
      amenity.toLowerCase().includes(a.label.toLowerCase().split(' ')[0])
    );
    
    return found ? found.id : amenity;
  });
};

/**
 * Convierte IDs de amenidades a labels para mostrar
 */
export const getAmenityLabel = (amenityId) => {
  const amenity = ROOM_AMENITIES.find(a => a.id === amenityId);
  return amenity ? amenity.label : amenityId;
};

/**
 * Obtiene el icono de una amenidad
 */
export const getAmenityIcon = (amenityId) => {
  const amenity = ROOM_AMENITIES.find(a => a.id === amenityId);
  return amenity ? amenity.icon : '📌';
};
