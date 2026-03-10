const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

/**
 * POST /auth/forget-password
 * Endpoint untuk request reset password
 * Request body: { email: string }
 * Response: 204 No Content
 */
router.post('/forget-password', authController.forgetPassword);

module.exports = router;
