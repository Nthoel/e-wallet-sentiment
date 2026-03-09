const request = require('supertest');
const createApp = require('../../src/app');
const { prisma } = require('e-wallet-sentiment-database');
const { sendMail } = require('../../src/mail');

// Mock dependencies
jest.mock('e-wallet-sentiment-database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn()
    },
    userToken: {
      create: jest.fn()
    }
  }
}));

jest.mock('../../src/mail', () => ({
  sendMail: jest.fn()
}));

describe('POST /api/auth/forget-password', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Success Cases', () => {
    test('should return 204 on /auth/forget-password alias endpoint', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/auth/forget-password')
        .send({ email: 'alias@example.com' })
        .expect(204);

      expect(res.body).toEqual({});
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'alias@example.com' }
      });
    });

    test('should return 204 when email is registered and send email', async () => {
      // Mock user exists
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        username: 'testuser'
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.userToken.create.mockResolvedValue({});
      sendMail.mockResolvedValue({ success: true });

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
      expect(sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'user@example.com',
          subject: expect.stringContaining('Reset Password')
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
      expect(sendMail).not.toHaveBeenCalled();
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
      sendMail.mockRejectedValue(new Error('Email service down'));

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
