const { prisma } = require('e-wallet-sentiment-database');

const getDashboardSummaryData = async () => {
  // Hitung komposisi sentiment_result dari database
  const dbResults = await prisma.review.groupBy({
    by: ['sentiment_result'],
    _count: {
      sentiment_result: true
    }
  });

  // Terapkan default 0 jika kategori sentimen kosong
  const sentimentPie = {
    positive: 0,
    negative: 0,
    neutral: 0
  };

  const totalUlasan = await prisma.review.count();

  // Petakan data dari DB ke object sentimentPie
  dbResults.forEach(row => {
    if (row.sentiment_result) {
      const sentiment = row.sentiment_result.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(sentimentPie, sentiment)) {
        sentimentPie[sentiment] = row._count.sentiment_result;
      }
    }
  });

  // Isi ringkasan_sentimen dengan lorem ipsum sementara
  const ringkasanSentimen =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

  return {
    total_ulasan: totalUlasan,
    sentiment_pie: sentimentPie,
    ringkasan_sentimen: ringkasanSentimen
  };
};

module.exports = { getDashboardSummaryData };
