import dotenv from 'dotenv';
import { Resend } from 'resend';

dotenv.config();

const testResend = async () => {
  console.log('🧪 Probando servicio de Resend...\n');

  const apiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;

  if (!apiKey) {
    console.log('❌ RESEND_API_KEY no está configurada en .env');
    return;
  }

  console.log('✅ API Key encontrada:', apiKey.substring(0, 10) + '...');
  console.log('✅ Email From:', emailFrom);

  try {
    const resend = new Resend(apiKey);

    // Intentar enviar un email de prueba
    const email = 'jsbuitrago801@gmail.com'; // Tu email verificado en Resend
    
    console.log(`\n📧 Intentando enviar email de prueba a: ${email}`);
    
    const { data, error } = await resend.emails.send({
      from: emailFrom,
      to: email,
      subject: '🧪 Test de Resend - Hotel System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2563eb;">✅ Test de Resend Exitoso</h2>
          <p>Este es un email de prueba del sistema de Hotel Management.</p>
          <p>Si recibiste este email, significa que Resend está configurado correctamente.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            Enviado desde: ${emailFrom}<br>
            Fecha: ${new Date().toLocaleString('es-CO')}
          </p>
        </div>
      `
    });

    if (error) {
      console.log('\n❌ Error al enviar email:');
      console.log(error);
      
      if (error.message && error.message.includes('Missing required provider authorization')) {
        console.log('\n⚠️  PROBLEMA DETECTADO:');
        console.log('Tu API key de Resend necesita ser verificada o regenerada.');
        console.log('\nPasos para solucionar:');
        console.log('1. Ve a https://resend.com/api-keys');
        console.log('2. Verifica que tu dominio esté verificado');
        console.log('3. O usa el email de testing: onboarding@resend.dev');
        console.log('4. Si el problema persiste, genera una nueva API key');
      }
      
      return;
    }

    console.log('\n✅ ¡Email enviado exitosamente!');
    console.log('ID del email:', data.id);
    console.log('\n📬 Revisa tu bandeja de entrada (y spam) en:', email);

  } catch (error) {
    console.log('\n❌ Error inesperado:');
    console.log(error.message);
  }
};

testResend();
