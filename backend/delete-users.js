// Script para eliminar usuarios de la base de datos
// Útil para desarrollo y testing
import { config } from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.model.js';
import readline from 'readline';

// Cargar variables de entorno
config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/HotelSystem';
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB\n');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

const listUsers = async () => {
  const users = await User.find({}).select('username name email role verified createdAt');
  
  if (users.length === 0) {
    console.log('📭 No hay usuarios en la base de datos\n');
    return [];
  }

  console.log('👥 Usuarios en la base de datos:\n');
  users.forEach((user, index) => {
    console.log(`${index + 1}. 👤 ${user.username}`);
    console.log(`   Nombre: ${user.name}`);
    console.log(`   Email: ${user.email || 'Sin email'}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Verificado: ${user.verified ? '✅ Sí' : '❌ No'}`);
    console.log(`   Creado: ${user.createdAt.toLocaleString('es-ES')}`);
    console.log('');
  });

  return users;
};

const deleteUser = async (username) => {
  const user = await User.findOne({ username });
  
  if (!user) {
    console.log(`❌ No se encontró el usuario "${username}"\n`);
    return false;
  }

  await User.deleteOne({ username });
  console.log(`✅ Usuario "${username}" eliminado exitosamente\n`);
  return true;
};

const deleteAllUsers = async () => {
  const result = await User.deleteMany({});
  console.log(`✅ ${result.deletedCount} usuario(s) eliminado(s)\n`);
};

const main = async () => {
  try {
    await connectDB();

    console.log('🗑️  GESTOR DE USUARIOS - DESARROLLO\n');
    console.log('='.repeat(50));
    console.log('');

    const users = await listUsers();

    if (users.length === 0) {
      console.log('No hay usuarios para eliminar.');
      rl.close();
      process.exit(0);
    }

    console.log('¿Qué deseas hacer?');
    console.log('1. Eliminar un usuario específico');
    console.log('2. Eliminar TODOS los usuarios');
    console.log('3. Salir sin hacer cambios');
    console.log('');

    const choice = await question('Elige una opción (1-3): ');

    switch (choice.trim()) {
      case '1': {
        const username = await question('\n📝 Ingresa el username del usuario a eliminar: ');
        const confirm = await question(`⚠️  ¿Estás seguro de eliminar "${username}"? (si/no): `);
        
        if (confirm.toLowerCase() === 'si' || confirm.toLowerCase() === 's') {
          await deleteUser(username.trim());
        } else {
          console.log('❌ Operación cancelada\n');
        }
        break;
      }

      case '2': {
        const confirm = await question('\n⚠️  ¿ESTÁS SEGURO de eliminar TODOS los usuarios? (si/no): ');
        
        if (confirm.toLowerCase() === 'si' || confirm.toLowerCase() === 's') {
          const doubleConfirm = await question('⚠️  Esta acción no se puede deshacer. Escribe "ELIMINAR TODO" para confirmar: ');
          
          if (doubleConfirm === 'ELIMINAR TODO') {
            await deleteAllUsers();
          } else {
            console.log('❌ Operación cancelada (confirmación incorrecta)\n');
          }
        } else {
          console.log('❌ Operación cancelada\n');
        }
        break;
      }

      case '3':
        console.log('👋 Saliendo sin hacer cambios\n');
        break;

      default:
        console.log('❌ Opción inválida\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
    await mongoose.connection.close();
    console.log('👋 Desconectado de MongoDB');
    process.exit(0);
  }
};

// Ejecutar
main();
