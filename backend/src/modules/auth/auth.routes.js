const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { validate } = require('../../middlewares/validation.middleware');
const { forgetPasswordSchema } = require('./auth.validation');

/**
 * POST /auth/forget-password
 * Endpoint untuk request reset password
 * Request body: { email: string }
 * Response: 204 No Content
 */
router.post(
  '/forget-password',
  validate(forgetPasswordSchema),
  authController.forgetPassword
);

module.exports = router;
