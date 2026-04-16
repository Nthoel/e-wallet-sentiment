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

const verifyForgetPasswordToken = async (req, res, next) => {
  try {
    const result = authValidation.verifiTokenSchema.safeParse(req.body);
    if (!result.success) {
      return next(ApiError.validation('Validation failed', result.error));
    }

    const data = await authService.verifyForgetPasswordToken(result.data.token);

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: ' Forget password token is valid',
      data: data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk memproses refresh token.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const refreshToken = async (req, res, next) => {
  try {
    // 1. Validasi request body menggunakan Zod
    const validationResult = authValidation.refreshTokenSchema.safeParse(
      req.body
    );

    if (!validationResult.success) {
      return next(
        ApiError.validation('Validation failed', validationResult.error)
      );
    }

    const { refresh_token } = validationResult.data;

    // 2. Ekstrak metadata: IP Address dan Device Info (User-Agent)
    const metadata = {
      ipAddress: req.ip,
      deviceInfo: req.headers['user-agent']
    };

    // 3. Panggil service untuk proses rotasi token
    const tokens = await authService.refreshToken(refresh_token, metadata);

    // 4. Return respon sesuai format yang diminta
    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Token refreshed',
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token
      }
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const result = authValidation.resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return next(ApiError.validation('Validation failed', result.error));
    }

    const response = await authService.resetPassword(result.data);

    return res.status(STATUS_CODES.OK).json(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  forgetPassword,
  login,
  register,
  verifyForgetPasswordToken,
  refreshToken,
  resetPassword
};
