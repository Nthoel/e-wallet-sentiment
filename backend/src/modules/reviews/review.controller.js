const { getReviewsService } = require('./review.service');

const HTTP_OK = 200;

const getReviewsController = async (req, res, next) => {
  try {
    const query = req.validatedQuery || {};
    const result = await getReviewsService(query);

    return res.status(HTTP_OK).json({
      status: 'success',
      total_results: result.total_results,
      data: result.data
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getReviewsController
};
