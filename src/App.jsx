import React, { useState, useEffect } from 'react'
import AuthContext from './context/AuthContext'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import ForgotPasswordPage from './components/ForgotPasswordPage'
import ResetPasswordPage from './components/ResetPasswordPage'
import VerifyAccountPage from './components/VerifyAccountPage'
import ProfilePage from './components/ProfilePage'
import Header from './components/Header'
import Navigation from './components/Navigation'
import DashboardPage from './pages/DashboardPage'
import ReservationsPage from './pages/ReservationsPage'
import RoomsPage from './pages/RoomsPage'

const HotelManagementApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [authView, setAuthView] = useState('login'); // 'login', 'register', 'forgot-password', 'reset-password', 'verify-account'
  const [resetToken, setResetToken] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Verificar si hay un token de reset o verify en la URL
    const path = window.location.pathname;
    const resetMatch = path.match(/\/reset-password\/(.+)/);
    const verifyMatch = path.match(/\/verify\/(.+)/);
    
    if (resetMatch) {
      setResetToken(resetMatch[1]);
      setAuthView('reset-password');
    } else if (verifyMatch) {
      setVerifyToken(verifyMatch[1]);
      setAuthView('verify-account');
    }
  }, []);

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthView('login');
    window.history.pushState({}, '', '/');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthView('login');
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleResetSuccess = () => {
    setAuthView('login');
    setResetToken('');
    window.history.pushState({}, '', '/');
  };

  const handleVerifySuccess = () => {
    setAuthView('login');
    setVerifyToken('');
    window.history.pushState({}, '', '/');
  };

  // Renderizar vistas de autenticación
  if (!currentUser) {
    if (authView === 'register') {
      return (
        <RegisterPage 
          onRegister={handleLogin}
          onBackToLogin={() => setAuthView('login')}
        />
      );
    }

    if (authView === 'forgot-password') {
      return (
        <ForgotPasswordPage 
          onBackToLogin={() => setAuthView('login')}
        />
      );
    }

    if (authView === 'reset-password' && resetToken) {
      return (
        <ResetPasswordPage 
          token={resetToken}
          onSuccess={handleResetSuccess}
        />
      );
    }

    if (authView === 'verify-account' && verifyToken) {
      return (
        <VerifyAccountPage 
          token={verifyToken}
          onSuccess={handleVerifySuccess}
          onBackToLogin={() => setAuthView('login')}
        />
      );
    }

    return (
      <LoginPage 
        onLogin={handleLogin}
        onShowRegister={() => setAuthView('register')}
        onShowForgotPassword={() => setAuthView('forgot-password')}
      />
    );
  }

  return (
    <AuthContext.Provider value={{ user: currentUser }}>
      <div className="min-h-screen bg-gray-100">
        <Header 
          user={currentUser} 
          onLogout={handleLogout}
          onShowProfile={() => setShowProfile(true)}
        />
        <Navigation activeView={currentView} onViewChange={setCurrentView} />
        <main className="max-w-7xl mx-auto p-4 lg:p-6">
          {currentView === 'dashboard' && <DashboardPage />}
          {currentView === 'reservations' && <ReservationsPage />}
          {currentView === 'rooms' && <RoomsPage />}
        </main>

        {showProfile && (
          <ProfilePage 
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onClose={() => setShowProfile(false)}
          />
        )}
      </div>
    </AuthContext.Provider>
  );
};

export default HotelManagementApp
