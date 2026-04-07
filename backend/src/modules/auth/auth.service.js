const bcrypt = require('bcrypt');
const { prisma } = require('e-wallet-sentiment-database');
const crypto = require('crypto');
const ApiError = require('../../utils/api-error');
const mailService = require('../../mail');
const {
  generateAccessToken,
  generateRefreshToken
} = require('../../utils/token');

const RESET_TOKEN_BYTES = 32;
const ONE_HOUR_IN_MILLISECONDS = 3600000;
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

  // Update last login timestamp
  await prisma.user.update({
    where: { id: user.id },
    data: {
      lastLoginAt: new Date()
    }
  });

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

/**
 * Service untuk handle forget password
 * Mengirim email reset password jika user terdaftar
 * @param {string} email - Email user
 */
const forgetPassword = async email => {
  // Cek apakah email terdaftar di database
  const user = await prisma.user.findUnique({
    where: { email }
  });

  // Jika email tidak terdaftar, langsung return
  // Tetap return success untuk keamanan (tidak kasih tahu email tidak terdaftar)
  if (!user) {
    return;
  }

  // Generate random token untuk reset password
  const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Set expired 1 jam dari sekarang
  const expiresAt = new Date(Date.now() + ONE_HOUR_IN_MILLISECONDS);

  // Simpan token verification reset password
  // Catatan: di schema project ini tabel verification dimapping sebagai user_tokens
  await prisma.userToken.create({
    data: {
      userId: user.id,
      type: 'PASSWORD_RESET',
      tokenHash: tokenHash,
      expiresAt: expiresAt,
      isUsed: false
    }
  });

  // Buat link reset password
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  // Kirim email berisi link reset password
  await mailService.sendTemplateMail('resetPassword', email, {
    name: user.username,
    resetLink: resetLink
  });
};

module.exports = {
  login,
  register,
  forgetPassword
};
