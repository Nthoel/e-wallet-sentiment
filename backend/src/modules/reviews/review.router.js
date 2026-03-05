const express = require('express');
const reviewController = require('./review.controller');

const router = express.Router();

router.get('/', reviewController.getReviewsController);
router.post('/', reviewController.createReview);

module.exports = router;
