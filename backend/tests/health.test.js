const request = require('supertest');
const createApp = require('../src/app');

describe('GET /api/health', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  test('responds 200 with expected JSON body', async () => {
    const res = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(res.body).toEqual({
      status: 'ok',
      service: 'e-wallet-sentiment-backend'
    });
  });
});
