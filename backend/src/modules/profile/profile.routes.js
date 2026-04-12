const express = require('express');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const profileController = require('./profile.controller');

const router = express.Router();

/**
 * @openapi
 * /api/profile/me:
 *   get:
 *     tags:
 *       - Profile
 *     summary: Ambil profil user login
 *     description: Mengambil data profil user berdasarkan access token yang valid.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetProfileResponse'
 *       401:
 *         description: Unauthorized (token tidak valid / tidak ada)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User profile tidak ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/me', authMiddleware, profileController.getProfile);

module.exports = router;
