import Room from '../models/Room.model.js';
import Reservation from '../models/Reservation.model.js';
import User from '../models/User.model.js';

export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    // 1. Estadísticas de Habitaciones
    const totalRooms = await Room.countDocuments();
    const availableRooms = await Room.countDocuments({ status: 'Disponible' });
    const occupiedRooms = await Room.countDocuments({ status: 'Ocupada' });
    const maintenanceRooms = await Room.countDocuments({ status: 'Mantenimiento' });
    const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : 0;

    // 2. Estadísticas de Reservas
    const activeReservations = await Reservation.countDocuments({
      status: { $in: ['Confirmada', 'En Curso'] }
    });

    const todayReservations = await Reservation.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const monthReservations = await Reservation.countDocuments({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    // 3. Ingresos
    const monthRevenueData = await Reservation.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $ne: 'Cancelada' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);
    const monthRevenue = monthRevenueData.length > 0 ? monthRevenueData[0].total : 0;

    const todayRevenueData = await Reservation.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: { $ne: 'Cancelada' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);
    const todayRevenue = todayRevenueData.length > 0 ? todayRevenueData[0].total : 0;

    // 4. Check-ins y Check-outs próximos (hoy y mañana)
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endOfTomorrow = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59);

    const upcomingCheckIns = await Reservation.find({
      checkIn: { $gte: startOfDay, $lte: endOfTomorrow },
      status: { $in: ['Confirmada', 'Pendiente'] }
    })
      .populate('room', 'roomNumber type')
      .populate('guest', 'name')
      .sort({ checkIn: 1 })
      .limit(5);

    const upcomingCheckOuts = await Reservation.find({
      checkOut: { $gte: startOfDay, $lte: endOfTomorrow },
      status: 'En Curso'
    })
      .populate('room', 'roomNumber type')
      .populate('guest', 'name')
      .sort({ checkOut: 1 })
      .limit(5);

    // 5. Usuarios registrados
    const totalUsers = await User.countDocuments();

    // 6. Habitaciones más reservadas (top 5 del mes)
    const topRooms = await Reservation.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $ne: 'Cancelada' }
        }
      },
      {
        $group: {
          _id: '$room',
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'rooms',
          localField: '_id',
          foreignField: '_id',
          as: 'roomInfo'
        }
      },
      { $unwind: '$roomInfo' }
    ]);

    // 7. Tendencia de reservas (últimos 7 días)
    const last7Days = new Date(now);
    last7Days.setDate(last7Days.getDate() - 7);

    const reservationTrend = await Reservation.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days, $lte: now }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      rooms: {
        total: totalRooms,
        available: availableRooms,
        occupied: occupiedRooms,
        maintenance: maintenanceRooms,
        occupancyRate: parseFloat(occupancyRate)
      },
      reservations: {
        active: activeReservations,
        today: todayReservations,
        month: monthReservations
      },
      revenue: {
        today: todayRevenue,
        month: monthRevenue
      },
      upcomingCheckIns: upcomingCheckIns.map(res => ({
        id: res._id,
        room: res.room?.roomNumber || 'N/A',
        roomType: res.room?.type || 'N/A',
        guest: res.guest?.name || res.guestName,
        checkIn: res.checkIn,
        status: res.status
      })),
      upcomingCheckOuts: upcomingCheckOuts.map(res => ({
        id: res._id,
        room: res.room?.roomNumber || 'N/A',
        roomType: res.room?.type || 'N/A',
        guest: res.guest?.name || res.guestName,
        checkOut: res.checkOut,
        status: res.status
      })),
      users: {
        total: totalUsers
      },
      topRooms: topRooms.map(item => ({
        roomNumber: item.roomInfo.roomNumber,
        type: item.roomInfo.type,
        reservations: item.count,
        revenue: item.revenue
      })),
      reservationTrend: reservationTrend.map(item => ({
        date: item._id,
        count: item.count,
        revenue: item.revenue
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
  }
};
