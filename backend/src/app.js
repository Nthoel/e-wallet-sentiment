const express = require('express');
const swaggerUi = require('swagger-ui-express');
const loggerMiddleware = require('./middlewares/logging.middleware');
const errorHandleMiddleware = require('./middlewares/error-logger.middleware');
const swaggerSpec = require('./config/swagger.config');
const reviewRouter = require('./modules/reviews/review.router');
const authRouter = require('./modules/auth/auth.routes');
const profileRouter = require('./modules/profile/profile.routes');
const app = express();

const createApp = () => {
  // MIDDLEWARE
  // -------------
  app.use(express.json());

  // Logging
  app.use(loggerMiddleware);

  // ENDPOINT
  // -------------

  // Swagger API Docs
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/docs.json', (req, res) => {
    res.json(swaggerSpec);
  });

  /**
   * @openapi
   * /api/health:
   *   get:
   *     tags:
   *       - Health
   *     summary: Health check
   *     description: Mengecek apakah backend server berjalan dengan baik.
   *     responses:
   *       200:
   *         description: Server berjalan normal
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HealthResponse'
   */
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'e-wallet-sentiment-backend' });
  });

  // Auth routes
  app.use('/api/auth', authRouter);

  // Review routes
  app.use('/api/reviews', reviewRouter);

  // Profile routes
  app.use('/api/profile', profileRouter);

  // Handle Error API
  app.use(errorHandleMiddleware);

  return app;
};

module.exports = createApp;
