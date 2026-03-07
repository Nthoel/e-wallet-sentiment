const bcrypt = require('bcryptjs');
const { prisma } = require('e-wallet-sentiment-database');
const crypto = require('crypto');
const ApiError = require('../../utils/api-error');

const { generateAccessToken, generateRefreshToken } = require('../../utils/token');

const login = async credentials => {
  const { username, email, password } = credentials;

  const orConditions = [];
  if (username) {
    orConditions.push({ username });
  }
  if (email) {
    orConditions.push({ email });
  }

  // Prepare query conditions
  const where = {};
  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  // Find user by username or email
  const user = await prisma.user.findFirst({ where });

  if (!user) {
    throw ApiError.unauthorized('Email/Username atau password salah');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Email/Username atau password salah');
  }

  // Generate tokens using utility
  const accessToken = generateAccessToken(user);
  const { token: refreshToken, expiresAt } = generateRefreshToken(user);

  // Hash refresh token for DB storage
  const tokenHash = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash,
      isRevoked: false,
      expiresAt
    }
  });

  return {
    access_token: accessToken,
    refresh_token: refreshToken
  };
};

module.exports = {
  login
};
