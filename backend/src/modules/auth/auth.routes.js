const express = require('express');
const authController = require('./auth.controller');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);

/**
 * POST /auth/forget-password
 * Endpoint untuk request reset password
 * Request body: { email: string }
 * Response: 204 No Content
 */
router.post('/forget-password', authController.forgetPassword);

module.exports = router;
