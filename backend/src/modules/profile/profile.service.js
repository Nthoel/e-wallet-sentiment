const { prisma } = require('e-wallet-sentiment-database');
const ApiError = require('../../utils/api-error');

async function getProfileByUserId(userId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        avatarUrl: true,
        isVerified: true,
        verifiedAt: true,
        lastLoginAt: true,
        createdAt: true
      }
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isVerified: user.isVerified,
      verifiedAt: user.verifiedAt,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt
    };
  } catch (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`, {
      cause: error
    });
  }
}

async function updateProfileByUserId(userId, payload) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true
    }
  });

  if (!user) {
    return null;
  }

  const updateData = {};

  if (payload.email !== undefined && payload.email !== user.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: payload.email },
      select: { id: true }
    });

    if (existingEmail && existingEmail.id !== userId) {
      throw ApiError.conflict('Email already registered');
    }

    updateData.email = payload.email;
  }

  if (payload.username !== undefined && payload.username !== user.username) {
    const existingUsername = await prisma.user.findUnique({
      where: { username: payload.username },
      select: { id: true }
    });

    if (existingUsername && existingUsername.id !== userId) {
      throw ApiError.conflict('Username already taken');
    }

    updateData.username = payload.username;
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      avatarUrl: true,
      updatedAt: true
    }
  });

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    username: updatedUser.username,
    role: updatedUser.role,
    avatarUrl: updatedUser.avatarUrl,
    updatedAt: updatedUser.updatedAt
  };
}

module.exports = {
  getProfileByUserId,
  updateProfileByUserId
};
