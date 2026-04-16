const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const {
  authMiddleware,
  authorizeRole
} = require('../../middlewares/auth.middleware');

/**
 * @swagger
 * /api/admin/dashboard/summary:
 *   get:
 *     summary: Mendapatkan ringkasan dashboard untuk admin
 *     description: Endpoint untuk mengambil total ulasan, komposisi sentimen, dan ringkasan sentimen (hanya untuk ADMIN).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary fetched
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DashboardSummaryResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get(
  '/dashboard/summary',
  authMiddleware, // Verifikasi JWT token
  authorizeRole('ADMIN'), // Cek role ADMIN
  adminController.getDashboardSummary
);

module.exports = router;
