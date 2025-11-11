import { useState, useEffect } from 'react';
import { roomsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import Button from '../components/Button';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { ROOM_AMENITIES } from '../constants/amenities';
import { getAmenityIcon, getAmenityLabel } from '../utils/amenitiesHelper';

export default function ClientRoomsPage({ hotel, onBack, onSelectRoom }) {
  console.log('ClientRoomsPage mounted, hotel:', hotel);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showAmenityFilters, setShowAmenityFilters] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadRooms();
  }, [hotel]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      console.log('Loading rooms for hotel:', hotel);
      const response = await roomsAPI.getAll();
      console.log('Rooms response:', response);
      
      // La API puede devolver { rooms: [...] } o directamente [...]
      const roomsData = Array.isArray(response) ? response : (response.rooms || response.data || []);
      console.log('Rooms data after processing:', roomsData);
      console.log('Total rooms loaded:', roomsData.length);
      console.log('Target hotel:', hotel);
      
      // Filter rooms by hotel (active es opcional - si no existe, asumimos true)
      const hotelRooms = roomsData.filter(room => {
        const roomHotelId = typeof room.hotel === 'object' ? room.hotel._id || room.hotel.id : room.hotel;
        const targetHotelId = hotel._id || hotel.id;
        const match = roomHotelId === targetHotelId;
        const isActive = room.active !== false; // Si no tiene active o es true, mostrar
        
        console.log('Room:', room.roomNumber || 'NO-NUMBER', 
                    '| roomHotel:', roomHotelId, 
                    '| target:', targetHotelId, 
                    '| match:', match, 
                    '| active:', room.active, 
                    '| will show:', match && isActive);
        
        return match && isActive;
      });
      console.log('Filtered rooms for this hotel:', hotelRooms.length, hotelRooms);
      setRooms(hotelRooms);
    } catch (error) {
      console.error('Error loading rooms:', error);
      if (toast?.error) {
        toast.error('Error al cargar las habitaciones');
      }
    } finally {
      setLoading(false);
    }
  };

  // Get unique room types (database uses 'type' not 'roomType')
  const roomTypes = [...new Set(rooms.map(room => room.type))];

  console.log('Rooms before filter:', rooms.length, rooms);
  console.log('Selected amenities for filter:', selectedAmenities);

  // Filter rooms (database uses 'number' and 'type' not 'roomNumber' and 'roomType')
  const filteredRooms = rooms.filter(room => {
    if (!room.number || !room.type) {
      console.warn('Room missing properties:', room);
      return false;
    }
    const matchesSearch = 
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedRoomType === 'all' || room.type === selectedRoomType;
    
    // Filter by amenities - room must have ALL selected amenities
    // Check both by ID and by label (for compatibility with old data)
    const matchesAmenities = selectedAmenities.length === 0 || 
      selectedAmenities.every(selectedAmenityId => {
        if (!room.amenities || room.amenities.length === 0) return false;
        
        // Get the amenity object to check both ID and label
        const amenityObj = ROOM_AMENITIES.find(a => a.id === selectedAmenityId);
        if (!amenityObj) return false;
        
        // Check if room has this amenity by ID or by label (case-insensitive)
        const hasAmenity = room.amenities.some(roomAmenity => 
          roomAmenity === selectedAmenityId || 
          roomAmenity.toLowerCase() === amenityObj.label.toLowerCase() ||
          roomAmenity.toLowerCase().includes(amenityObj.label.toLowerCase().split(' ')[0])
        );
        
        console.log(`Room ${room.number} checking ${selectedAmenityId}:`, {
          roomAmenities: room.amenities,
          amenityLabel: amenityObj.label,
          hasAmenity
        });
        
        return hasAmenity;
      });
    
    return matchesSearch && matchesType && matchesAmenities;
  });

  // Toggle amenity filter
  const toggleAmenity = (amenityId) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(a => a !== amenityId)
        : [...prev, amenityId]
    );
  };

  console.log('Rooms after UI filter:', filteredRooms.length);

  if (loading) {
    console.log('Showing loading state...');
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-8 flex-1 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <SkeletonGrid columns={2} items={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="secondary">
          ← Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
          <p className="text-gray-600">{hotel.city}, {hotel.country}</p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <input
          type="text"
          placeholder="Buscar por número o tipo de habitación..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedRoomType('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedRoomType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
          {roomTypes.map(type => (
            <button
              key={type}
              onClick={() => setSelectedRoomType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedRoomType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Amenities filter toggle */}
        <button
          onClick={() => setShowAmenityFilters(!showAmenityFilters)}
          className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
        >
          <span className="font-medium">
            🔍 Filtrar por Servicios {selectedAmenities.length > 0 && `(${selectedAmenities.length})`}
          </span>
          <span>{showAmenityFilters ? '▲' : '▼'}</span>
        </button>

        {/* Amenities filters */}
        {showAmenityFilters && (
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {ROOM_AMENITIES.map(amenity => (
                <button
                  key={amenity.id}
                  onClick={() => toggleAmenity(amenity.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    selectedAmenities.includes(amenity.id)
                      ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-1">{amenity.icon}</span>
                  {amenity.label}
                </button>
              ))}
            </div>
            {selectedAmenities.length > 0 && (
              <button
                onClick={() => setSelectedAmenities([])}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      {/* Rooms grid */}
      {filteredRooms.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">
            {searchTerm || selectedRoomType !== 'all' || selectedAmenities.length > 0
              ? 'No se encontraron habitaciones con los filtros seleccionados'
              : 'No hay habitaciones disponibles en este hotel'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRooms.map(room => (
            <div
              key={room._id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Room image placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-6xl font-bold">{room.roomNumber}</div>
                  <div className="text-xl mt-2">{room.roomType}</div>
                </div>
              </div>

              {/* Room details */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Habitación {room.number}
                    </h3>
                    <p className="text-gray-600 mt-1 capitalize">{room.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ${room.price ? room.price.toLocaleString() : '0'}
                    </div>
                    <div className="text-sm text-gray-600">por noche</div>
                  </div>
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    👥 {room.capacity} personas
                  </span>
                  {room.amenities && room.amenities.length > 0 && (
                    <>
                      {room.amenities.slice(0, 3).map((amenity, index) => {
                        const icon = getAmenityIcon(amenity);
                        const label = getAmenityLabel(amenity);
                        return (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {icon} {label}
                          </span>
                        );
                      })}
                      {room.amenities.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                          +{room.amenities.length - 3} más
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Description */}
                {room.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {room.description}
                  </p>
                )}

                {/* Reserve button */}
                <Button
                  onClick={() => onSelectRoom(room)}
                  variant="primary"
                  className="w-full"
                >
                  Reservar Habitación
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
