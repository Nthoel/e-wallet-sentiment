const express = require('express');
const authMiddleware = require('../../middlewares/auth.middleware');
const profileController = require('./profile.controller');
const { validateGetProfile } = require('./profile.validation');

const router = express.Router();

router.get(
  '/me',
  authMiddleware,
  validateGetProfile,
  profileController.getProfile
);

module.exports = router;
