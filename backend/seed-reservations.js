import mongoose from 'mongoose';
import Room from './models/Room.model.js';
import Reservation from './models/Reservation.model.js';
import User from './models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/HotelSystem';

const seedReservations = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Obtener habitaciones existentes
    const rooms = await Room.find();
    if (rooms.length === 0) {
      console.log('⚠️  No hay habitaciones. Crea primero algunas habitaciones.');
      await mongoose.connection.close();
      return;
    }
    console.log(`📦 Encontradas ${rooms.length} habitaciones\n`);

    // Obtener primer usuario
    const firstUser = await User.findOne();
    if (!firstUser) {
      console.log('⚠️  No hay usuarios. Crea uno primero.');
      await mongoose.connection.close();
      return;
    }

    // Fechas
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

    // Usar las primeras habitaciones encontradas
    const reservations = [
      {
        room: rooms[0]._id,
        roomNumber: rooms[0].number || '101',
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
        room: rooms[1]._id,
        roomNumber: rooms[1].number || '102',
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
      {
        room: rooms[2]._id,
        roomNumber: rooms[2].number || '103',
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
        room: rooms[3]._id,
        roomNumber: rooms[3].number || '104',
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
      {
        room: rooms[4]._id,
        roomNumber: rooms[4].number || '201',
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
      {
        room: rooms[5]?._id || rooms[0]._id,
        roomNumber: rooms[5]?.number || rooms[0].number || '202',
        createdBy: firstUser._id,
        guestName: 'Jorge Silva',
        guestEmail: 'jorge.s@example.com',
        guestPhone: '3002223344',
        checkIn: new Date(now.getFullYear(), now.getMonth(), 1),
        checkOut: new Date(now.getFullYear(), now.getMonth(), 4),
        guests: 3,
        totalPrice: 600000,
        status: 'completada',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 1)
      },
      {
        room: rooms[6]?._id || rooms[1]._id,
        roomNumber: rooms[6]?.number || rooms[1].number || '203',
        createdBy: firstUser._id,
        guestName: 'Laura Martín',
        guestEmail: 'laura.m@example.com',
        guestPhone: '3001112233',
        checkIn: new Date(now.getFullYear(), now.getMonth(), 5),
        checkOut: new Date(now.getFullYear(), now.getMonth(), 8),
        guests: 2,
        totalPrice: 240000,
        status: 'completada',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 3)
      },
      {
        room: rooms[7]?._id || rooms[2]._id,
        roomNumber: rooms[7]?.number || rooms[2].number || '204',
        createdBy: firstUser._id,
        guestName: 'Roberto Díaz',
        guestEmail: 'roberto.d@example.com',
        guestPhone: '3005554444',
        checkIn: new Date(now.getFullYear(), now.getMonth(), 10),
        checkOut: new Date(now.getFullYear(), now.getMonth(), 12),
        guests: 1,
        totalPrice: 160000,
        status: 'cancelada',
        createdAt: new Date(now.getFullYear(), now.getMonth(), 8)
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
    console.log('\n✅ Reservas de prueba creadas exitosamente!');
    console.log('🚀 Ahora puedes ver el Dashboard con datos reales\n');

    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
};

seedReservations();
