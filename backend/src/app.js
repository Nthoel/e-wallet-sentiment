const express = require('express');
const loggerMiddleware = require('./middlewares/logging.middleware');
const errorHandleMiddleware = require('./middlewares/error-logger.middleware');
const reviewRouter = require('./modules/reviews/review.router');
const authRouter = require('./modules/auth/auth.routes');
const app = express();

const createApp = () => {
  // MIDDLEWARE
  // -------------
  app.use(express.json());

  // Logging
  app.use(loggerMiddleware);

  // ENDPOINT
  // -------------

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'e-wallet-sentiment-backend' });
  });

  // Auth routes
  app.use('/api/auth', authRouter);

  // Review routes
  app.use('/api/reviews', reviewRouter);

  // Auth routes
  app.use('/api/auth', authRouter);

  // Handle Error API
  app.use(errorHandleMiddleware);

  return app;
};

module.exports = createApp;
