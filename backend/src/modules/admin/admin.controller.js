const STATUS_CODES = require('../../utils/status-code');
const adminService = require('./admin.service');

const getDashboardSummary = async (req, res, next) => {
  try {
    const summaryData = await adminService.getDashboardSummaryData();

    // Format response sesuai expected response pada requirement
    return res.status(STATUS_CODES.OK).json({
      success: true,
      message: 'Dashboard summary fetched',
      data: summaryData
    });
  } catch (error) {
    // Forward error ke global error handler
    next(error);
  }
};

module.exports = { getDashboardSummary };
