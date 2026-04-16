const request = require('supertest');
const createApp = require('../../src/app');
const { prisma } = require('e-wallet-sentiment-database');
const jwt = require('jsonwebtoken');

jest.mock('e-wallet-sentiment-database', () => ({
  prisma: {
    review: {
      count: jest.fn(),
      groupBy: jest.fn()
    }
  }
}));

// Mock jwt to bypass auth middleware easily
jest.mock('jsonwebtoken');

describe('Admin Dashboard API', () => {
  let app;
  const adminToken = 'valid-admin-token';
  const userToken = 'valid-user-token';

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    jwt.verify.mockImplementation(token => {
      if (token === adminToken) {
        return { id: 'admin-id', role: 'ADMIN' };
      }
      if (token === userToken) {
        return { id: 'user-id', role: 'VIEWER' };
      }
      throw new Error('Invalid token');
    });
  });

  describe('GET /api/admin/dashboard/summary', () => {
    test('should return 401 if token is missing', async () => {
      const res = await request(app).get('/api/admin/dashboard/summary');
      expect(res.statusCode).toEqual(401);
    });

    test('should return 403 if user is not an ADMIN', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/summary')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(403);
    });

    test('should return 200 and correct dashboard data structure (populated data)', async () => {
      prisma.review.count.mockResolvedValue(1200);
      prisma.review.groupBy.mockResolvedValue([
        { sentiment_result: 'positive', _count: { sentiment_result: 700 } },
        { sentiment_result: 'negative', _count: { sentiment_result: 250 } },
        { sentiment_result: 'neutral', _count: { sentiment_result: 250 } }
      ]);

      const res = await request(app)
        .get('/api/admin/dashboard/summary')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total_ulasan).toBe(1200);
      expect(res.body.data.sentiment_pie.positive).toBe(700);
      expect(res.body.data.sentiment_pie.negative).toBe(250);
      expect(res.body.data.sentiment_pie.neutral).toBe(250);
      expect(typeof res.body.data.ringkasan_sentimen).toBe('string');
    });

    test('should have default 0 for empty sentiment categories', async () => {
      prisma.review.count.mockResolvedValue(0);
      prisma.review.groupBy.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/admin/dashboard/summary')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.body.data.sentiment_pie.positive).toBe(0);
      expect(res.body.data.sentiment_pie.negative).toBe(0);
      expect(res.body.data.sentiment_pie.neutral).toBe(0);
    });
  });
});
