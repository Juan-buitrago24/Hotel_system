// Script rápido para eliminar un usuario por email
// Uso: node delete-by-email.js tu@email.com
import { config } from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.model.js';

// Cargar variables de entorno
config();

const deleteByEmail = async (email) => {
  try {
    // Conectar a MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/HotelSystem';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB\n');

    if (!email) {
      console.log('❌ Debes proporcionar un email');
      console.log('\n📝 Uso: node delete-by-email.js tu@email.com\n');
      process.exit(1);
    }

    // Buscar el usuario
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`❌ No se encontró ningún usuario con el email "${email}"\n`);
      
      // Mostrar usuarios disponibles
      const allUsers = await User.find({}).select('username email');
      if (allUsers.length > 0) {
        console.log('📋 Usuarios disponibles:');
        allUsers.forEach(u => {
          console.log(`   - ${u.username} (${u.email || 'sin email'})`);
        });
        console.log('');
      }
      
      process.exit(1);
    }

    // Mostrar información del usuario antes de eliminar
    console.log('👤 Usuario encontrado:');
    console.log(`   Username: ${user.username}`);
    console.log(`   Nombre: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Verificado: ${user.verified ? '✅ Sí' : '❌ No'}`);
    console.log(`   Creado: ${user.createdAt.toLocaleString('es-ES')}`);
    console.log('');

    // Eliminar
    await User.deleteOne({ email });
    console.log(`✅ Usuario con email "${email}" eliminado exitosamente\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Desconectado de MongoDB\n');
    process.exit(0);
  }
};

// Obtener el email de los argumentos de línea de comandos
const email = process.argv[2];
deleteByEmail(email);
