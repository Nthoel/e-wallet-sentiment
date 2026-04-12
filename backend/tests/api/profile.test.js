require('dotenv').config({ path: '.env.test', override: true });
const request = require('supertest');
const createApp = require('../../src/app');
const { prisma } = require('e-wallet-sentiment-database');
const jwt = require('jsonwebtoken');

jest.mock('e-wallet-sentiment-database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    },
    userToken: {
      create: jest.fn()
    },
    refreshToken: {
      create: jest.fn()
    }
  }
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));

let app;

beforeAll(() => {
  app = createApp();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/profile/me', () => {
  test('should return 401 when Authorization header is missing', async () => {
    const res = await request(app).get('/api/profile/me').expect(401);

    expect(res.body).toEqual({
      success: false,
      message: 'Unauthorized: missing Authorization header'
    });
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  test('should return 401 when token format is invalid', async () => {
    const res = await request(app)
      .get('/api/profile/me')
      .set('Authorization', 'Token invalid-format')
      .expect(401);

    expect(res.body).toEqual({
      success: false,
      message: 'Unauthorized: invalid token format'
    });
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  test('should return 401 when token is invalid or expired', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    const res = await request(app)
      .get('/api/profile/me')
      .set('Authorization', 'Bearer invalid.token.value')
      .expect(401);

    expect(res.body).toEqual({
      success: false,
      message: 'Unauthorized: invalid or expired token'
    });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  test('should return 401 when token payload does not contain user id', async () => {
    jwt.verify.mockReturnValue({ role: 'VIEWER' });

    const res = await request(app)
      .get('/api/profile/me')
      .set('Authorization', 'Bearer valid.but.missing.user')
      .expect(401);

    expect(res.body).toEqual({
      success: false,
      message: 'Unauthorized: invalid token payload'
    });
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  test('should return 200 and profile data when token is valid and user exists', async () => {
    jwt.verify.mockReturnValue({
      user_id: '00000000-0000-0000-0000-000000000001',
      role: 'ADMIN',
      nama_user: 'admin'
    });

    prisma.user.findUnique.mockResolvedValue({
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@example.com',
      username: 'admin',
      role: 'ADMIN',
      avatarUrl: 'https://example.com/avatar.png',
      isVerified: true,
      verifiedAt: '2026-01-15T12:00:00.000Z',
      lastLoginAt: '2026-03-01T08:00:00.000Z',
      createdAt: '2026-01-10T10:00:00.000Z'
    });

    const res = await request(app)
      .get('/api/profile/me')
      .set('Authorization', 'Bearer valid.token.value')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Profile fetched');
    expect(res.body.data).toEqual({
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin@example.com',
      username: 'admin',
      role: 'ADMIN',
      avatarUrl: 'https://example.com/avatar.png',
      isVerified: true,
      verifiedAt: '2026-01-15T12:00:00.000Z',
      lastLoginAt: '2026-03-01T08:00:00.000Z',
      createdAt: '2026-01-10T10:00:00.000Z'
    });
    expect(res.body.data).not.toHaveProperty('passwordHash');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '00000000-0000-0000-0000-000000000001' },
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
  });

  test('should return 404 when token is valid but user is not found', async () => {
    jwt.verify.mockReturnValue({ user_id: 'missing-user-id', role: 'VIEWER' });
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .get('/api/profile/me')
      .set('Authorization', 'Bearer valid.token.value')
      .expect(404);

    expect(res.body).toEqual({
      success: false,
      message: 'User profile not found'
    });
  });

  test('should return 500 when profile service throws an unexpected error', async () => {
    jwt.verify.mockReturnValue({
      user_id: '00000000-0000-0000-0000-000000000001'
    });
    prisma.user.findUnique.mockRejectedValue(new Error('db failure'));

    const res = await request(app)
      .get('/api/profile/me')
      .set('Authorization', 'Bearer valid.token.value')
      .expect(500);

    expect(res.body).toEqual({
      success: false,
      message: 'Internal server error'
    });
  });
});

describe('PATCH /api/profile/me', () => {
  test('should return 401 when Authorization header is missing', async () => {
    const res = await request(app)
      .patch('/api/profile/me')
      .send({ username: 'admin_baru' })
      .expect(401);

    expect(res.body).toEqual({
      success: false,
      message: 'Unauthorized: missing Authorization header'
    });
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  test('should return 400 when no updatable field is provided', async () => {
    jwt.verify.mockReturnValue({
      user_id: '00000000-0000-0000-0000-000000000001',
      role: 'ADMIN'
    });

    const res = await request(app)
      .patch('/api/profile/me')
      .set('Authorization', 'Bearer valid.token.value')
      .send({})
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Validation failed');
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  test('should return 409 when email is already registered by another user', async () => {
    jwt.verify.mockReturnValue({
      user_id: '00000000-0000-0000-0000-000000000001',
      role: 'ADMIN'
    });

    prisma.user.findUnique
      .mockResolvedValueOnce({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@example.com',
        username: 'admin'
      })
      .mockResolvedValueOnce({
        id: '00000000-0000-0000-0000-000000000099'
      });

    const res = await request(app)
      .patch('/api/profile/me')
      .set('Authorization', 'Bearer valid.token.value')
      .send({ email: 'existing@example.com' })
      .expect(409);

    expect(res.body).toEqual({
      success: false,
      message: 'Email already registered'
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  test('should return 200 and update only allowed fields', async () => {
    jwt.verify.mockReturnValue({
      user_id: '00000000-0000-0000-0000-000000000001',
      role: 'ADMIN'
    });

    prisma.user.findUnique
      .mockResolvedValueOnce({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@example.com',
        username: 'admin'
      })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    prisma.user.update.mockResolvedValue({
      id: '00000000-0000-0000-0000-000000000001',
      email: 'admin.baru@example.com',
      username: 'admin_baru',
      role: 'ADMIN',
      avatarUrl: 'https://example.com/avatar.png',
      updatedAt: '2026-04-02T10:00:00.000Z'
    });

    const res = await request(app)
      .patch('/api/profile/me')
      .set('Authorization', 'Bearer valid.token.value')
      .send({
        username: 'admin_baru',
        email: 'admin.baru@example.com',
        role: 'VIEWER',
        passwordHash: 'should-not-be-updated',
        isVerified: false
      })
      .expect(200);

    expect(res.body).toEqual({
      success: true,
      message: 'Profile updated',
      data: {
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin.baru@example.com',
        username: 'admin_baru',
        role: 'ADMIN',
        avatarUrl: 'https://example.com/avatar.png',
        updatedAt: '2026-04-02T10:00:00.000Z'
      }
    });

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: '00000000-0000-0000-0000-000000000001' },
      data: {
        email: 'admin.baru@example.com',
        username: 'admin_baru'
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        avatarUrl: true,
        updatedAt: true
      }
    });
  });
});
