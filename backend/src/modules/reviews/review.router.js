const express = require('express');
const { validateGetReviewsQuery } = require('./review.validation');
const reviewController = require('./review.controller');

const router = express.Router();

router.get('/', reviewController.getReviewsController);
router.post('/', reviewController.createReview);

module.exports = router;
