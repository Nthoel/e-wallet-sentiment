const express = require('express');
const { getReviewsController } = require('./review.controller');
const { validateGetReviewsQuery } = require('./review.validation');

const router = express.Router();

router.get('/', validateGetReviewsQuery, getReviewsController);

module.exports = router;