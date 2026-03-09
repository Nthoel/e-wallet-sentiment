const bcrypt = require('bcrypt');
const { prisma } = require('e-wallet-sentiment-database');
const ApiError = require('../../utils/api-error');
const crypto = require('crypto');

const SALT_ROUNDS = 10;

const register = async ({ username, email, password }) => {
  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw ApiError.conflict('Email already registered');
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } });
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

module.exports = { register };
