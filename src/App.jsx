import React, { useState, useEffect } from 'react'
import AuthContext from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ToastContainer'
import LandingPage from './pages/LandingPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import ForgotPasswordPage from './components/ForgotPasswordPage'
import ResetPasswordPage from './components/ResetPasswordPage'
import VerifyAccountPage from './components/VerifyAccountPage'
import ProfilePage from './components/ProfilePage'
import Header from './components/Header'
import Navigation from './components/Navigation'
import HotelBanner from './components/HotelBanner'
import DashboardPage from './pages/DashboardPage'
import ReservationsPage from './pages/ReservationsPage'
import RoomsPage from './pages/RoomsPage'
import HotelsManagementPage from './pages/HotelsManagementPage'
import EmployeesPage from './pages/EmployeesPage'
import GuestsPage from './pages/GuestsPage'
import AmenitiesManagementPage from './pages/AmenitiesManagementPage'
import ClientHotelsPage from './pages/ClientHotelsPage'
import ClientRoomsPage from './pages/ClientRoomsPage'
import ClientReservationForm from './pages/ClientReservationForm'
import MyReservationsPage from './pages/MyReservationsPage'
import { hotelAPI } from './services/api'

const HotelManagementApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // Cambiar default a 'landing'
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [authView, setAuthView] = useState('landing'); // Cambiar default a 'landing'
  const [resetToken, setResetToken] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  // Cargar usuario desde localStorage al iniciar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      // Si el usuario está logueado, ir al dashboard apropiado
      setCurrentView(user.role === 'client' ? 'client-hotels' : 'dashboard');
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

  // Cargar datos del hotel del usuario
  useEffect(() => {
    const loadHotel = async () => {
      if (currentUser && currentUser.hotel) {
        try {
          const hotelData = await hotelAPI.getById(currentUser.hotel);
          setCurrentHotel(hotelData);
        } catch (error) {
          console.error('Error cargando hotel:', error);
        }
      } else {
        setCurrentHotel(null);
      }
    };
    
    loadHotel();
  }, [currentUser]);

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthView('login');
    // Establecer vista según el rol del usuario
    if (user.role === 'admin_global') {
      setCurrentView('hotels');
    } else if (user.role === 'cliente') {
      setCurrentView('search-hotels');
    } else {
      setCurrentView('dashboard');
    }
    window.history.pushState({}, '', '/');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentHotel(null);
    setCurrentView('dashboard'); // Reset a la vista inicial
    setShowProfile(false);
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
    return (
      <ToastProvider>
        <ToastContainer />
        
        {/* Landing Page */}
        {authView === 'landing' && (
          <LandingPage onNavigate={setAuthView} />
        )}

        {/* Register */}
        {authView === 'register' && (
          <RegisterPage 
            onRegister={handleLogin}
            onBackToLogin={() => setAuthView('login')}
          />
        )}

        {/* Forgot Password */}
        {authView === 'forgot-password' && (
          <ForgotPasswordPage 
            onBackToLogin={() => setAuthView('login')}
          />
        )}

        {/* Reset Password */}
        {authView === 'reset-password' && resetToken && (
          <ResetPasswordPage 
            token={resetToken}
            onSuccess={handleResetSuccess}
          />
        )}

        {/* Verify Account */}
        {authView === 'verify-account' && verifyToken && (
          <VerifyAccountPage 
            token={verifyToken}
            onSuccess={handleVerifySuccess}
            onBackToLogin={() => setAuthView('login')}
          />
        )}

        {/* Login */}
        {authView === 'login' && (
          <LoginPage 
            onLogin={handleLogin}
            onShowRegister={() => setAuthView('register')}
            onShowForgotPassword={() => setAuthView('forgot-password')}
            onBackToLanding={() => setAuthView('landing')}
          />
        )}
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <AuthContext.Provider value={{ user: currentUser }}>
        <ToastContainer />

        {/* Vistas con autenticación */}
        {currentUser && (
          <div className="min-h-screen bg-gray-100">
            <Header 
              user={currentUser} 
              onLogout={handleLogout}
              onShowProfile={() => setShowProfile(true)}
            />
            
            {console.log('App render:', { role: currentUser?.role, currentView })}
            
            {/* Vista para CLIENTES */}
            {currentUser.role === 'cliente' ? (
            <>
              <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                  <div className="flex gap-4 py-4">
                    <button
                      onClick={() => setCurrentView('search-hotels')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentView === 'search-hotels'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Buscar Hoteles
                    </button>
                    <button
                      onClick={() => setCurrentView('my-reservations')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentView === 'my-reservations'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Mis Reservas
                    </button>
                  </div>
                </div>
              </div>
              <main className="max-w-7xl mx-auto p-4 lg:p-6">
                {currentView === 'search-hotels' && (
                  <ClientHotelsPage 
                    onSelectHotel={(hotel) => {
                      console.log('Hotel selected:', hotel);
                      setSelectedHotel(hotel);
                      setCurrentView('select-room');
                      console.log('View changed to select-room');
                    }}
                  />
                )}
                {currentView === 'select-room' && selectedHotel && (
                  <ClientRoomsPage
                    hotel={selectedHotel}
                    onBack={() => setCurrentView('search-hotels')}
                    onSelectRoom={(room) => {
                      setSelectedRoom(room);
                      setCurrentView('new-reservation');
                    }}
                  />
                )}
                {currentView === 'select-room' && !selectedHotel && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: No se seleccionó un hotel
                  </div>
                )}
                {currentView === 'new-reservation' && selectedRoom && selectedHotel && (
                  <ClientReservationForm
                    hotel={selectedHotel}
                    room={selectedRoom}
                    currentUser={currentUser}
                    onBack={() => setCurrentView('select-room')}
                    onSuccess={() => {
                      setCurrentView('my-reservations');
                      setSelectedHotel(null);
                      setSelectedRoom(null);
                    }}
                  />
                )}
                {currentView === 'my-reservations' && (
                  <MyReservationsPage currentUser={currentUser} />
                )}
              </main>
            </>
          ) : (
            /* Vista para STAFF (admins y empleados) */
            <>
              <HotelBanner hotel={currentHotel} user={currentUser} />
              <Navigation activeView={currentView} onViewChange={setCurrentView} />
              <main className="max-w-7xl mx-auto p-4 lg:p-6">
                {currentView === 'dashboard' && <DashboardPage />}
                {currentView === 'reservations' && <ReservationsPage />}
                {currentView === 'rooms' && <RoomsPage />}
                {currentView === 'hotels' && <HotelsManagementPage />}
                {currentView === 'guests' && <GuestsPage user={currentUser} />}
                {currentView === 'employees' && <EmployeesPage user={currentUser} />}
                {currentView === 'amenities' && <AmenitiesManagementPage />}
              </main>
            </>
          )}

          {showProfile && (
            <ProfilePage 
              user={currentUser}
              onUpdateUser={handleUpdateUser}
              onClose={() => setShowProfile(false)}
            />
          )}
          </div>
        )}
      </AuthContext.Provider>
    </ToastProvider>
  );
};

export default HotelManagementApp
