import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { reservationsAPI, roomsAPI } from '../services/api'
import CalendarView from '../components/CalendarView'
import ReservationsTable from '../components/ReservationsTable'
import NewReservationModal from '../components/NewReservationModal'
import AddServicesModal from '../components/AddServicesModal'
import ExtendStayModal from '../components/ExtendStayModal'
import Button from '../components/Button'
import { Lock } from 'lucide-react'
import { useToast } from '../context/ToastContext'
import { SkeletonCalendar, SkeletonTable } from '../components/SkeletonLoader'

const ReservationsPage = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
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
      console.error('Error al eliminar reserva:', error);
      const message = error.response?.data?.message || 'Error al eliminar la reserva';
      toast.error(message);
    }
  };

  const handleOpenServicesModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowServicesModal(true);
  };

  const handleSaveServices = async (data) => {
    try {
      // Actualizar reserva con nuevos servicios y total
      await reservationsAPI.update(data.reservationId, {
        extraServices: data.extraServices,
        totalPrice: data.newTotal,
        notes: data.additionalNotes 
          ? `${selectedReservation.notes || ''}\n[Servicios agregados]: ${data.additionalNotes}`.trim()
          : selectedReservation.notes
      });

      await fetchData();
      setShowServicesModal(false);
      setSelectedReservation(null);
      
      const servicesCount = data.extraServices.length;
      toast.success(`Servicios actualizados. Nuevo total: $${data.newTotal.toLocaleString()}`);
    } catch (error) {
      console.error('Error al actualizar servicios:', error);
      const message = error.response?.data?.message || 'Error al actualizar los servicios';
      toast.error(message);
    }
  };

  const handleOpenExtendModal = (reservation) => {
    setSelectedReservation(reservation);
    setShowExtendModal(true);
  };

  const handleExtendStay = async (extensionData) => {
    try {
      const response = await reservationsAPI.extendStay(extensionData.reservationId, extensionData);
      
      toast.success('Estadía extendida exitosamente');
      setShowExtendModal(false);
      setSelectedReservation(null);
      await fetchData();
    } catch (error) {
      console.error('Error extending stay:', error);
      toast.error(error.response?.data?.message || 'Error al extender la estadía');
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

  const canExtend = (reservation) => {
    // Solo permite extender reservas confirmadas o en curso
    if (!['confirmada', 'en_curso'].includes(reservation.status)) {
      return false;
    }
    // Solo antes de la fecha de salida
    const checkOut = new Date(reservation.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return checkOut >= today;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="skeleton h-8 w-48 rounded"></div>
          <div className="skeleton h-10 w-40 rounded-lg"></div>
        </div>

        {/* Calendar Skeleton */}
        <SkeletonCalendar />

        {/* Table Skeleton */}
        <div>
          <div className="skeleton h-6 w-32 rounded mb-4"></div>
          <SkeletonTable rows={5} columns={7} />
        </div>
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
        reservations={reservations.filter(r => r.status !== 'cancelada')}
      />

      <ReservationsTable
        reservations={reservations}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteReservation}
        onAddServices={handleOpenServicesModal}
        onExtendStay={handleOpenExtendModal}
        canExtend={canExtend}
        userRole={user.role}
      />

      <NewReservationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateReservation}
        rooms={rooms}
      />

      <AddServicesModal
        isOpen={showServicesModal}
        onClose={() => {
          setShowServicesModal(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        onSave={handleSaveServices}
      />

      <ExtendStayModal
        isOpen={showExtendModal}
        onClose={() => {
          setShowExtendModal(false);
          setSelectedReservation(null);
        }}
        reservation={selectedReservation}
        onSave={handleExtendStay}
      />
    </div>
  );
};

export default ReservationsPage
