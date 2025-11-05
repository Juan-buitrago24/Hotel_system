import User from '../models/User.model.js';
import { sendVerificationEmail } from '../services/email.service.js';

export const getUsers = async (req, res) => {
  try {
    // Filtrar por hotel del usuario autenticado (excepto admin_global)
    const filter = req.user.role === 'admin_global' ? {} : { hotel: req.user.hotel };
    const users = await User.find(filter).select('-password').populate('hotel', 'name');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password, name, email, phone, role } = req.body;

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

    // Validar rol - hotel_admin solo puede crear empleados
    const validRoles = ['hotel_admin', 'empleado', 'cliente'];
    const userRole = role || 'empleado';
    
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    // hotel_admin solo puede crear empleados
    if (req.user.role === 'hotel_admin' && userRole !== 'empleado') {
      return res.status(403).json({ message: 'Solo puedes crear empleados' });
    }

    // Asignar el hotel del usuario autenticado (excepto admin_global)
    const userData = {
      username,
      password,
      name,
      email,
      phone,
      role: userRole,
      verified: !email // Si no hay email, se marca como verificado
    };

    // Solo asignar hotel si el usuario no es admin_global
    if (req.user.role !== 'admin_global' && req.user.hotel) {
      userData.hotel = req.user.hotel;
    }

    const user = await User.create(userData);

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

    // Buscar el usuario
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validar que hotel_admin solo edite empleados de su hotel
    if (req.user.role === 'hotel_admin') {
      if (user.hotel.toString() !== req.user.hotel.toString()) {
        return res.status(403).json({ message: 'No puedes editar empleados de otro hotel' });
      }
      if (user.role !== 'empleado') {
        return res.status(403).json({ message: 'Solo puedes editar empleados' });
      }
    }

    // Actualizar campos
    Object.keys(updateData).forEach(key => {
      user[key] = updateData[key];
    });

    // Si se proporciona nueva contraseña, actualizarla
    if (password) {
      user.password = password; // El pre-save hook del modelo la hasheará
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
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

    // Validar que hotel_admin solo elimine empleados de su hotel
    if (req.user.role === 'hotel_admin') {
      if (user.hotel.toString() !== req.user.hotel.toString()) {
        return res.status(403).json({ message: 'No puedes eliminar empleados de otro hotel' });
      }
      if (user.role !== 'empleado') {
        return res.status(403).json({ message: 'Solo puedes eliminar empleados' });
      }
    }

    // Eliminar permanentemente (puedes cambiar a desactivar si prefieres)
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};
