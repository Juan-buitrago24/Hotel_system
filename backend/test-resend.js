// Script de prueba para verificar la configuración de Resend
import { config } from 'dotenv';
import { sendVerificationEmail } from './services/email.service.js';

// Cargar variables de entorno
config();

const testEmail = async () => {
  console.log('🧪 Probando configuración de Resend...\n');

  // Verificar que la API Key esté configurada
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ ERROR: RESEND_API_KEY no está configurada en .env');
    console.log('\n📝 Por favor:');
    console.log('1. Ve a https://resend.com y crea una cuenta');
    console.log('2. Obtén tu API Key del dashboard');
    console.log('3. Agrega RESEND_API_KEY=tu_key_aqui en el archivo .env');
    process.exit(1);
  }

  if (process.env.RESEND_API_KEY.includes('TU_API_KEY_AQUI') || 
      process.env.RESEND_API_KEY === 're_123456789_TU_API_KEY_AQUI') {
    console.error('❌ ERROR: Necesitas reemplazar RESEND_API_KEY con tu API Key real');
    console.log('\n📝 Pasos:');
    console.log('1. Ve a https://resend.com/api-keys');
    console.log('2. Crea una nueva API Key');
    console.log('3. Copia la key y reemplázala en .env');
    process.exit(1);
  }

  console.log('✅ API Key configurada');
  console.log(`📧 Remitente: ${process.env.EMAIL_FROM || 'onboarding@resend.dev'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5174'}\n`);

  // Pedir email de destino
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('📮 Ingresa tu email para recibir un email de prueba: ', async (email) => {
    if (!email || !email.includes('@')) {
      console.error('❌ Email inválido');
      rl.close();
      process.exit(1);
    }

    try {
      console.log(`\n📤 Enviando email de prueba a ${email}...`);
      
      const token = 'test_token_' + Math.random().toString(36).substring(7);
      await sendVerificationEmail(email, token, 'Usuario de Prueba');

      console.log('\n✅ ¡Email enviado exitosamente!');
      console.log('\n📬 Revisa tu bandeja de entrada (y spam) en unos segundos.');
      console.log(`🔗 Token de prueba: ${token}`);
      console.log(`🔗 URL de verificación: ${process.env.FRONTEND_URL || 'http://localhost:5174'}/verify/${token}`);
      
      console.log('\n💡 Tip: Revisa el dashboard de Resend para ver el estado del email:');
      console.log('   https://resend.com/emails');
      
    } catch (error) {
      console.error('\n❌ Error al enviar email:', error.message);
      
      if (error.message.includes('API key')) {
        console.log('\n📝 Verifica que tu API Key sea correcta');
      } else if (error.message.includes('Invalid')) {
        console.log('\n📝 Verifica el formato del email remitente en EMAIL_FROM');
      } else {
        console.log('\n📝 Detalles del error:', error);
      }
    } finally {
      rl.close();
      process.exit(0);
    }
  });
};

testEmail();
