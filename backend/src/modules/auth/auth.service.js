const crypto = require('crypto');
const { prisma } = require('e-wallet-sentiment-database');
const { sendMail } = require('../../mail');

const RESET_TOKEN_BYTES = 32;
const ONE_HOUR_IN_MILLISECONDS = 3600000;
const VERIFICATION_TABLE_NAME = 'user_tokens';

/**
 * Service untuk handle forget password
 * Mengirim email reset password jika user terdaftar
 * @param {string} email - Email user
 */
const forgetPassword = async email => {
  // Cek apakah email terdaftar di database
  const user = await prisma.user.findUnique({
    where: { email }
  });

  // Jika email tidak terdaftar, langsung return
  // Tetap return success untuk keamanan (tidak kasih tahu email tidak terdaftar)
  if (!user) {
    return;
  }

  // Generate random token untuk reset password
  const token = crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Set expired 1 jam dari sekarang
  const expiresAt = new Date(Date.now() + ONE_HOUR_IN_MILLISECONDS);

  // Simpan token verification reset password
  // Catatan: di schema project ini tabel verification dimapping sebagai user_tokens
  await prisma.userToken.create({
    data: {
      userId: user.id,
      type: 'PASSWORD_RESET',
      tokenHash: tokenHash,
      expiresAt: expiresAt,
      isUsed: false
    }
  });

  // Buat link reset password
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  // Kirim email berisi link reset password
  await sendMail({
    to: email,
    subject: 'Reset Password - E-Wallet Sentiment',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Reset Password</h2>
        <p>Halo <strong>${user.username}</strong>,</p>
        <p>Kami menerima permintaan untuk reset password akun Anda.</p>
        <p>Klik tombol di bawah ini untuk reset password:</p>
        <a href="${resetLink}" 
           style="display: inline-block; padding: 12px 24px; background-color: #007bff; 
                  color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Atau copy link berikut ke browser Anda:</p>
        <p style="word-break: break-all; color: #666;">${resetLink}</p>
        <p style="color: #999; font-size: 14px; margin-top: 30px;">
          Link ini akan kedaluwarsa dalam 1 jam.<br>
          Jika Anda tidak meminta reset password, abaikan email ini.
        </p>
      </div>
    `
  });
};

module.exports = {
  forgetPassword,
  VERIFICATION_TABLE_NAME
};
