import Hotel from '../models/Hotel.model.js';
import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

/**
 * Registrar un nuevo hotel con su administrador
 * POST /api/hotels/register
 * Público (no requiere autenticación)
 */
export const registerHotel = async (req, res) => {
  try {
    const { 
      hotelName, 
      address, 
      city, 
      country, 
      phone, 
      email, 
      plan,
      adminName, 
      adminEmail, 
      adminUsername, 
      adminPassword,
      adminPhone 
    } = req.body;

    // Validar campos requeridos
    if (!hotelName || !adminName || !adminEmail || !adminUsername || !adminPassword) {
      return res.status(400).json({ 
        message: 'Todos los campos obligatorios son requeridos' 
      });
    }

    // Verificar si el username ya existe
    const existingUser = await User.findOne({ username: adminUsername });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'El nombre de usuario ya está en uso' 
      });
    }

    // Verificar si el email ya existe
    const existingEmail = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ 
        message: 'El email ya está registrado' 
      });
    }

    // Generar slug único para el hotel
    let slug = hotelName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    let slugExists = await Hotel.findOne({ slug });
    let counter = 1;
    
    while (slugExists) {
      slug = `${slug}-${counter}`;
      slugExists = await Hotel.findOne({ slug });
      counter++;
    }

    // Crear el hotel con toda la información
    const hotel = await Hotel.create({
      name: hotelName,
      slug,
      plan: plan || 'free',
      active: true,
      contact: {
        email: email || adminEmail,
        phone: phone || adminPhone || '',
        address: address || '',
        city: city || '',
        country: country || 'Colombia'
      }
    });

    // Crear el administrador del hotel (el middleware pre('save') hasheará la contraseña)
    const admin = new User({
      username: adminUsername,
      name: adminName,
      email: adminEmail.toLowerCase(),
      phone: adminPhone || '',
      password: adminPassword, // Sin hashear, el middleware lo hará
      hotel: hotel._id,
      role: 'hotel_admin',  // Administrador del hotel
      verified: true,      // Por ahora lo dejamos verificado para facilitar pruebas
      active: true
    });

    // Guardar sin triggerar el middleware de hash nuevamente
    await admin.save();

    res.status(201).json({
      message: 'Hotel registrado exitosamente.',
      hotel: {
        id: hotel._id,
        name: hotel.name,
        slug: hotel.slug,
        plan: hotel.plan
      },
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        name: admin.name
      }
    });

  } catch (error) {
    console.error('Error en registerHotel:', error);
    res.status(500).json({ message: 'Error al registrar el hotel' });
  }
};

/**
 * Obtener todos los hoteles (solo super_admin)
 * GET /api/hotels
 */
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({}).sort({ createdAt: -1 });

    // Obtener estadísticas de cada hotel
    const hotelsWithStats = await Promise.all(
      hotels.map(async (hotel) => {
        const stats = await hotel.getStats();
        return {
          id: hotel._id,
          name: hotel.name,
          slug: hotel.slug,
          plan: hotel.plan,
          active: hotel.active,
          createdAt: hotel.createdAt,
          contact: hotel.contact,
          stats
        };
      })
    );

    res.json(hotelsWithStats);
  } catch (error) {
    console.error('Error en getAllHotels:', error);
    res.status(500).json({ message: 'Error al obtener los hoteles' });
  }
};

/**
 * Obtener un hotel por ID
 * GET /api/hotels/:id
 */
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }

    const stats = await hotel.getStats();

    res.json({
      id: hotel._id,
      name: hotel.name,
      slug: hotel.slug,
      domain: hotel.domain,
      settings: hotel.settings,
      plan: hotel.plan,
      contact: hotel.contact,
      active: hotel.active,
      createdAt: hotel.createdAt,
      stats
    });
  } catch (error) {
    console.error('Error en getHotelById:', error);
    res.status(500).json({ message: 'Error al obtener el hotel' });
  }
};

/**
 * Obtener el hotel actual del usuario
 * GET /api/hotels/current
 */
export const getCurrentHotel = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('hotel');

    if (!user.hotel) {
      return res.status(404).json({ message: 'Usuario sin hotel asignado' });
    }

    const stats = await user.hotel.getStats();

    res.json({
      id: user.hotel._id,
      name: user.hotel.name,
      slug: user.hotel.slug,
      settings: user.hotel.settings,
      plan: user.hotel.plan,
      contact: user.hotel.contact,
      stats
    });
  } catch (error) {
    console.error('Error en getCurrentHotel:', error);
    res.status(500).json({ message: 'Error al obtener el hotel' });
  }
};

/**
 * Actualizar un hotel
 * PUT /api/hotels/:id
 */
export const updateHotel = async (req, res) => {
  try {
    const { name, settings, contact, plan, active } = req.body;

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }

    // Actualizar campos permitidos
    if (name) hotel.name = name;
    if (settings) hotel.settings = { ...hotel.settings, ...settings };
    if (contact) hotel.contact = { ...hotel.contact, ...contact };
    if (plan) hotel.plan = plan;
    if (typeof active !== 'undefined') hotel.active = active;

    await hotel.save();

    res.json({
      message: 'Hotel actualizado exitosamente',
      hotel: {
        id: hotel._id,
        name: hotel.name,
        slug: hotel.slug,
        settings: hotel.settings,
        plan: hotel.plan,
        active: hotel.active
      }
    });
  } catch (error) {
    console.error('Error en updateHotel:', error);
    res.status(500).json({ message: 'Error al actualizar el hotel' });
  }
};

/**
 * Eliminar un hotel (solo super_admin)
 * DELETE /api/hotels/:id
 */
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel no encontrado' });
    }

    // En lugar de eliminar, desactivar
    hotel.active = false;
    await hotel.save();

    res.json({ message: 'Hotel desactivado exitosamente' });
  } catch (error) {
    console.error('Error en deleteHotel:', error);
    res.status(500).json({ message: 'Error al eliminar el hotel' });
  }
};
