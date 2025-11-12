import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from './models/Plan.model.js';

dotenv.config();

const plans = [
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
    maxRooms: 20,
    maxUsers: 1,
    hasAnalytics: false,
    hasAPI: false,
    hasImageGallery: false,
    supportType: 'email',
    popular: false,
    isActive: true,
    color: 'from-blue-500 to-blue-600'
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
    maxRooms: 100,
    maxUsers: 5,
    hasAnalytics: true,
    hasAPI: false,
    hasImageGallery: true,
    supportType: 'priority',
    popular: true,
    isActive: true,
    color: 'from-purple-500 to-pink-500'
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
    maxRooms: 999999,
    maxUsers: 999999,
    hasAnalytics: true,
    hasAPI: true,
    hasImageGallery: true,
    supportType: 'dedicated',
    popular: false,
    isActive: true,
    color: 'from-orange-500 to-red-500'
  }
];

const seedPlans = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Eliminar planes existentes
    await Plan.deleteMany({});
    console.log('🗑️  Planes existentes eliminados');

    // Insertar nuevos planes
    const createdPlans = await Plan.insertMany(plans);
    console.log('✅ Planes creados exitosamente:');
    createdPlans.forEach(plan => {
      console.log(`   - ${plan.name}: $${plan.price}/mes (Max: ${plan.maxRooms} habitaciones, ${plan.maxUsers} usuarios)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear planes:', error);
    process.exit(1);
  }
};

seedPlans();
