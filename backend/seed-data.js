import mongoose from 'mongoose';
import Room from './models/Room.model.js';
import Reservation from './models/Reservation.model.js';
import User from './models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/HotelSystem';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Verificar si ya hay datos
    const existingRooms = await Room.countDocuments();
    if (existingRooms > 0) {
      console.log('⚠️  Ya existen habitaciones. ¿Deseas continuar?');
      console.log('   Este script NO eliminará datos existentes\n');
    }

    // Crear habitaciones
    const rooms = [
      { number: '101', type: 'simple', capacity: 1, price: 80000, floor: 1, status: 'disponible', amenities: ['WiFi', 'TV', 'Aire Acondicionado'] },
      { number: '102', type: 'simple', capacity: 1, price: 80000, floor: 1, status: 'disponible', amenities: ['WiFi', 'TV', 'Aire Acondicionado'] },
      { number: '103', type: 'doble', capacity: 2, price: 120000, floor: 1, status: 'disponible', amenities: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar'] },
      { number: '104', type: 'doble', capacity: 2, price: 120000, floor: 1, status: 'ocupada', amenities: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar'] },
      { number: '201', type: 'suite', capacity: 4, price: 200000, floor: 2, status: 'disponible', amenities: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar', 'Jacuzzi'] },
      { number: '202', type: 'suite', capacity: 4, price: 200000, floor: 2, status: 'ocupada', amenities: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar', 'Jacuzzi'] },
      { number: '203', type: 'doble', capacity: 2, price: 120000, floor: 2, status: 'disponible', amenities: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar'] },
      { number: '204', type: 'simple', capacity: 1, price: 80000, floor: 2, status: 'mantenimiento', amenities: ['WiFi', 'TV'] },
      { number: '301', type: 'suite', capacity: 4, price: 200000, floor: 3, status: 'disponible', amenities: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar', 'Jacuzzi', 'Vista al Mar'] },
      { number: '302', type: 'doble', capacity: 2, price: 120000, floor: 3, status: 'disponible', amenities: ['WiFi', 'TV', 'Aire Acondicionado', 'Minibar'] }
    ];

    console.log('📦 Creando habitaciones...');
    const createdRooms = await Room.insertMany(rooms);
    console.log(`✅ ${createdRooms.length} habitaciones creadas\n`);

    // Obtener primer usuario para asignar reservas
    const firstUser = await User.findOne();
    if (!firstUser) {
      console.log('⚠️  No hay usuarios. Crea uno primero.');
      await mongoose.connection.close();
      return;
    }

    // Crear reservas con diferentes fechas
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const in3Days = new Date(now);
    in3Days.setDate(in3Days.getDate() + 3);
    
    const in7Days = new Date(now);
    in7Days.setDate(in7Days.getDate() + 7);

    const lastWeek = new Date(now);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const occupiedRoom1 = createdRooms.find(r => r.number === '104');
    const occupiedRoom2 = createdRooms.find(r => r.number === '202');

    const reservations = [
      // Reservas activas (ocupando habitaciones)
      {
        room: occupiedRoom1._id,
        roomNumber: '104',
        createdBy: firstUser._id,
        guestName: 'Carlos Rodríguez',
        guestEmail: 'carlos.r@example.com',
        guestPhone: '3001234567',
        checkIn: yesterday,
        checkOut: in3Days,
        guests: 2,
        totalPrice: 360000,
        status: 'en_curso',
        createdAt: lastWeek
      },
      {
        room: occupiedRoom2._id,
        roomNumber: '202',
        createdBy: firstUser._id,
        guestName: 'María González',
        guestEmail: 'maria.g@example.com',
        guestPhone: '3009876543',
        checkIn: yesterday,
        checkOut: tomorrow,
        guests: 3,
        totalPrice: 400000,
        status: 'en_curso',
        createdAt: lastWeek
      },
      // Reservas confirmadas (check-in futuro)
      {
        room: createdRooms.find(r => r.number === '101')._id,
        roomNumber: '101',
        createdBy: firstUser._id,
        guestName: 'Pedro Martínez',
        guestEmail: 'pedro.m@example.com',
        guestPhone: '3005551234',
        checkIn: tomorrow,
        checkOut: in7Days,
        guests: 1,
        totalPrice: 480000,
        status: 'confirmada',
        createdAt: new Date()
      },
      {
        room: createdRooms.find(r => r.number === '301')._id,
        roomNumber: '301',
        createdBy: firstUser._id,
        guestName: 'Ana López',
        guestEmail: 'ana.l@example.com',
        guestPhone: '3007778888',
        checkIn: in3Days,
        checkOut: in7Days,
        guests: 4,
        totalPrice: 800000,
        status: 'confirmada',
        createdAt: new Date()
      },
      // Reserva pendiente
      {
        room: createdRooms.find(r => r.number === '103')._id,
        roomNumber: '103',
        createdBy: firstUser._id,
        guestName: 'Luis Fernández',
        guestEmail: 'luis.f@example.com',
        guestPhone: '3004445566',
        checkIn: in7Days,
        checkOut: new Date(in7Days.getTime() + 3 * 24 * 60 * 60 * 1000),
        guests: 2,
        totalPrice: 360000,
        status: 'pendiente',
        createdAt: new Date()
      },
      // Algunas reservas completadas del mes pasado
      {
        room: createdRooms.find(r => r.number === '201')._id,
        roomNumber: '201',
        createdBy: firstUser._id,
        guestName: 'Jorge Silva',
        guestEmail: 'jorge.s@example.com',
        guestPhone: '3002223344',
        checkIn: new Date(now.getFullYear(), now.getMonth() - 1, 15),
        checkOut: new Date(now.getFullYear(), now.getMonth() - 1, 18),
        guests: 3,
        totalPrice: 600000,
        status: 'completada',
        createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 10)
      }
    ];

    console.log('📅 Creando reservas...');
    const createdReservations = await Reservation.insertMany(reservations);
    console.log(`✅ ${createdReservations.length} reservas creadas\n`);

    // Resumen final
    const totalRooms = await Room.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    const totalUsers = await User.countDocuments();

    console.log('📊 RESUMEN FINAL:');
    console.log('==================');
    console.log(`Habitaciones: ${totalRooms}`);
    console.log(`Reservas: ${totalReservations}`);
    console.log(`Usuarios: ${totalUsers}`);
    console.log('\n✅ Datos de prueba creados exitosamente!');
    console.log('🚀 Ahora puedes ver el Dashboard con datos reales\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
};

seedData();
