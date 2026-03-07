const logger = require('../config/logger.config');

/**
 * Global Handle error
 *
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
const HTTP_INTERNAL_SERVER_ERROR = 500;
const HTTP_BAD_REQUEST = 400;

const errorHandleMiddleware = (err, req, res, _next) => {
  const statusCode = err.statusCode || err.status || HTTP_INTERNAL_SERVER_ERROR;

  if (statusCode >= HTTP_BAD_REQUEST && statusCode < HTTP_INTERNAL_SERVER_ERROR) {
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
