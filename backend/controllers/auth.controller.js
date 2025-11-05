import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import User from '../models/User.model.js';
import emailService from '../services/email.service.js';

const { sendVerificationEmail, sendPasswordResetEmail, sendPasswordChangedEmail } = emailService;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username, active: true });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        hotel: user.hotel,
        verified: user.verified || false
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, name, email, role } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Verificar si el email ya está en uso
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }
    }

    const user = await User.create({
      username,
      password,
      name,
      email,
      role: role || 'empleado',
      verified: !email // Si no hay email, se marca como verificado automáticamente
    });

    // Si hay email, generar token de verificación
    if (email) {
      const verificationToken = user.createVerificationToken();
      await user.save();
      
      // Enviar email de verificación con Resend
      try {
        await sendVerificationEmail(email, verificationToken, name || username);
        console.log(`✅ Email de verificación enviado a ${email}`);
      } catch (emailError) {
        console.error('❌ Error al enviar email de verificación:', emailError);
        // No fallar el registro si el email falla
        console.log(`⚠️ Token de verificación (fallback): ${verificationToken}`);
      }
    }

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        verified: user.verified
      },
      message: email ? 'Usuario creado. Por favor verifica tu email.' : 'Usuario creado exitosamente.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Actualizar perfil del usuario
export const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar nombre
    if (name) {
      user.name = name;
    }

    // Actualizar email
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({ message: 'El email ya está en uso' });
      }
      user.email = email;
      user.verified = false;
      
      // Generar nuevo token de verificación
      const verificationToken = user.createVerificationToken();
      console.log(`Nuevo token de verificación para ${email}: ${verificationToken}`);
    }

    // Cambiar contraseña
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Debes proporcionar la contraseña actual' });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Contraseña actual incorrecta' });
      }

      user.password = newPassword;
    }

    await user.save();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        verified: user.verified
      },
      message: 'Perfil actualizado exitosamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Verificar cuenta con token
export const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;
    
    console.log('\n' + '='.repeat(80));
    console.log('🔍 VERIFICACIÓN DE CUENTA');
    console.log('='.repeat(80));
    console.log('📝 Token recibido:', token);
    console.log('📝 Longitud del token:', token?.length);
    
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log('🔐 Token hasheado:', hashedToken);
    
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    console.log('👤 Usuario encontrado:', user ? `${user.username} (${user.email})` : 'NO ENCONTRADO');
    
    if (!user) {
      // Intentar buscar el usuario con este token sin importar expiración
      const expiredUser = await User.findOne({ verificationToken: hashedToken });
      if (expiredUser) {
        console.log('⚠️  Token encontrado pero EXPIRADO');
        console.log('⏰ Expiró en:', expiredUser.verificationTokenExpires);
        console.log('⏰ Ahora es:', new Date());
      } else {
        console.log('❌ Token no existe en la base de datos');
        // Buscar cualquier usuario con token de verificación pendiente
        const usersWithToken = await User.find({ verificationToken: { $exists: true } }).select('username email verificationToken verificationTokenExpires');
        console.log('📋 Usuarios con token pendiente:', usersWithToken.length);
        if (usersWithToken.length > 0) {
          console.log('Tokens en BD:');
          usersWithToken.forEach(u => {
            console.log(`  - ${u.username}: ${u.verificationToken} (expira: ${u.verificationTokenExpires})`);
          });
        }
      }
      console.log('='.repeat(80) + '\n');
      return res.status(400).json({ message: 'Token de verificación inválido o expirado' });
    }
    
    console.log('✅ Verificación exitosa');
    console.log('='.repeat(80) + '\n');

    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Cuenta verificada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Solicitar reset de contraseña
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'El email es requerido' });
    }

    const user = await User.findOne({ email, active: true });

    if (!user) {
      // Por seguridad, siempre devolver el mismo mensaje
      return res.json({ 
        message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña' 
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    // En desarrollo, SIEMPRE mostrar el enlace en consola
    if (process.env.NODE_ENV === 'development') {
      console.log('\n' + '='.repeat(80));
      console.log('🔑 RECUPERACIÓN DE CONTRASEÑA - MODO DESARROLLO');
      console.log('='.repeat(80));
      console.log('📧 Email:', email);
      console.log('👤 Usuario:', user.name || user.username);
      console.log('🔐 Token:', resetToken);
      console.log('🌐 URL completa:', `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`);
      console.log('⏰ Expira en: 1 hora');
      console.log('='.repeat(80) + '\n');
    }

    // Enviar email de recuperación con Resend
    try {
      await sendPasswordResetEmail(email, resetToken, user.name || user.username);
      console.log(`✅ Email de recuperación enviado a ${email}`);
    } catch (emailError) {
      console.error('❌ Error al enviar email de recuperación:', emailError.message);
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️  NOTA: Usa el enlace mostrado arriba en la consola\n');
      }
    }

    res.json({ 
      message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña',
      // Solo en desarrollo - devolver token y URL
      ...(process.env.NODE_ENV === 'development' && { 
        resetToken,
        resetUrl: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`
      })
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

// Resetear contraseña con token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token de reset inválido o expirado' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Enviar email de confirmación
    if (user.email) {
      try {
        await sendPasswordChangedEmail(user.email, user.name || user.username);
        console.log(`✅ Email de confirmación enviado a ${user.email}`);
      } catch (emailError) {
        console.error('❌ Error al enviar email de confirmación:', emailError);
      }
    }

    res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};
