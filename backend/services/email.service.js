import { Resend } from 'resend';

// Función para obtener la instancia de Resend (lazy loading)
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey || apiKey.includes('TU_API_KEY_AQUI')) {
    throw new Error('RESEND_API_KEY no está configurada correctamente en .env');
  }
  
  return new Resend(apiKey);
};

const EMAIL_FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';

/**
 * Enviar email de verificación de cuenta
 */
export const sendVerificationEmail = async (email, token, userName) => {
  try {
    const resend = getResend();
    const verificationUrl = `${FRONTEND_URL}/verify/${token}`;
    
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: '🔐 Verifica tu cuenta - Hotel System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificación de Cuenta</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏨 Hotel System</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-top: 0;">¡Hola ${userName}! 👋</h2>
            
            <p style="font-size: 16px; color: #555;">
              Gracias por registrarte en nuestro sistema de gestión hotelera. 
              Para completar tu registro, por favor verifica tu cuenta haciendo clic en el botón de abajo:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 50px; 
                        font-weight: bold; 
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                ✅ Verificar Mi Cuenta
              </a>
            </div>
            
            <div style="background: #fff; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>⏰ Importante:</strong> Este enlace expirará en <strong>24 horas</strong>.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:
            </p>
            <div style="background: #e9ecef; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #495057;">
              ${verificationUrl}
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              Si no solicitaste esta verificación, puedes ignorar este correo de forma segura.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Hotel System. Todos los derechos reservados.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Error al enviar email de verificación:', error);
      throw error;
    }

    console.log('✅ Email de verificación enviado:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en sendVerificationEmail:', error);
    throw error;
  }
};

/**
 * Enviar email de recuperación de contraseña
 */
export const sendPasswordResetEmail = async (email, token, userName) => {
  try {
    const resend = getResend();
    const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;
    
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: '🔑 Recuperación de Contraseña - Hotel System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperación de Contraseña</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏨 Hotel System</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #f5576c; margin-top: 0;">Recuperación de Contraseña 🔐</h2>
            
            <p style="font-size: 16px; color: #555;">
              Hola <strong>${userName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #555;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta. 
              Haz clic en el botón de abajo para crear una nueva contraseña:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 50px; 
                        font-weight: bold; 
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                🔑 Restablecer Contraseña
              </a>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⏰ Importante:</strong> Este enlace expirará en <strong>1 hora</strong> por seguridad.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:
            </p>
            <div style="background: #e9ecef; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #495057;">
              ${resetUrl}
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <div style="background: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545;">
              <p style="margin: 0; color: #721c24; font-size: 13px;">
                <strong>🚨 ¿No solicitaste esto?</strong><br>
                Si no solicitaste restablecer tu contraseña, ignora este correo. 
                Tu cuenta permanecerá segura y nadie podrá acceder a ella.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Hotel System. Todos los derechos reservados.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Error al enviar email de recuperación:', error);
      throw error;
    }

    console.log('✅ Email de recuperación enviado:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en sendPasswordResetEmail:', error);
    throw error;
  }
};

/**
 * Enviar email de confirmación de cambio de contraseña
 */
export const sendPasswordChangedEmail = async (email, userName) => {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: email,
      subject: '✅ Tu contraseña ha sido cambiada - Hotel System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contraseña Cambiada</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🏨 Hotel System</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 20px;">
              <div style="background: #d4edda; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">✅</span>
              </div>
            </div>
            
            <h2 style="color: #38ef7d; margin-top: 0; text-align: center;">¡Contraseña Actualizada!</h2>
            
            <p style="font-size: 16px; color: #555;">
              Hola <strong>${userName}</strong>,
            </p>
            
            <p style="font-size: 16px; color: #555;">
              Te confirmamos que la contraseña de tu cuenta ha sido cambiada exitosamente.
            </p>
            
            <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; border-left: 4px solid #17a2b8; margin: 20px 0;">
              <p style="margin: 0; color: #0c5460; font-size: 14px;">
                <strong>🕐 Fecha y hora:</strong> ${new Date().toLocaleString('es-ES', { 
                  dateStyle: 'full', 
                  timeStyle: 'short' 
                })}
              </p>
            </div>
            
            <p style="font-size: 16px; color: #555;">
              Ahora puedes iniciar sesión con tu nueva contraseña.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${FRONTEND_URL}" 
                 style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); 
                        color: white; 
                        padding: 15px 40px; 
                        text-decoration: none; 
                        border-radius: 50px; 
                        font-weight: bold; 
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                🔓 Iniciar Sesión
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <div style="background: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545;">
              <p style="margin: 0; color: #721c24; font-size: 13px;">
                <strong>🚨 ¿No fuiste tú?</strong><br>
                Si no realizaste este cambio, tu cuenta puede estar comprometida. 
                Por favor, contacta inmediatamente con el administrador del sistema.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Hotel System. Todos los derechos reservados.</p>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Error al enviar email de confirmación:', error);
      throw error;
    }

    console.log('✅ Email de confirmación enviado:', data);
    return data;
  } catch (error) {
    console.error('❌ Error en sendPasswordChangedEmail:', error);
    throw error;
  }
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail
};
