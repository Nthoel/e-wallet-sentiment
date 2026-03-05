const { prisma } = require('e-wallet-sentiment-database');

/**
 * Create a new review
 * @param {Object} reviewData
 * @returns {Promise<Object>}
 */
const createReview = async reviewData => {
  return await prisma.review.create({
    data: reviewData
  });
};

module.exports = {
  createReview
};
