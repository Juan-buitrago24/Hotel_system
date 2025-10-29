import React, { useState, useEffect } from 'react'
import AuthContext from './context/AuthContext'
import LoginPage from './components/LoginPage'
import Header from './components/Header'
import Navigation from './components/Navigation'
import ReservationsPage from './pages/ReservationsPage'
import RoomsPage from './pages/RoomsPage'

const HotelManagementApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('reservations');

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <AuthContext.Provider value={{ user: currentUser }}>
      <div className="min-h-screen bg-gray-100">
        <Header user={currentUser} onLogout={handleLogout} />
        <Navigation activeView={currentView} onViewChange={setCurrentView} />
        <main className="max-w-7xl mx-auto p-4 lg:p-6">
          {currentView === 'reservations' && <ReservationsPage />}
          {currentView === 'rooms' && <RoomsPage />}
        </main>
      </div>
    </AuthContext.Provider>
  );
};

export default HotelManagementApp
