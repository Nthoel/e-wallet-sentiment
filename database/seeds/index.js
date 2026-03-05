const path = require("path");
const dotenv = require("dotenv");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const result = dotenv.config({ path: path.join(__dirname, "../.env") });

if (result.error) {
  console.error("Failed to load .env file:", result.error);
}

const dbUrl = process.env.DATABASE_URL;

const { PrismaClient } = require("@prisma/client");

const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding reviews...");

  const sampleReviews = [
    {
      id: "gp:AOqpTOE1_001",
      user_name: "Budi Santoso",
      user_image: "https://play-lh.googleusercontent.com/a/A1",
      content:
        "Aplikasi sangat membantu untuk transfer antar bank tanpa biaya.",
      score: 5,
      thumbs_up_count: 12,
      review_created_version: "2.4.1",
      review_datetime: "2024-02-25T10:00:00Z",
      reply_content: "Terima kasih atas ulasannya, Kak Budi!",
      replied_at: "2024-02-25T12:30:00Z",
      app_version: "2.4.1",
      timestamp_unix: 1708855200,
      timestamp_formatted: "2024-02-25 10:00:00",
      source: "google_play",
      is_analyzed: false,
    },
    {
      id: "gp:AOqpTOE1_002",
      user_name: "Siti Aminah",
      user_image: "https://play-lh.googleusercontent.com/a/A2",
      content: "UI/UX nya simpel dan elegan, suka banget sama dark modenya.",
      score: 4,
      thumbs_up_count: 5,
      review_created_version: "2.4.0",
      review_datetime: "2024-02-26T08:15:00Z",
      reply_content: "Senang mendengarnya! Terus gunakan aplikasi kami ya.",
      replied_at: "2024-02-26T09:00:00Z",
      app_version: "2.4.0",
      timestamp_unix: 1708935300,
      timestamp_formatted: "2024-02-26 08:15:00",
      source: "google_play",
      is_analyzed: false,
    },
    {
      id: "ap:12345678_003",
      user_name: "Andi Wijaya",
      user_image: "https://is1-ssl.mzstatic.com/image/thumb/A3",
      content: "Sering ada promo cashback yang menarik, lumayan buat jajan.",
      score: 5,
      thumbs_up_count: 20,
      review_created_version: "2.4.1",
      review_datetime: "2024-02-27T14:20:00Z",
      reply_content: null,
      replied_at: null,
      app_version: "2.4.1",
      timestamp_unix: 1709043600,
      timestamp_formatted: "2024-02-27 14:20:00",
      source: "app_store",
      is_analyzed: false,
    },
    {
      id: "gp:AOqpTOE1_004",
      user_name: "Lestari Putri",
      user_image: "https://play-lh.googleusercontent.com/a/A4",
      content:
        "Kadang loadingnya agak lama kalau pas sinyal lagi kurang stabil.",
      score: 3,
      thumbs_up_count: 2,
      review_created_version: "2.3.9",
      review_datetime: "2024-02-24T11:45:00Z",
      reply_content:
        "Maaf atas ketidaknyamanannya. Kami akan terus optimasi performanya.",
      replied_at: "2024-02-24T15:00:00Z",
      app_version: "2.3.9",
      timestamp_unix: 1708775100,
      timestamp_formatted: "2024-02-24 11:45:00",
      source: "google_play",
      is_analyzed: false,
    },
    {
      id: "ap:12345678_005",
      user_name: "Rian Hidayat",
      user_image: "https://is1-ssl.mzstatic.com/image/thumb/A5",
      content:
        "Top up saldo gampang banget lewat minimarket atau mobile banking.",
      score: 5,
      thumbs_up_count: 8,
      review_created_version: "2.4.1",
      review_datetime: "2024-02-28T09:10:00Z",
      reply_content: "Terima kasih! Kami senang fitur top-up memudahkan Anda.",
      replied_at: "2024-02-28T10:30:00Z",
      app_version: "2.4.1",
      timestamp_unix: 1709111400,
      timestamp_formatted: "2024-02-28 09:10:00",
      source: "app_store",
      is_analyzed: false,
    },
    {
      id: "gp:AOqpTOE1_006",
      user_name: "Dewi Sartika",
      user_image: "https://play-lh.googleusercontent.com/a/A6",
      content:
        "Customer servicenya responsif saat ada kendala transaksi pending.",
      score: 4,
      thumbs_up_count: 15,
      review_created_version: "2.4.1",
      review_datetime: "2024-02-22T16:30:00Z",
      reply_content: "Kami selalu siap membantu Anda!",
      replied_at: "2024-02-22T17:00:00Z",
      app_version: "2.4.1",
      timestamp_unix: 1708619400,
      timestamp_formatted: "2024-02-22 16:30:00",
      source: "google_play",
      is_analyzed: false,
    },
    {
      id: "gp:AOqpTOE1_007",
      user_name: "Fajar Ramadhan",
      user_image: "https://play-lh.googleusercontent.com/a/A7",
      content:
        "Fitur bayar tagihan lengkap banget, dari listrik sampai asuransi.",
      score: 5,
      thumbs_up_count: 6,
      review_created_version: "2.4.1",
      review_datetime: "2024-02-23T20:10:00Z",
      reply_content: null,
      replied_at: null,
      app_version: "2.4.1",
      timestamp_unix: 1708719000,
      timestamp_formatted: "2024-02-23 20:10:00",
      source: "google_play",
      is_analyzed: false,
    },
    {
      id: "ap:12345678_008",
      user_name: "Anisa Bahar",
      user_image: "https://is1-ssl.mzstatic.com/image/thumb/A8",
      content: "Verifikasi akunnya cepat, tidak sampai 24 jam sudah beres.",
      score: 5,
      thumbs_up_count: 30,
      review_created_version: "2.4.0",
      review_datetime: "2024-02-21T10:00:00Z",
      reply_content: "Sip! Selamat menikmati layanan penuh kami.",
      replied_at: "2024-02-21T11:00:00Z",
      app_version: "2.4.0",
      timestamp_unix: 1708512000,
      timestamp_formatted: "2024-02-21 10:00:00",
      source: "app_store",
      is_analyzed: false,
    },
    {
      id: "gp:AOqpTOE1_009",
      user_name: "Bambang Pamungkas",
      user_image: "https://play-lh.googleusercontent.com/a/A9",
      content: "Kadang ada bug saat scan QRIS, tapi jarang terjadi sih.",
      score: 3,
      thumbs_up_count: 4,
      review_created_version: "2.4.1",
      review_datetime: "2024-02-20T12:00:00Z",
      reply_content:
        "Terima kasih laporannya. Tim teknis kami sedang memperbaikinya.",
      replied_at: "2024-02-20T14:30:00Z",
      app_version: "2.4.1",
      timestamp_unix: 1708430400,
      timestamp_formatted: "2024-02-20 12:00:00",
      source: "google_play",
      is_analyzed: false,
    },
    {
      id: "gp:AOqpTOE1_010",
      user_name: "Eka Saputra",
      user_image: "https://play-lh.googleusercontent.com/a/A10",
      content: "Sangat recommended untuk yang cari e-wallet praktis dan aman.",
      score: 5,
      thumbs_up_count: 10,
      review_created_version: "2.4.1",
      review_datetime: "2024-02-20T15:00:00Z",
      reply_content: null,
      replied_at: null,
      app_version: "2.4.1",
      timestamp_unix: 1708441200,
      timestamp_formatted: "2024-02-20 15:00:00",
      source: "google_play",
      is_analyzed: false,
    },
  ];

  for (const data of sampleReviews) {
    const review = await prisma.review.upsert({
      where: { id: data.id },
      update: {
        user_name: data.user_name,
        user_image: data.user_image,
        content: data.content,
        score: data.score,
        thumbs_up_count: data.thumbs_up_count,
        review_created_version: data.review_created_version,
        review_datetime: new Date(data.review_datetime),
        reply_content: data.reply_content,
        replied_at: data.replied_at ? new Date(data.replied_at) : null,
        app_version: data.app_version,
        timestamp_unix: BigInt(data.timestamp_unix),
        timestamp_formatted: data.timestamp_formatted,
        source: data.source,
        is_analyzed: data.is_analyzed,
      },
      create: {
        id: data.id,
        user_name: data.user_name,
        user_image: data.user_image,
        content: data.content,
        score: data.score,
        thumbs_up_count: data.thumbs_up_count,
        review_created_version: data.review_created_version,
        review_datetime: new Date(data.review_datetime),
        reply_content: data.reply_content,
        replied_at: data.replied_at ? new Date(data.replied_at) : null,
        app_version: data.app_version,
        timestamp_unix: BigInt(data.timestamp_unix),
        timestamp_formatted: data.timestamp_formatted,
        source: data.source,
        is_analyzed: data.is_analyzed,
        created_at: new Date(),
      },
    });
    console.log(`Seeded review: ${review.id}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
