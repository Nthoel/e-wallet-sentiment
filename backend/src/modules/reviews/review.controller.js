const reviewService = require('./review.service');
const { createReviewSchema } = require('./review.validation');
const ApiError = require('../../utils/api-error');
const STATUS_CODES = require('../../utils/status-code');

/**
 * Handle POST /api/reviews
 */
const createReview = async (req, res, next) => {
  try {
    const validation = createReviewSchema.safeParse(req.body);

    if (!validation.success) {
      throw ApiError.validation('Validation failed', validation.error.format());
    }

    const review = await reviewService.createReview(validation.data);

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: 'Review created successfully',
      data: {
        ...review,
        // Convert BigInt for JSON serialization
        timestamp_unix: review.timestamp_unix
          ? Number(review.timestamp_unix)
          : null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview
};
