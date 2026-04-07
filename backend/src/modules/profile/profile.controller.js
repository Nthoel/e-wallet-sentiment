const STATUS_CODES = require('../../utils/status-code');
const profileService = require('./profile.service');

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

module.exports = {
  getProfile
};
