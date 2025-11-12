import { Resend } from 'resend';

// Lazy initialization de Resend
let resend;
const getResendInstance = () => {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

// Enviar mensaje de contacto
export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validación básica
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'Nombre, email y mensaje son requeridos' 
      });
    }

    // Verificar que Resend esté configurado
    const resendInstance = getResendInstance();
    if (!resendInstance) {
      console.error('RESEND_API_KEY no está configurado');
      return res.status(500).json({ 
        message: 'Servicio de email no configurado' 
      });
    }

    // Enviar email al equipo de Hotel Manager
    const { data, error } = await resendInstance.emails.send({
      from: process.env.EMAIL_FROM,
      to: 'soporte@hotelmanager.com', // Cambia esto por tu email real
      replyTo: email,
      subject: `Nuevo mensaje de contacto: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Nuevo Mensaje de Contacto</h2>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Mensaje:</h3>
            <p style="color: #4b5563; line-height: 1.6;">${message}</p>
          </div>
          <hr style="border: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Este mensaje fue enviado desde el formulario de contacto de Hotel Manager
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Error enviando email:', error);
      return res.status(400).json({ 
        message: 'Error al enviar el mensaje',
        error: error.message 
      });
    }

    // Enviar confirmación al usuario
    await resendInstance.emails.send({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Gracias por contactarnos - Hotel Manager',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #2563eb, #9333ea); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">🏨 Hotel Manager</h1>
          </div>
          <div style="padding: 40px; background-color: #ffffff;">
            <h2 style="color: #1f2937;">¡Gracias por contactarnos, ${name}!</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Hemos recibido tu mensaje y nuestro equipo se pondrá en contacto contigo 
              en las próximas 24-48 horas.
            </p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Tu mensaje:</h3>
              <p style="color: #6b7280;">${message}</p>
            </div>
            <p style="color: #4b5563;">
              Mientras tanto, puedes explorar nuestros planes de suscripción en nuestra 
              <a href="${process.env.FRONTEND_URL}" style="color: #2563eb;">página web</a>.
            </p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              © 2025 Hotel Manager. Todos los derechos reservados.
            </p>
          </div>
        </div>
      `
    });

    res.json({
      message: 'Mensaje enviado exitosamente',
      data
    });

  } catch (error) {
    console.error('Error en sendContactMessage:', error);
    res.status(500).json({ 
      message: 'Error al procesar el mensaje',
      error: error.message 
    });
  }
};
