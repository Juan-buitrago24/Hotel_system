import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Phone, Mail, Building2 } from 'lucide-react';
import { hotelAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { SkeletonGrid } from '../components/SkeletonLoader';
import Button from '../components/Button';

export default function ClientHotelsPage({ onSelectHotel }) {
  console.log('ClientHotelsPage component mounted');
  
  const { toast } = useToast();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  console.log('ClientHotelsPage rendered', { hotels: hotels.length, loading });

  useEffect(() => {
    console.log('useEffect triggered, loading hotels...');
    loadHotels();
  }, []);

  const loadHotels = async () => {
    try {
      setLoading(true);
      console.log('Iniciando carga de hoteles...');
      const response = await hotelAPI.getAll();
      console.log('Hoteles recibidos:', response);
      console.log('Tipo de response:', typeof response, Array.isArray(response));
      
      // La API puede devolver { hotels: [...] } o directamente [...]
      const hotelsData = Array.isArray(response) ? response : (response.hotels || response.data || []);
      console.log('Hotels data después de procesar:', hotelsData);
      
      setHotels(hotelsData);
    } catch (error) {
      console.error('Error cargando hoteles:', error);
      console.error('Error detalles:', error.response?.data || error.message);
      if (toast?.error) {
        toast.error('Error al cargar los hoteles');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter(hotel =>
    hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('Filtered hotels:', filteredHotels.length, 'of', hotels.length);

  if (loading) {
    console.log('Showing loading state...');
    return (
      <div className="space-y-6">
        <div className="skeleton h-10 w-full rounded-lg"></div>
        <SkeletonGrid items={6} columns={3} />
      </div>
    );
  }

  console.log('Rendering main content...');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="w-8 h-8 text-blue-600" />
          Buscar Hoteles
        </h1>
        <p className="text-gray-600 mt-1">
          Encuentra el hotel perfecto para tu estadía
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, ciudad o país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Hotels Grid */}
      {filteredHotels.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No hay hoteles disponibles
          </h3>
          <p className="text-gray-500">
            {searchTerm ? 'Intenta con otra búsqueda' : 'No hay hoteles registrados en este momento'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              {/* Hotel Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 className="w-20 h-20 text-white opacity-50" />
              </div>

              {/* Hotel Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {hotel.name}
                  </h3>
                  <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    4.5
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {hotel.city}, {hotel.country}
                  </span>
                </div>

                {/* Address */}
                {hotel.address && (
                  <p className="text-sm text-gray-500 mb-3">
                    {hotel.address}
                  </p>
                )}

                {/* Contact */}
                <div className="space-y-1 mb-4">
                  {hotel.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{hotel.phone}</span>
                    </div>
                  )}
                  {hotel.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{hotel.email}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => onSelectHotel(hotel)}
                  fullWidth
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ver Habitaciones
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
