const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate Access Token
 * @param {Object} user User object
 * @returns {string} Access token
 */
const generateAccessToken = (user) => {
  const payload = {
    user_id: user.id,
    role: user.role,
    nama_user: user.username
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION || '60m',
    algorithm: 'HS256'
  });
};

/**
 * Generate Refresh Token
 * @param {Object} user User object
 * @returns {Object} Object containing token and expiresAt date
 */
const generateRefreshToken = (user) => {
  const jti = crypto.randomUUID();
  const payload = {
    user_id: user.id,
    jti
  };

  const token = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      algorithm: 'HS256'
    }
  );

  // Derive expiration days for DB calculation
  // Default to 7 if parsing fails
  const DEFAULT_REFRESH_DAYS = 7;
  const refreshExpiration = process.env.JWT_REFRESH_EXPIRATION || '7d';
  const days = parseInt(refreshExpiration) || DEFAULT_REFRESH_DAYS;

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  return {
    token,
    expiresAt,
    jti
  };
};

/**
 * Generate Generic Token (for forget password, verify email, etc.)
 * @param {Object} payload Token payload
 * @param {string} secret Secret key
 * @param {string|number} expiresIn Expiration time (e.g. '1h', '1d', 3600)
 * @returns {string} Token
 */
const generateGenericToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, {
    expiresIn,
    algorithm: 'HS256'
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateGenericToken
};
