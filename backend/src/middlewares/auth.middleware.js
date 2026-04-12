const STATUS_CODES = require('../utils/status-code');
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized: missing Authorization header'
      });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized: invalid token format'
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET
    );

    // Simpan user context untuk dipakai controller/service
    req.user = {
      id: payload.user_id || payload.sub || payload.id,
      role: payload.role,
      email: payload.email,
      username: payload.nama_user
    };

    if (!req.user.id) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: 'Unauthorized: invalid token payload'
      });
    }

    return next();
  } catch {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized: invalid or expired token'
    });
  }
}

function authorizeRole(...allowedRoles) {
  return function (req, res, next) {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: 'Forbidden: Insufficient permissions. Admin role required.'
      });
    }
    return next();
  };
}

module.exports = {
  authMiddleware,
  authorizeRole
};
