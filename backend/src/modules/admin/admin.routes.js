const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const {
  authMiddleware,
  authorizeRole
} = require('../../middlewares/auth.middleware');

// Proteksi: auth + role ADMIN
router.get(
  '/dashboard/summary',
  authMiddleware, // Verifikasi JWT token
  authorizeRole('ADMIN'), // Cek role ADMIN
  adminController.getDashboardSummary
);

module.exports = router;
