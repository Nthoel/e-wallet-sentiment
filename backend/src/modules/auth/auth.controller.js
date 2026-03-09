const authService = require('./auth.service');

const NO_CONTENT_STATUS = 204;

/**
 * Controller untuk handle forget password request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

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
