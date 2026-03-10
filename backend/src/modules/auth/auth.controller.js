const authService = require('./auth.service');
const STATUS_CODES = require('../../utils/status-code');
const authValidation = require('./auth.validation');
const ApiError = require('../../utils/api-error');

const login = async (req, res, next) => {
  try {
    // Validasi request body
    const result = authValidation.loginSchema.safeParse(req.body);
    if (!result.success) {
      return next(ApiError.validation('Validation failed', result.error));
    }

    const tokens = await authService.login(req.body);
    res.status(STATUS_CODES.OK).json({
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    // Validasi request body
    const result = authValidation.registerSchema.safeParse(req.body);
    if (!result.success) {
      return next(
        ApiError.validation('Username atau email wajib diisi', result.error)
      );
    }

    const data = await authService.register(result.data);
    return res.status(STATUS_CODES.CREATED).json(data);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk handle forget password request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const forgetPassword = async (req, res, next) => {
  try {
    const validationResult = authValidation.forgetPasswordSchema.safeParse(
      req.body
    );

    if (!validationResult.success) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        status: 'error',
        message: validationResult.error.issues
          .map(issue => issue.message)
          .join(', ')
      });
    }

    const { email } = validationResult.data;

    // Panggil service untuk proses forget password
    await authService.forgetPassword(email);

    // Selalu return 204 No Content
    // (baik email terdaftar maupun tidak, untuk keamanan)
    return res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  forgetPassword,
  login,
  register
};
