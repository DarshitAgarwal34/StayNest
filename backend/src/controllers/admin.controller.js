import UserModel from '../models/user.model.js';
import { query } from '../db/connection.js';

const countSingle = async (sql, params = []) => {
  const rows = await query(sql, params);
  return Number(rows[0]?.count || 0);
};

export const getAdminOverview = async (req, res, next) => {
  try {
    const [
      totalUsers,
      students,
      renters,
      serviceProviders,
      admins,
      totalProperties,
      totalServices,
      totalPosts,
      totalComments,
      unreadNotifications,
    ] = await Promise.all([
      countSingle('SELECT COUNT(*) AS count FROM users'),
      countSingle("SELECT COUNT(*) AS count FROM users WHERE role = 'student'"),
      countSingle("SELECT COUNT(*) AS count FROM users WHERE role = 'renter'"),
      countSingle("SELECT COUNT(*) AS count FROM users WHERE role = 'service_provider'"),
      countSingle("SELECT COUNT(*) AS count FROM users WHERE role = 'admin'"),
      countSingle('SELECT COUNT(*) AS count FROM properties'),
      countSingle('SELECT COUNT(*) AS count FROM services'),
      countSingle('SELECT COUNT(*) AS count FROM posts'),
      countSingle('SELECT COUNT(*) AS count FROM comments'),
      countSingle('SELECT COUNT(*) AS count FROM notifications WHERE is_read = 0'),
    ]);

    const users = await UserModel.findAll();

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalUsers,
          students,
          renters,
          serviceProviders,
          admins,
          totalProperties,
          totalServices,
          totalListings: totalProperties + totalServices,
          totalPosts,
          totalComments,
          unreadNotifications,
        },
        usersByRole: {
          student: users.filter((user) => user.role === 'student'),
          renter: users.filter((user) => user.role === 'renter'),
          service_provider: users.filter((user) => user.role === 'service_provider'),
          admin: users.filter((user) => user.role === 'admin'),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
