const { prisma } = require('e-wallet-sentiment-database');

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

module.exports = {
  getProfileByUserId
};
