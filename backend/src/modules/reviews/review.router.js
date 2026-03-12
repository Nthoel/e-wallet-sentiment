const express = require('express');
const reviewController = require('./review.controller');

const router = express.Router();

/**
 * @openapi
 * /api/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Ambil daftar review
 *     description: Mengambil daftar review dengan pagination, filter, dan sorting.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Filter berdasarkan sumber review (e.g. google_play)
 *       - in: query
 *         name: sentiment_result
 *         schema:
 *           type: string
 *         description: Filter berdasarkan hasil sentimen (e.g. positive, negative, neutral)
 *       - in: query
 *         name: is_analyzed
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filter berdasarkan status analisis
 *       - in: query
 *         name: sort_order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Urutan sorting berdasarkan created_at
 *     responses:
 *       200:
 *         description: Daftar review berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetReviewsResponse'
 *       400:
 *         description: Validasi query parameter gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
router.get('/', reviewController.getReviewsController);

/**
 * @openapi
 * /api/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Buat review baru
 *     description: Menambahkan review baru ke database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReviewRequest'
 *     responses:
 *       201:
 *         description: Review berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateReviewResponse'
 *       400:
 *         description: Validasi gagal
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
router.post('/', reviewController.createReview);

module.exports = router;
