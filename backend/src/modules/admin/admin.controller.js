const adminService = require('./admin.service');

const getDashboardSummary = async (req, res, next) => {
  try {
    const summaryData = await adminService.getDashboardSummaryData();

    // Format response sesuai expected response pada requirement
    const HTTP_STATUS = 200;
    return res.status(HTTP_STATUS).json({
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
