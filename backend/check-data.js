import mongoose from 'mongoose';
import Room from './models/Room.model.js';
import Reservation from './models/Reservation.model.js';
import User from './models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/HotelSystem';

const checkData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const roomCount = await Room.countDocuments();
    const reservationCount = await Reservation.countDocuments();
    const userCount = await User.countDocuments();

    console.log('\n📊 RESUMEN DE DATOS:');
    console.log('===================');
    console.log(`Habitaciones: ${roomCount}`);
    console.log(`Reservas: ${reservationCount}`);
    console.log(`Usuarios: ${userCount}`);

    if (roomCount > 0) {
      const rooms = await Room.find().limit(5);
      console.log('\n🛏️  Primeras 5 habitaciones:');
      rooms.forEach(room => {
        console.log(`  - Hab. ${room.roomNumber} (${room.type}) - ${room.status}`);
      });
    }

    if (reservationCount > 0) {
      const reservations = await Reservation.find().sort({ createdAt: -1 }).limit(5);
      console.log('\n📅 Últimas 5 reservas:');
      reservations.forEach(res => {
        console.log(`  - ${res.guestName} - ${res.status} - $${res.totalPrice}`);
      });
    }

    await mongoose.connection.close();
    console.log('\n✅ Conexión cerrada');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
};

checkData();
