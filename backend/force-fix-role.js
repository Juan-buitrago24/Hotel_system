import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';

dotenv.config();

async function forceFixRole() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/HotelSystem');
    console.log('✅ Conectado a MongoDB\n');

    // Usar updateOne directo para forzar el cambio
    const result = await User.updateOne(
      { username: 'hotelparadise' },
      { 
        $set: { 
          role: 'hotel_admin',
          active: true,
          verified: true
        } 
      }
    );

    console.log('Resultado de actualización:', result);

    // Verificar
    const user = await User.findOne({ username: 'hotelparadise' });
    console.log('\n✅ Usuario actualizado:');
    console.log('   Username:', user.username);
    console.log('   Role:', user.role);
    console.log('   Active:', user.active);
    console.log('   Verified:', user.verified);
    
    console.log('\n🔑 IMPORTANTE: Ahora debes:');
    console.log('   1. Cerrar sesión en el frontend');
    console.log('   2. Volver a iniciar sesión con: hotelparadise / paradise123');
    console.log('   3. El nuevo token tendrá el rol correcto\n');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

forceFixRole();
