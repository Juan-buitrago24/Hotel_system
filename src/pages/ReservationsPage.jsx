import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { reservationsAPI, roomsAPI } from '../services/api'
import CalendarView from '../components/CalendarView'
import ReservationsTable from '../components/ReservationsTable'
import NewReservationModal from '../components/NewReservationModal'
import Button from '../components/Button'
import { Loader, Lock } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const ReservationsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reservationsRes, roomsRes] = await Promise.all([
        reservationsAPI.getAll(),
        roomsAPI.getAll()
      ]);
      setReservations(reservationsRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReservation = async (newReservation) => {
    try {
      await reservationsAPI.create(newReservation);
      await fetchData();
      setShowModal(false);
      toast.success('Reserva creada exitosamente');
    } catch (error) {
      console.error('Error al crear reserva:', error);
      const message = error.response?.data?.message || 'Error al crear la reserva';
      toast.error(message);
    }
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta reserva?')) return;

    try {
      await reservationsAPI.delete(id);
      await fetchData();
      toast.success('Reserva eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar:', error);
      const message = error.response?.data?.message || 'Error al eliminar la reserva';
      toast.error(message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await reservationsAPI.updateStatus(id, newStatus);
      await fetchData();
      toast.success('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Reservas</h2>
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto px-6 py-3 shadow-lg">
          + Nueva Reserva
        </Button>
      </div>

      {/* Mensaje informativo para empleados */}
      {user.role === 'empleado' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">Permisos de empleado</p>
            <p className="mt-1">Puedes crear y gestionar reservas, pero solo los administradores pueden eliminarlas.</p>
          </div>
        </div>
      )}

      <CalendarView
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        reservations={reservations}
      />

      <ReservationsTable
        reservations={reservations}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteReservation}
        userRole={user.role}
      />

      <NewReservationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateReservation}
        rooms={rooms}
      />
    </div>
  );
};

export default ReservationsPage
