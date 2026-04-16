require('dotenv').config({ path: '.env.test', override: true });
const bcrypt = require('bcrypt');
const request = require('supertest');
const createApp = require('../../src/app');
const { prisma } = require('e-wallet-sentiment-database');
const { sendTemplateMail } = require('../../src/mail');

// Mock dependencies
jest.mock('e-wallet-sentiment-database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    },
    userToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn()
    },
    refreshToken: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn()
    },
    $transaction: jest.fn()
  }
}));

jest.mock('../../src/mail', () => ({
  sendMail: jest.fn(),
  sendTemplateMail: jest.fn()
}));

let app;

beforeAll(() => {
  app = createApp();
});

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

describe('POST /api/auth/forget-password', () => {
  describe('Success Cases', () => {
    test('should return 204 when email is registered and send email', async () => {
      // Mock user exists
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        username: 'testuser'
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.userToken.create.mockResolvedValue({});
      sendTemplateMail.mockResolvedValue({ success: true });

      const res = await request(app)
        .post('/api/auth/forget-password')
        .send({ email: 'user@example.com' })
        .expect(204);

      // Check response
      expect(res.body).toEqual({});

      // Verify user was checked
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'user@example.com' }
      });

      // Verify token was created
      expect(prisma.userToken.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-123',
            type: 'PASSWORD_RESET',
            isUsed: false
          })
        })
      );

      // Verify email was sent
      expect(sendTemplateMail).toHaveBeenCalledWith(
        'resetPassword',
        'user@example.com',
        expect.objectContaining({
          name: 'testuser',
          resetLink: expect.any(String)
        })
      );
    });

    test('should return 204 when email is not registered (security)', async () => {
      // Mock user does not exist
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/forget-password')
        .send({ email: 'notregistered@example.com' })
        .expect(204);

      // Check response
      expect(res.body).toEqual({});

      // Verify user was checked
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'notregistered@example.com' }
      });

      // Verify NO token was created
      expect(prisma.userToken.create).not.toHaveBeenCalled();

      // Verify NO email was sent
      expect(sendTemplateMail).not.toHaveBeenCalled();
    });

    test('should return 404 when using removed /auth/forget-password alias endpoint', async () => {
      const res = await request(app)
        .post('/auth/forget-password')
        .send({ email: 'alias@example.com' })
        .expect(404);

      expect(res.body).toEqual({});
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('Validation Errors', () => {
    test('should return 400 when email format is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/forget-password')
        .send({ email: 'invalidemail' })
        .expect(400);

      expect(res.body).toEqual({
        status: 'error',
        message: expect.stringContaining('valid email')
      });

      // Verify no database call was made
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    test('should return 400 when email is empty', async () => {
      const res = await request(app)
        .post('/api/auth/forget-password')
        .send({ email: '' })
        .expect(400);

      expect(res.body).toEqual({
        status: 'error',
        message: expect.stringContaining('required')
      });
    });

    test('should return 400 when email field is missing', async () => {
      const res = await request(app)
        .post('/api/auth/forget-password')
        .send({})
        .expect(400);

      expect(res.body).toEqual({
        status: 'error',
        message: expect.stringContaining('required')
      });
    });

    test('should return 400 when request body contains invalid fields', async () => {
      const res = await request(app)
        .post('/api/auth/forget-password')
        .send({
          email: 'user@example.com',
          extraField: 'shouldBeStripped'
        })
        .expect(204);

      // Even with extra fields, stripUnknown should remove them
      // and the request should succeed
      expect(res.body).toEqual({});
    });
  });

  describe('Edge Cases', () => {
    test('should handle database errors gracefully', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/api/auth/forget-password')
        .send({ email: 'user@example.com' })
        .expect(500);

      // Error should be caught by error middleware
      expect(res.body).toEqual({
        success: false,
        message: 'Database error'
      });
    });

    test('should handle email sending errors gracefully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        username: 'testuser'
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.userToken.create.mockResolvedValue({});
      sendTemplateMail.mockRejectedValue(new Error('Email service down'));

      const res = await request(app)
        .post('/api/auth/forget-password')
        .send({ email: 'user@example.com' })
        .expect(500);

      // Error should be caught by error middleware
      expect(res.body).toEqual({
        success: false,
        message: 'Email service down'
      });
    });
  });
});

describe('POST /api/auth/register', () => {
  describe('Success Cases', () => {
    test('should return 201 when registration is successful', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({});

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'password123'
        })
        .expect(201);

      expect(res.body).toEqual({ success: true });
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            username: 'newuser',
            email: 'newuser@example.com'
          })
        })
      );
    });
  });

  describe('Validation Errors', () => {
    test('should return 400 when username is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
    });

    test('should return 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          password: 'password123'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('should return 400 when password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'user@example.com'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('should return 400 when email format is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'invalidemail',
          password: 'password123'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('should return 400 when username is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'ab',
          email: 'user@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    test('should return 400 when password is too short', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'user@example.com',
          password: '12345'
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('Conflict Cases', () => {
    test('should return 409 when email is already registered', async () => {
      prisma.user.findUnique.mockResolvedValueOnce({ id: 'existing-user' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'existing@example.com',
          password: 'password123'
        })
        .expect(409);

      expect(res.body.message).toMatch(/Email already registered/);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    test('should return 409 when username is already taken', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'existing-user' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'existinguser',
          email: 'new@example.com',
          password: 'password123'
        })
        .expect(409);

      expect(res.body.message).toMatch(/Username already taken/);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('should handle database errors gracefully', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          email: 'user@example.com',
          password: 'password123'
        })
        .expect(500);

      expect(res.body).toEqual({
        success: false,
        message: 'Database error'
      });
    });
  });
});

