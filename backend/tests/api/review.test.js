const request = require('supertest');
const createApp = require('../../src/app');

jest.mock('e-wallet-sentiment-database', () => ({
  prisma: {
    review: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn()
    }
  }
}));

const { prisma } = require('e-wallet-sentiment-database');

let app;

beforeAll(() => {
  app = createApp();
});

afterEach(() => {
  jest.clearAllMocks();
});

// ─── GET /api/reviews ────────────────────────────────────────────────

describe('GET /api/reviews', () => {
  const mockReviewRow = {
    id: 'gp:AOqpTOE123456789',
    user_name: 'Ahmad Fauzi',
    user_image: 'https://play-lh.googleusercontent.com/a/ALm5wu',
    content: 'Aplikasi sangat membantu.',
    score: 4,
    thumbs_up_count: 5,
    review_created_version: '2.5.0',
    review_datetime: new Date('2024-02-25T10:00:00Z'),
    reply_content: 'Terima kasih!',
    replied_at: new Date('2024-02-25T11:30:00Z'),
    app_version: '2.5.0',
    timestamp_unix: BigInt(1708855200),
    timestamp_formatted: '2024-02-25 10:00:00',
    source: 'google_play',
    is_analyzed: false,
    sentiment_result: null,
    confidence_score: null,
    created_at: new Date('2024-02-25T10:00:00Z')
  };

  test('should return 200 with paginated reviews (default params)', async () => {
    prisma.review.findMany.mockResolvedValue([mockReviewRow]);
    prisma.review.count.mockResolvedValue(1);

    const res = await request(app).get('/api/reviews');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.total_results).toBe(1);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].id).toBe('gp:AOqpTOE123456789');
    expect(res.body.data[0].timestamp_unix).toBe(1708855200);

    expect(prisma.review.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
        orderBy: { created_at: 'desc' }
      })
    );
  });

  test('should apply page and limit query params', async () => {
    prisma.review.findMany.mockResolvedValue([]);
    prisma.review.count.mockResolvedValue(0);

    const res = await request(app).get('/api/reviews?page=2&limit=5');

    expect(res.statusCode).toBe(200);
    expect(prisma.review.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 })
    );
  });

  test('should filter by source', async () => {
    prisma.review.findMany.mockResolvedValue([]);
    prisma.review.count.mockResolvedValue(0);

    await request(app).get('/api/reviews?source=google_play');

    expect(prisma.review.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ source: 'google_play' })
      })
    );
  });

  test('should filter by sentiment_result', async () => {
    prisma.review.findMany.mockResolvedValue([]);
    prisma.review.count.mockResolvedValue(0);

    await request(app).get('/api/reviews?sentiment_result=positive');

    expect(prisma.review.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ sentiment_result: 'positive' })
      })
    );
  });

  test('should filter by is_analyzed=true', async () => {
    prisma.review.findMany.mockResolvedValue([]);
    prisma.review.count.mockResolvedValue(0);

    await request(app).get('/api/reviews?is_analyzed=true');

    expect(prisma.review.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ is_analyzed: true })
      })
    );
  });

  test('should apply sort_order=asc', async () => {
    prisma.review.findMany.mockResolvedValue([]);
    prisma.review.count.mockResolvedValue(0);

    await request(app).get('/api/reviews?sort_order=asc');

    expect(prisma.review.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { created_at: 'asc' } })
    );
  });

  test('should return validation error for invalid page', async () => {
    const res = await request(app).get('/api/reviews?page=0');

    expect(res.statusCode).not.toBe(200);
    expect(prisma.review.findMany).not.toHaveBeenCalled();
  });

  test('should return validation error for limit > 100', async () => {
    const res = await request(app).get('/api/reviews?limit=101');

    expect(res.statusCode).not.toBe(200);
    expect(prisma.review.findMany).not.toHaveBeenCalled();
  });

  test('should return validation error for invalid sort_order', async () => {
    const res = await request(app).get('/api/reviews?sort_order=invalid');

    expect(res.statusCode).not.toBe(200);
    expect(prisma.review.findMany).not.toHaveBeenCalled();
  });

  test('should return empty data when no reviews exist', async () => {
    prisma.review.findMany.mockResolvedValue([]);
    prisma.review.count.mockResolvedValue(0);

    const res = await request(app).get('/api/reviews');

    expect(res.statusCode).toBe(200);
    expect(res.body.total_results).toBe(0);
    expect(res.body.data).toEqual([]);
  });
});

