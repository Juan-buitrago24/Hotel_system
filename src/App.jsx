import React, { useState } from 'react'
import AuthContext from './context/AuthContext'
import LoginPage from './components/LoginPage'
import Header from './components/Header'
import Navigation from './components/Navigation'
import ReservationsPage from './pages/ReservationsPage'

const HotelManagementApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('reservations');

  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
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
        </main>
      </div>
    </AuthContext.Provider>
  );
};

export default HotelManagementApp
