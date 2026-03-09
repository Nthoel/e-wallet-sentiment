const { Router } = require('express');
const { registerController } = require('./auth.controller');

const authRouter = Router();

authRouter.post('/register', registerController);

module.exports = authRouter;