// ─── POST /api/reviews ───────────────────────────────────────────────

describe('POST /api/reviews', () => {
  const validReviewData = {
    id: 'gp:AOqpTOE123456789',
    user_name: 'Ahmad Fauzi',
    user_image: 'https://play-lh.googleusercontent.com/a/ALm5wu',
    content:
      'Aplikasi sangat membantu, tapi tolong perbaiki bug di halaman login.',
    score: 4,
    thumbs_up_count: 5,
    review_created_version: '2.5.0',
    review_datetime: '2024-02-25T10:00:00Z',
    reply_content: 'Halo Ahmad, terima kasih laporannya. Sedang kami cek ya!',
    replied_at: '2024-02-25T11:30:00Z',
    app_version: '2.5.0',
    timestamp_unix: 1708855200,
    timestamp_formatted: '2024-02-25 10:00:00',
    source: 'google_play'
  };

  test('should create a new review and return 201', async () => {
    const createdReview = {
      ...validReviewData,
      review_datetime: new Date('2024-02-25T10:00:00Z'),
      replied_at: new Date('2024-02-25T11:30:00Z'),
      timestamp_unix: BigInt(1708855200),
      is_analyzed: false,
      sentiment_result: null,
      confidence_score: null,
      created_at: new Date()
    };
    prisma.review.create.mockResolvedValue(createdReview);

    const res = await request(app).post('/api/reviews').send(validReviewData);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Review created successfully');
    expect(res.body.data.id).toBe(validReviewData.id);
    expect(res.body.data.timestamp_unix).toBe(1708855200);
  });

  test('should create a review with only required fields', async () => {
    const minimalData = {
      id: 'gp:MINIMAL001',
      content: 'Good app!',
      source: 'google_play'
    };
    prisma.review.create.mockResolvedValue({
      ...minimalData,
      timestamp_unix: null,
      created_at: new Date()
    });

    const res = await request(app).post('/api/reviews').send(minimalData);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe('gp:MINIMAL001');
  });

  test('should return error when id is missing', async () => {
    const { id, ...noId } = validReviewData;

    const res = await request(app).post('/api/reviews').send(noId);

    expect(res.statusCode).not.toBe(201);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  test('should return error when content is missing', async () => {
    const { content, ...noContent } = validReviewData;

    const res = await request(app).post('/api/reviews').send(noContent);

    expect(res.statusCode).not.toBe(201);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  test('should return error when source is missing', async () => {
    const { source, ...noSource } = validReviewData;

    const res = await request(app).post('/api/reviews').send(noSource);

    expect(res.statusCode).not.toBe(201);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  test('should return error when score is out of range (> 5)', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ ...validReviewData, score: 6 });

    expect(res.statusCode).not.toBe(201);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  test('should return error when score is out of range (< 1)', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ ...validReviewData, score: 0 });

    expect(res.statusCode).not.toBe(201);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  test('should return error when thumbs_up_count is negative', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .send({ ...validReviewData, thumbs_up_count: -1 });

    expect(res.statusCode).not.toBe(201);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  test('should handle null timestamp_unix in response', async () => {
    prisma.review.create.mockResolvedValue({
      ...validReviewData,
      timestamp_unix: null,
      created_at: new Date()
    });

    const res = await request(app)
      .post('/api/reviews')
      .send({ ...validReviewData, timestamp_unix: null });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.timestamp_unix).toBeNull();
  });

  test('should return 500 when prisma create fails', async () => {
    prisma.review.create.mockRejectedValue(
      new Error('Unique constraint failed')
    );

    const res = await request(app).post('/api/reviews').send(validReviewData);

    expect(res.statusCode).toBe(500);
  });

  test('should return error for empty body', async () => {
    const res = await request(app).post('/api/reviews').send({});

    expect(res.statusCode).not.toBe(201);
    expect(prisma.review.create).not.toHaveBeenCalled();
  });
});
