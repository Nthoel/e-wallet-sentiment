const STATUS_CODES = require('../../utils/status-code');
const profileService = require('./profile.service');
const { updateProfileSchema } = require('./profile.validation');
const ApiError = require('../../utils/api-error');

async function getProfile(req, res) {
  try {
    const userId = req.user.id;

    const profile = await profileService.getProfileByUserId(userId);

    if (!profile) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'User profile not found'
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Profile fetched',
      data: profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

async function updateProfile(req, res, next) {
  try {
    const validationResult = updateProfileSchema.safeParse(req.body);

    if (!validationResult.success) {
      return next(
        ApiError.validation(
          'Validation failed',
          validationResult.error.format()
        )
      );
    }

    const userId = req.user.id;
    const profile = await profileService.updateProfileByUserId(
      userId,
      validationResult.data
    );

    if (!profile) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'User profile not found'
      });
    }

    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Profile updated',
      data: profile
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getProfile,
  updateProfile
};
