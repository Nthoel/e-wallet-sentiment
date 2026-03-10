const authService = require('./auth.service');
const { forgetPasswordSchema } = require('./auth.validation');

const BAD_REQUEST_STATUS = 400;
const NO_CONTENT_STATUS = 204;

const formatValidationError = error => {
  return error.issues.map(issue => issue.message).join(', ');
};

/**
 * Controller untuk handle forget password request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const forgetPassword = async (req, res, next) => {
  try {
    const validationResult = forgetPasswordSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(BAD_REQUEST_STATUS).json({
        status: 'error',
        message: formatValidationError(validationResult.error)
      });
    }

    const { email } = validationResult.data;

    // Panggil service untuk proses forget password
    await authService.forgetPassword(email);

    // Selalu return 204 No Content
    // (baik email terdaftar maupun tidak, untuk keamanan)
    return res.status(NO_CONTENT_STATUS).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  forgetPassword
};
