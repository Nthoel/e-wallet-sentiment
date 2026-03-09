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

module.exports = {
  login,
  register
};
