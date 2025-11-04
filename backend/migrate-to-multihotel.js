import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hotel from './models/Hotel.model.js';
import User from './models/User.model.js';
import Room from './models/Room.model.js';
import Reservation from './models/Reservation.model.js';

dotenv.config();

async function migrateToMultiHotel() {
  try {
    console.log('🔄 Iniciando migración a sistema multi-hotel...\n');

    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/HotelSystem');
    console.log('✅ Conectado a MongoDB\n');

    // Verificar si ya existe el Hotel Principal
    let mainHotel = await Hotel.findOne({ slug: 'hotel-principal' });
    
    if (mainHotel) {
      console.log('⚠️  Ya existe el Hotel Principal');
      console.log(`   ID: ${mainHotel._id}`);
      console.log(`   Nombre: ${mainHotel.name}\n`);
    } else {
      // Crear Hotel Principal
      console.log('1️⃣  Creando Hotel Principal...');
      mainHotel = await Hotel.create({
        name: 'Hotel Principal',
        slug: 'hotel-principal',
        plan: 'premium',
        active: true,
        settings: {
          currency: 'COP',
          timezone: 'America/Bogota',
          language: 'es'
        },
        contact: {
          email: 'contacto@hotelprincipal.com',
          phone: '3001234567'
        }
      });
      console.log(`✅ Hotel Principal creado con ID: ${mainHotel._id}\n`);
    }

    // Migrar usuarios
    console.log('2️⃣  Migrando usuarios...');
    const usersWithoutHotel = await User.find({ hotel: { $exists: false } });
    
    if (usersWithoutHotel.length > 0) {
      for (const user of usersWithoutHotel) {
        user.hotel = mainHotel._id;
        
        // Actualizar roles antiguos al nuevo sistema
        if (user.role === 'admin') {
          user.role = 'hotel_admin';
        }
        
        await user.save();
        console.log(`   ✅ Usuario migrado: ${user.username} (${user.role})`);
      }
      console.log(`✅ ${usersWithoutHotel.length} usuarios migrados\n`);
    } else {
      console.log('   ℹ️  Todos los usuarios ya tienen hotel asignado\n');
    }

    // Migrar habitaciones
    console.log('3️⃣  Migrando habitaciones...');
    const roomsWithoutHotel = await Room.find({ hotel: { $exists: false } });
    
    if (roomsWithoutHotel.length > 0) {
      for (const room of roomsWithoutHotel) {
        room.hotel = mainHotel._id;
        await room.save();
      }
      console.log(`✅ ${roomsWithoutHotel.length} habitaciones migradas\n`);
    } else {
      console.log('   ℹ️  Todas las habitaciones ya tienen hotel asignado\n');
    }

    // Migrar reservas
    console.log('4️⃣  Migrando reservas...');
    const reservationsWithoutHotel = await Reservation.find({ hotel: { $exists: false } });
    
    if (reservationsWithoutHotel.length > 0) {
      for (const reservation of reservationsWithoutHotel) {
        reservation.hotel = mainHotel._id;
        await reservation.save();
      }
      console.log(`✅ ${reservationsWithoutHotel.length} reservas migradas\n`);
    } else {
      console.log('   ℹ️  Todas las reservas ya tienen hotel asignado\n');
    }

    // Estadísticas finales
    console.log('📊 Estadísticas del Hotel Principal:');
    const stats = await mainHotel.getStats();
    console.log(`   Habitaciones: ${stats.rooms}`);
    console.log(`   Reservas: ${stats.reservations}`);
    console.log(`   Empleados: ${stats.employees}`);

    console.log('\n✅ ¡Migración completada exitosamente!');
    console.log('\n💡 Ahora puedes:');
    console.log('   - Crear nuevos hoteles con POST /api/hotels/register');
    console.log('   - Cada hotel tendrá sus propios datos aislados');
    console.log('   - Los usuarios solo verán datos de su hotel\n');

  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Conexión cerrada');
    process.exit(0);
  }
}

// Ejecutar migración
migrateToMultiHotel();
