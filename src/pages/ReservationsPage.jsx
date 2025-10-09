import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { INITIAL_RESERVATIONS } from '../constants/data'
import CalendarView from '../components/CalendarView'
import ReservationsTable from '../components/ReservationsTable'
import NewReservationModal from '../components/NewReservationModal'
import Button from '../components/Button'

const ReservationsPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const handleCreateReservation = (newReservation) => {
    const reservation = {
      id: reservations.length + 1,
      ...newReservation
    };
    setReservations([...reservations, reservation]);
    setShowModal(false);
  };

  const handleDeleteReservation = (id) => {
    if (user.role === 'admin') {
      setReservations(reservations.filter(r => r.id !== id));
    } else {
      alert('Solo los administradores pueden eliminar reservas');
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setReservations(reservations.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Reservas</h2>
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto px-6 py-3 shadow-lg">
          + Nueva Reserva
        </Button>
      </div>

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
      />
    </div>
  );
};

export default ReservationsPage
