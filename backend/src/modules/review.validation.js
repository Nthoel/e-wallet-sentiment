const { z } = require('zod');
const ApiError = require('../utils/api-error');

const getReviewsQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    source: z.string().trim().min(1).optional(),
    sentiment_result: z.string().trim().min(1).optional(),
    is_analyzed: z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional(),
    sort_order: z.enum(['asc', 'desc']).default('desc'),
});

const validateGetReviewsQuery = (req, _res, next) => {
    const parsed = getReviewsQuerySchema.safeParse(req.query);

    if(!parsed.success) {
        return next(ApiError.validation('Validation failed', parsed.error.flatten()));
    }

    req.validatedQuery = parsed.data;
    return next();
};

module.exports = {
    validateGetReviewsQuery
};