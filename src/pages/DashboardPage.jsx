import React, { useState, useEffect } from 'react';
import { 
  Home, 
  DollarSign, 
  Calendar, 
  Users, 
  Percent,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { getDashboardStats } from '../services/api';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
      setError('');
    } catch (err) {
      setError('Error al cargar estadísticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Resumen general del sistema hotelero</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Ocupación Actual"
            value={`${stats?.rooms?.occupancyRate || 0}%`}
            subtitle={`${stats?.rooms?.occupied || 0} de ${stats?.rooms?.total || 0} habitaciones`}
            icon={Percent}
            color="blue"
          />
          <StatsCard
            title="Ingresos del Mes"
            value={formatCurrency(stats?.revenue?.month || 0)}
            subtitle={`Hoy: ${formatCurrency(stats?.revenue?.today || 0)}`}
            icon={DollarSign}
            color="green"
          />
          <StatsCard
            title="Reservas Activas"
            value={stats?.reservations?.active || 0}
            subtitle={`${stats?.reservations?.today || 0} reservas hoy`}
            icon={Calendar}
            color="purple"
          />
          <StatsCard
            title="Habitaciones Disponibles"
            value={stats?.rooms?.available || 0}
            subtitle={`${stats?.rooms?.maintenance || 0} en mantenimiento`}
            icon={Home}
            color="orange"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Reservas del Mes</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats?.reservations?.month || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Total de reservas</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Usuarios Registrados</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats?.users?.total || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Total de usuarios</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Ingresos Promedio</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {formatCurrency(
                stats?.reservations?.month > 0 
                  ? (stats?.revenue?.month || 0) / stats.reservations.month 
                  : 0
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">Por reserva</p>
          </div>
        </div>

        {/* Upcoming Check-ins and Check-outs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Check-ins */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Próximos Check-ins</h3>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            {stats?.upcomingCheckIns?.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingCheckIns.map((checkIn) => (
                  <div key={checkIn.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{checkIn.guest}</p>
                      <p className="text-sm text-gray-600">
                        Hab. {checkIn.room} • {checkIn.roomType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(checkIn.checkIn)}
                      </p>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        {checkIn.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay check-ins próximos</p>
              </div>
            )}
          </div>

          {/* Check-outs */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Próximos Check-outs</h3>
              <XCircle className="h-5 w-5 text-orange-500" />
            </div>
            {stats?.upcomingCheckOuts?.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingCheckOuts.map((checkOut) => (
                  <div key={checkOut.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{checkOut.guest}</p>
                      <p className="text-sm text-gray-600">
                        Hab. {checkOut.room} • {checkOut.roomType}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-800">
                        {formatDate(checkOut.checkOut)}
                      </p>
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                        {checkOut.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No hay check-outs próximos</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Rooms */}
        {stats?.topRooms?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Habitaciones Más Reservadas del Mes</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Habitación</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Reservas</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topRooms.map((room, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">Hab. {room.roomNumber}</td>
                      <td className="py-3 px-4 text-gray-600">{room.type}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {room.reservations}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-800">
                        {formatCurrency(room.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={loadDashboardStats}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Actualizar Estadísticas
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
