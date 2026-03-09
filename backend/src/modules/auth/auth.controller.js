const { registerSchema } = require('./auth.validation');
const { register } = require('./auth.service');
const ApiError = require('../../utils/api-error');
const STATUS_CODES = require('../../utils/status-code');

const registerController = async (req, res, next) => {
  try {
    // Validasi request body
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return next(ApiError.validation('Validation failed', result.error.errors));
    }

    const data = await register(result.data);
    return res.status(STATUS_CODES.CREATED).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerController };
