import User from '../models/User.model.js';
import { sendVerificationEmail } from '../services/email.service.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;

    // Validaciones
    if (!username || !password || !name) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }
    }

    // Validar rol
    const validRoles = ['admin', 'empleado', 'cliente'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    const user = await User.create({
      username,
      password,
      name,
      email,
      role: role || 'empleado',
      verified: !email // Si no hay email, se marca como verificado
    });

    // Si hay email, generar token de verificación
    if (email) {
      const verificationToken = user.createVerificationToken();
      await user.save();
      
      try {
        await sendVerificationEmail(email, verificationToken, name || username);
        console.log(`✅ Email de verificación enviado a ${email}`);
      } catch (emailError) {
        console.error('❌ Error al enviar email de verificación:', emailError);
        console.log(`⚠️ Token de verificación: ${verificationToken}`);
      }
    }

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email,
        verified: user.verified
      },
      message: email ? 'Usuario creado. Email de verificación enviado.' : 'Usuario creado exitosamente.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No eliminar, solo desactivar
    await User.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: 'Usuario desactivado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};
