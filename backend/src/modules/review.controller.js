const { getReviewsService } = require('./review.service');

const getReviewsController = async (req, res, next) => {
    try {
        const query = req.validatedQuery || {};
        const result = await getReviewsService(query);

        return res.status(200).json({
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