const logger = require('../config/logger.config');

/**
 * Global Handle error
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
const errorHandleMiddleware = (err, req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500;

  if (statusCode >= 400 && statusCode < 500) {
    // Error klien (4xx): Log sebagai warn tanpa stack trace supaya terminal tidak "berisik"
    logger.warn(`${req.method} ${req.originalUrl} - status: ${statusCode} - message: ${err.message}`);
  } else {
    // Error server (5xx): Log sebagai error dengan stack trace untuk debugging
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
