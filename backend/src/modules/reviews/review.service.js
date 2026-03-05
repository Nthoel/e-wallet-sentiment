const { prisma } = require('e-wallet-sentiment-database');

const toNumberOrNull = value => {
  if (value === null || value === undefined) {
    return null;
  }
  return Number(value);
};

const getReviewsService = async query => {
  const {
    page = 1,
    limit = 10,
    source,
    sentiment_result,
    is_analyzed,
    sort_order = 'desc'
  } = query;

  const skip = (page - 1) * limit;

  const where = {};
  if (source) {
    where.source = source;
  }
  if (sentiment_result) {
    where.sentiment_result = sentiment_result;
  }
  if (typeof is_analyzed === 'boolean') {
    where.is_analyzed = is_analyzed;
  }

  const [rows, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: sort_order }
    }),
    prisma.review.count({ where })
  ]);

  const data = rows.map(row => ({
    review_id: row.review_id,
    user_name: row.user_name,
    user_image: row.user_image,
    content: row.content,
    score: row.score,
    thumbs_up_count: row.thumbs_up_count,
    review_created_version: row.review_created_version,
    review_datetime: row.review_datetime,
    reply_content: row.reply_content,
    replied_at: row.replied_at,
    app_version: row.app_version,
    timestamp_unix: toNumberOrNull(row.timestamp_unix),
    timestamp_formatted: row.timestamp_formatted,
    source: row.source,
    is_analyzed: row.is_analyzed,
    sentiment_result: row.sentiment_result,
    confidence_score: row.confidence_score,
    createdAt: row.created_at
  }));

  return {
    total_results: total,
    data
  };
};

const createReview = async reviewData => {
  return await prisma.review.create({
    data: reviewData
  });
};

module.exports = {
  getReviewsService,
  createReview
};
