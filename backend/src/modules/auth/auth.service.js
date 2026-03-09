const bcrypt = require('bcrypt');
const { prisma } = require('e-wallet-sentiment-database');
const crypto = require('crypto');
const ApiError = require('../../utils/api-error');

const {
  generateAccessToken,
  generateRefreshToken
} = require('../../utils/token');

const SALT_ROUNDS = 10;

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

const register = async ({ username, email, password }) => {
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw ApiError.conflict('Email already registered');
  }

  const existingUsername = await prisma.user.findUnique({
    where: { username }
  });
  if (existingUsername) {
    throw ApiError.conflict('Username already taken');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      email,
      username,
      passwordHash
    }
  });

  return { success: true };
};

module.exports = {
  login,
  register
};
