const request = require('supertest');
const app = require('../src/server'); // Assuming server.js exports the Express app

describe('POST /api/reviews', () => {
    it('should create a new review and return 201', async () => {
        const reviewData = {
            "review_id": "gp:AOqpTOE123456789",
            "user_name": "Ahmad Fauzi",
            "user_image": "https://play-lh.googleusercontent.com/a/ALm5wu...",
            "content": "Aplikasi sangat membantu, tapi tolong perbaiki bug di halaman login.",
            "score": 4,
            "thumbs_up_count": 5,
            "review_created_version": "2.5.0",
            "review_datetime": "2024-02-25T10:00:00Z",
            "reply_content": "Halo Ahmad, terima kasih laporannya. Sedang kami cek ya!",
            "replied_at": "2024-02-25T11:30:00Z",
            "app_version": "2.5.0",
            "timestamp_unix": 1708855200,
            "timestamp_formatted": "2024-02-25 10:00:00",
            "source": "google_play"
        };

        const response = await request(app)
            .post('/api/reviews')
            .send(reviewData);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.review_id).toBe(reviewData.review_id);
    });

    it('should return 400 for invalid data', async () => {
        const invalidData = {
            "user_name": "Ahmad Fauzi",
            "content": "Aplikasi sangat membantu, tapi tolong perbaiki bug di halaman login.",
            "score": 6 // Invalid score
        };

        const response = await request(app)
            .post('/api/reviews')
            .send(invalidData);

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});