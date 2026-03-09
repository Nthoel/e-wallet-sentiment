require('dotenv').config({ path: '.env.test', override: true });
const request = require('supertest');
const { prisma } = require('e-wallet-sentiment-database');
const createApp = require('../../src/app');
const bcrypt = require('bcrypt');

describe('POST /api/auth/login', () => {
  let app;
  let testUser;

  beforeAll(async () => {
    app = createApp();
    // Create a test user
    const passwordHash = await bcrypt.hash('password', 10);
    testUser = await prisma.user.create({
      data: {
        username: 'testuser' + Date.now(),
        email: 'testuser' + Date.now() + '@example.com',
        passwordHash,
        role: 'VIEWER'
      }
    });
  });

  afterAll(async () => {
    // Clean up
    await prisma.refreshToken.deleteMany({ where: { userId: testUser.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.$disconnect();
  });

  test('should login successfully with username and correct password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: testUser.username,
        password: 'password'
      })
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
    expect(res.body).toHaveProperty('refresh_token');

    // Check if refresh token is in DB
    const storedToken = await prisma.refreshToken.findFirst({
      where: { userId: testUser.id }
    });
    expect(storedToken).not.toBeNull();
    expect(storedToken.isRevoked).toBe(false);
  });

  test('should login successfully with email and correct password', async () => {
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
