const logger = require('../config/logger.config');
const STATUS_CODES = require('../utils/status-code');

/**
 * Global Handle error
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
const errorHandleMiddleware = (err, req, res, _next) => {
  const statusCode =
    err.statusCode || err.status || STATUS_CODES.INTERNAL_SERVER_ERROR;

  logger.warn(
    `${req.method} ${req.originalUrl} - status: ${statusCode} - message: ${err.message}`
  );
  if (statusCode >= STATUS_CODES.INTERNAL_SERVER_ERROR) {
    logger.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(err.errors && { errors: err.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandleMiddleware;
