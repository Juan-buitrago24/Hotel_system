import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from './models/User.model.js';
import Hotel from './models/Hotel.model.js';
import Plan from './models/Plan.model.js';

// Obtener el directorio actual en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno desde el archivo .env
dotenv.config({ path: join(__dirname, '.env') });

const listAllUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    const users = await User.find({})
      .select('-password -verificationToken -resetPasswordToken -verificationTokenExpires -resetPasswordExpires')
      .populate('hotel', 'name')
      .populate('plan', 'name price');

    console.log('📋 TODOS LOS USUARIOS EN LA BASE DE DATOS:\n');
    console.log(`Total: ${users.length} usuarios\n`);
    console.log('='.repeat(80));

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. 👤 ${user.username}`);
      console.log(`   📧 Email: ${user.email || 'N/A'}`);
      console.log(`   🏷️  Rol: ${user.role}`);
      console.log(`   🏨 Hotel: ${user.hotel?.name || user.hotel || 'N/A'}`);
      console.log(`   📋 Plan: ${user.plan?.name || 'Sin plan'} ${user.plan ? `($${user.plan.price}/mes)` : ''}`);
      console.log(`   💳 Suscripción: ${user.subscriptionStatus || 'N/A'}`);
      console.log(`   ✓  Verificado: ${user.verified ? 'Sí ✅' : 'No ❌'}`);
      console.log(`   🔓 Activo: ${user.active ? 'Sí ✅' : 'No ❌'}`);
      console.log(`   📅 Nombre: ${user.name || 'N/A'}`);
      console.log(`   📞 Teléfono: ${user.phone || 'N/A'}`);
      console.log(`   🆔 ID: ${user._id}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n📊 RESUMEN POR ROL:');
    const roleCount = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    Object.entries(roleCount).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} usuario${count !== 1 ? 's' : ''}`);
    });

    console.log('\n📊 RESUMEN POR ESTADO:');
    const verified = users.filter(u => u.verified).length;
    const active = users.filter(u => u.active).length;
    console.log(`   Verificados: ${verified}/${users.length}`);
    console.log(`   Activos: ${active}/${users.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

listAllUsers();