describe('POST /api/auth/login', () => {
  let testUser;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash('password', 10);
    testUser = {
      id: 'user-login-123',
      username: 'testuser',
      email: 'testuser@example.com',
      passwordHash,
      role: 'VIEWER'
    };
  });

  test('should login successfully with username and correct password', async () => {
    prisma.user.findFirst.mockResolvedValue(testUser);
    prisma.refreshToken.create.mockResolvedValue({});

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: testUser.username,
        password: 'password'
      })
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');

    expect(prisma.refreshToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: testUser.id,
          isRevoked: false
        })
      })
    );
  });

  test('should login successfully with email and correct password', async () => {
    prisma.user.findFirst.mockResolvedValue(testUser);
    prisma.refreshToken.create.mockResolvedValue({});

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'password'
      })
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');
  });

  test('should fail with incorrect password', async () => {
    prisma.user.findFirst.mockResolvedValue(testUser);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: testUser.username,
        password: 'wrongpassword'
      })
      .expect(401);

    expect(res.body.message).toMatch(/Email\/Username atau password salah/);
  });

  test('should fail with non-existent user', async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await request(app)
      .post('/api/auth/login')
      .send({
        username: 'notfounduser123',
        password: 'password'
      })
      .expect(401);
  });

  test('should fail validation when username/email is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        password: 'password'
      })
      .expect(400);

    expect(res.body.errors).toBeDefined();
  });
});

describe('POST /api/auth/refresh-token', () => {
  const mockUser = {
    id: 'user-refresh-123',
    username: 'refreshuser',
    email: 'refresh@example.com',
    role: 'VIEWER'
  };

  const validRefreshToken = 'some-valid-jwt-token';
  const mockStoredToken = {
    id: 'token-uuid-123',
    userId: mockUser.id,
    tokenHash: 'hashed-token',
    isRevoked: false,
    expiresAt: new Date(Date.now() + 1000000),
    user: mockUser
  };

  test('should refresh tokens successfully', async () => {
    prisma.refreshToken.findFirst.mockResolvedValue(mockStoredToken);
    prisma.refreshToken.update.mockResolvedValue({
      ...mockStoredToken,
      isRevoked: true
    });
    prisma.refreshToken.create.mockResolvedValue({});

    const res = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refresh_token: validRefreshToken })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Token refreshed');
    expect(res.body.data).toHaveProperty('access_token');
    expect(res.body.data).toHaveProperty('refresh_token');

    // Verify old token was revoked
    expect(prisma.refreshToken.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: mockStoredToken.id },
        data: expect.objectContaining({ isRevoked: true })
      })
    );

    // Verify new token was created
    expect(prisma.refreshToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: mockUser.id,
          isRevoked: false
        })
      })
    );
  });

  test('should fail when refresh_token is missing', async () => {
    const res = await request(app)
      .post('/api/auth/refresh-token')
      .send({})
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  test('should fail when refresh_token is not found in DB or revoked', async () => {
    prisma.refreshToken.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refresh_token: 'invalid-token' })
      .expect(401);

    expect(res.body.message).toMatch(/tidak valid atau sudah expired/);
  });

  test('should fail when refresh_token is expired', async () => {
    prisma.refreshToken.findFirst.mockResolvedValue(null); // Assuming findFirst filters by expiresAt

    const res = await request(app)
      .post('/api/auth/refresh-token')
      .send({ refresh_token: 'expired-token' })
      .expect(401);

    expect(res.body.message).toMatch(/tidak valid atau sudah expired/);
  });
});

describe('POST /api/auth/reset-password', () => {
  const mockUserToken = {
    id: 'token-id-123',
    userId: 'user-id-123',
    type: 'PASSWORD_RESET',
    tokenHash: 'hashed-token',
    isUsed: false,
    expiresAt: new Date(Date.now() + 10000)
  };

  test('should return 200 and success when password is reset', async () => {
    prisma.userToken.findFirst.mockResolvedValue(mockUserToken);
    prisma.$transaction.mockResolvedValue([]);
    
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({
        token: 'valid-token',
        new_password: 'PasswordBaru@123',
        confirm_password: 'PasswordBaru@123'
      })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Password reset berhasil');
    
    // Verify transaction was called
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  test('should return 400 when confirm_password does not match', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({
        token: 'valid-token',
        new_password: 'PasswordBaru@123',
        confirm_password: 'MismatchPassword@123'
      })
      .expect(400);

    // Error returned is from Zod validation mapper (format depends on your error handler)
    expect(res.body.message).toMatch(/failed/i); // Matches ApiError.validation message
  });

  test('should return 401 when token is invalid', async () => {
    prisma.userToken.findFirst.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({
        token: 'invalid-token',
        new_password: 'PasswordBaru@123',
        confirm_password: 'PasswordBaru@123'
      })
      .expect(401);

    expect(res.body.message).toMatch(/invalid, expired, or already used/i);
  });
});
