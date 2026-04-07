const express = require('express');
const authController = require('./auth.controller');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forget-password', authController.verifyForgetPasswordToken);

module.exports = router;
