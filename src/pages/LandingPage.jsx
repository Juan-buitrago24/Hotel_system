import { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Wifi, 
  UtensilsCrossed, 
  Waves, 
  Car, 
  Dumbbell,
  Clock,
  Shield,
  Star,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Send,
  Bed,
  Users,
  Check,
  Building2,
  TrendingUp,
  BarChart3,
  HeadphonesIcon,
  Zap,
  X
} from 'lucide-react';
import Button from '../components/Button';
import DarkModeToggle from '../components/DarkModeToggle';

const LandingPage = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Detectar scroll para navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cargar planes desde la API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/plans');
        if (response.ok) {
          const data = await response.json();
          setPlans(data);
        } else {
          console.error('Error al cargar planes');
          // Usar planes por defecto si falla la API
          setPlans(defaultPlans);
        }
      } catch (error) {
        console.error('Error al conectar con la API:', error);
        // Usar planes por defecto si falla la conexión
        setPlans(defaultPlans);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Wifi className="w-8 h-8" />,
      title: 'WiFi Gratis',
      description: 'Internet de alta velocidad en todas las habitaciones'
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: 'Piscina',
      description: 'Piscina climatizada disponible todo el año'
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: 'Restaurant 24/7',
      description: 'Servicio de comida y bebidas las 24 horas'
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: 'Estacionamiento',
      description: 'Parqueadero privado gratuito para huéspedes'
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: 'Gimnasio',
      description: 'Centro fitness equipado con tecnología moderna'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Check-in Flexible',
      description: 'Horarios flexibles de entrada y salida'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Seguridad 24/7',
      description: 'Personal de seguridad y cámaras en todo el hotel'
    },
    {
      icon: <UtensilsCrossed className="w-8 h-8" />,
      title: 'Desayuno Incluido',
      description: 'Buffet de desayuno continental todos los días'
    }
  ];

  const rooms = [
    {
      type: 'Simple',
      price: 80,
      capacity: 1,
      image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      amenities: ['WiFi', 'TV', 'Aire Acondicionado'],
      description: 'Perfecta para viajeros de negocios o individuales'
    },
    {
      type: 'Doble',
      price: 120,
      capacity: 2,
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      amenities: ['WiFi', 'TV', 'Minibar', 'Vista'],
      description: 'Ideal para parejas con comodidades premium'
    },
    {
      type: 'Suite',
      price: 200,
      capacity: 4,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      amenities: ['WiFi', 'TV', 'Minibar', 'Jacuzzi', 'Sala'],
      description: 'Máximo lujo y espacio para familias'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      rating: 5,
      comment: 'Increíble experiencia! Las habitaciones son hermosas y el personal muy atento. Definitivamente volveré.',
      avatar: 'https://ui-avatars.com/api/?name=Maria+Gonzalez&background=4F46E5&color=fff'
    },
    {
      name: 'Carlos Rodríguez',
      rating: 5,
      comment: 'El mejor hotel donde he estado. La piscina es espectacular y el desayuno delicioso.',
      avatar: 'https://ui-avatars.com/api/?name=Carlos+Rodriguez&background=7C3AED&color=fff'
    },
    {
      name: 'Ana Martínez',
      rating: 5,
      comment: 'Perfecto para vacaciones en familia. Los niños disfrutaron mucho la piscina y el servicio es excelente.',
      avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=EC4899&color=fff'
    },
    {
      name: 'Juan Pérez',
      rating: 5,
      comment: 'Excelente ubicación y comodidades. El WiFi rápido fue perfecto para mi trabajo remoto.',
      avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=10B981&color=fff'
    }
  ];

  // Planes por defecto (fallback si la API falla)
  const defaultPlans = [
    {
      name: 'Básico',
      price: 29,
      description: 'Perfecto para hoteles pequeños',
      features: [
        'Hasta 20 habitaciones',
        'Gestión de reservas básica',
        'Dashboard administrativo',
        'Gestión de disponibilidad',
        'Soporte por email'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      name: 'Profesional',
      price: 79,
      description: 'Ideal para hoteles medianos',
      features: [
        'Hasta 100 habitaciones',
        'Gestión completa de reservas',
        'Galería de imágenes con Cloudinary',
        'Control de usuarios y roles',
        'Calendario de disponibilidad',
        'Sistema de autenticación',
        'Soporte prioritario'
      ],
      color: 'from-purple-500 to-pink-500',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 199,
      description: 'Para cadenas hoteleras',
      features: [
        'Habitaciones ilimitadas',
        'Multi-hotel management',
        'Reportes y estadísticas avanzadas',
        'API REST completa',
        'Múltiples administradores',
        'Base de datos MongoDB escalable',
        'Integración personalizada',
        'Soporte dedicado 24/7'
      ],
      color: 'from-orange-500 to-red-500',
      popular: false
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError(''); // Limpiar errores al escribir
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError('');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setFormSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setFormSubmitted(false), 8000);
      } else {
        setFormError(data.message || 'Error al enviar el mensaje');
      }
    } catch (error) {
      console.error('Error:', error);
      setFormError('Error de conexión. Por favor intenta más tarde.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReserveClick = () => {
    setShowReservationModal(true);
  };

  const handleReservationChoice = (choice) => {
    setShowReservationModal(false);
    if (choice === 'login') {
      onNavigate('login');
    } else if (choice === 'register') {
      onNavigate('register');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modal de Reserva */}
      {showReservationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setShowReservationModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full 
                            flex items-center justify-center mx-auto mb-4">
                <Bed className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Reserva tu Habitación!
              </h3>
              <p className="text-gray-600">
                ¿Ya tienes una cuenta o es tu primera vez?
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleReservationChoice('login')}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                         rounded-xl font-semibold hover:shadow-lg transition-all flex items-center 
                         justify-center gap-3"
              >
                <Users className="w-5 h-5" />
                Ya tengo cuenta - Iniciar Sesión
              </button>

              <button
                onClick={() => handleReservationChoice('register')}
                className="w-full py-4 px-6 bg-white border-2 border-blue-600 text-blue-600 
                         rounded-xl font-semibold hover:bg-blue-50 transition-all flex items-center 
                         justify-center gap-3"
              >
                <ChevronRight className="w-5 h-5" />
                Soy nuevo - Crear Cuenta
              </button>
            </div>

            <p className="text-sm text-gray-500 text-center mt-6">
              Necesitas una cuenta para gestionar tus reservas
            </p>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white dark:bg-gray-800 shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                scrolled 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600' 
                  : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <Building2 className={`w-7 h-7 ${scrolled ? 'text-white' : 'text-white'}`} />
              </div>
              <div>
                <h1 className={`text-2xl font-bold transition-colors ${
                  scrolled ? 'text-gray-900 dark:text-white' : 'text-white'
                }`}>
                  Hotel Manager
                </h1>
                <p className={`text-xs transition-colors ${
                  scrolled ? 'text-gray-500 dark:text-gray-400' : 'text-white/80'
                }`}>
                  Gestión Hotelera
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className={`font-medium transition-colors ${
                  scrolled ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' : 'text-white hover:text-blue-200'
                }`}
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('rooms')}
                className={`font-medium transition-colors ${
                  scrolled ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' : 'text-white hover:text-blue-200'
                }`}
              >
                Habitaciones
              </button>
              <button 
                onClick={() => scrollToSection('hotels')}
                className={`font-medium transition-colors ${
                  scrolled ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' : 'text-white hover:text-blue-200'
                }`}
              >
                Para Hoteles
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className={`font-medium transition-colors ${
                  scrolled ? 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400' : 'text-white hover:text-blue-200'
                }`}
              >
                Contacto
              </button>
              <DarkModeToggle />
              <Button 
                variant={scrolled ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onNavigate('login')}
              >
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="home"
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background con gradiente más oscuro para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          {/* Patrón de puntos */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in drop-shadow-2xl">
            Gestión Hotelera Inteligente
          </h1>
          <p className="text-xl sm:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-lg">
            La plataforma todo-en-uno para hoteles modernos. 
            Reserva habitaciones o administra tu hotel con facilidad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all"
              onClick={handleReserveClick}
            >
              Reservar Ahora
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <button 
              onClick={() => scrollToSection('rooms')}
              className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg 
                       hover:bg-white hover:text-slate-900 transition-all shadow-xl"
            >
              Explorar Hoteles
            </button>
          </div>

          {/* Stats con mejor contraste */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="backdrop-blur-sm bg-white/10 p-4 rounded-lg">
              <div className="text-4xl font-bold text-white drop-shadow-lg">100+</div>
              <div className="text-white/90 font-medium">Hoteles Registrados</div>
            </div>
            <div className="backdrop-blur-sm bg-white/10 p-4 rounded-lg">
              <div className="text-4xl font-bold text-white drop-shadow-lg">10K+</div>
              <div className="text-white/90 font-medium">Reservas Exitosas</div>
            </div>
            <div className="backdrop-blur-sm bg-white/10 p-4 rounded-lg">
              <div className="text-4xl font-bold text-white drop-shadow-lg">4.9★</div>
              <div className="text-white/90 font-medium">Calificación Promedio</div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Por Qué Elegirnos?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Conectamos hoteles con viajeros, ofreciendo la mejor experiencia para ambos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl 
                              flex items-center justify-center text-white mb-4 group-hover:scale-110 
                              transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="rooms" className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tipos de Habitaciones Disponibles
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Encuentra la habitación perfecta en cualquiera de nuestros hoteles asociados. 
              Desde opciones individuales hasta suites de lujo para toda la familia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl 
                         transition-shadow group flex flex-col h-full"
              >
                <div className="relative h-64 overflow-hidden flex-shrink-0">
                  <img 
                    src={room.image} 
                    alt={room.type}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
                    <span className="text-2xl font-bold text-blue-600">${room.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">/noche</span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Habitación {room.type}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
                    {room.description}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Users className="w-5 h-5 mr-2" />
                      {room.capacity} {room.capacity === 1 ? 'persona' : 'personas'}
                    </div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Bed className="w-5 h-5 mr-2" />
                      1 cama
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {room.amenities.map((amenity, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleReserveClick}
                  >
                    Reservar Ahora
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Lo Que Dicen Nuestros Huéspedes
            </h2>
            <p className="text-xl text-blue-100 dark:text-blue-200">
              Miles de clientes satisfechos nos respaldan
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              <img 
                src={testimonials[currentTestimonial].avatar}
                alt={testimonials[currentTestimonial].name}
                className="w-20 h-20 rounded-full mb-4"
              />
              <div className="flex mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 italic">
                "{testimonials[currentTestimonial].comment}"
              </p>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {testimonials[currentTestimonial].name}
              </h4>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentTestimonial 
                      ? 'bg-blue-600 dark:bg-blue-400 w-8' 
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: ¿Eres un Hotel? */}
      <section id="hotels" className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full mb-6 shadow-lg">
              <Building2 className="w-5 h-5" />
              <span className="font-bold text-lg">Para Hoteles</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Transforma tu Hotel con Tecnología
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Únete a más de <span className="font-bold text-blue-600 dark:text-blue-400">100+ hoteles</span> que ya confían en nosotros. 
              Automatiza tu gestión, aumenta reservas y mejora la experiencia de tus huéspedes.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl 
                            flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Aumenta Reservas</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Gestión inteligente que incrementa tu ocupación</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl 
                            flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Analytics Avanzados</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Reportes y estadísticas en tiempo real</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl 
                            flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Automatización</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Reduce tareas manuales y errores humanos</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl 
                            flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Soporte 24/7</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Asistencia técnica cuando la necesites</p>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Planes y Precios
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Elige el plan perfecto para tu hotel. Sin costos ocultos.
            </p>
          </div>

          {/* Indicador de carga */}
          {loadingPlans ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando planes...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, index) => (
                  <div 
                    key={plan._id || index}
                    className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform 
                              transition-all hover:scale-105 ${plan.popular ? 'ring-4 ring-purple-500 dark:ring-purple-400' : ''}`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 
                                    text-white px-4 py-1 text-sm font-bold">
                        MÁS POPULAR
                      </div>
                    )}

                    <div className={`bg-gradient-to-r ${plan.color} p-8 text-white`}>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-blue-100 dark:text-blue-200 mb-4">{plan.description}</p>
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold">${plan.price}</span>
                        <span className="text-xl ml-2">/mes</span>
                      </div>
                    </div>

                    <div className="p-8">
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg' 
                            : ''
                        }`}
                        onClick={() => scrollToSection('contact')}
                      >
                        Comenzar Ahora
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  ¿Tienes más de 100 habitaciones o necesidades específicas?
                </p>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-2"
                >
                  Contacta con ventas para un plan personalizado
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Contáctanos
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                ¿Tienes preguntas? Estamos aquí para ayudarte
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Dirección</h4>
                    <p className="text-gray-600 dark:text-gray-400">Av. Principal 123, Centro, Ciudad</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Teléfono</h4>
                    <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h4>
                    <p className="text-gray-600 dark:text-gray-400">info@hotelmanager.com</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Síguenos</h4>
                <div className="flex gap-4">
                  <a href="#" className="w-12 h-12 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center 
                                       text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                    <Facebook className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg 
                                       flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-blue-400 dark:bg-blue-600 rounded-lg flex items-center justify-center 
                                       text-white hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors">
                    <Twitter className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Envíanos un mensaje
              </h3>

              {formSubmitted && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="text-green-800 dark:text-green-300 font-semibold">¡Mensaje enviado exitosamente!</p>
                  </div>
                  <p className="text-green-700 dark:text-green-400 text-sm ml-8">
                    Te contactaremos pronto. Revisa tu email para más detalles.
                  </p>
                </div>
              )}

              {formError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex items-center gap-3">
                  <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-300">{formError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="juan@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensaje
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">🏨 Hotel Manager</h3>
              <p className="text-gray-400 dark:text-gray-500">
                Plataforma líder en gestión hotelera. Conectamos hoteles con viajeros de todo el mundo.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('home')} className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                    Inicio
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('rooms')} className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                    Habitaciones
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('contact')} className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                    Contacto
                  </button>
                </li>
                <li>
                  <button onClick={() => onNavigate('login')} className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors">
                    Iniciar Sesión
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li>Restaurant 24/7</li>
                <li>Servicio a la habitación</li>
                <li>Lavandería</li>
                <li>Spa & Wellness</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Horarios</h4>
              <ul className="space-y-2 text-gray-400 dark:text-gray-500">
                <li>Check-in: 3:00 PM</li>
                <li>Check-out: 12:00 PM</li>
                <li>Recepción: 24/7</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 dark:border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              © 2025 Hotel Manager. Todos los derechos reservados.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors text-sm">
                Términos y Condiciones
              </a>
              <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-300 transition-colors text-sm">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
