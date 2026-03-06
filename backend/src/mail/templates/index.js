/**
 * @typedef {Object} TemplateResult
 * @property {string} subject - Subject email
 * @property {string} html - Body email (HTML)
 * @property {string} text - Body email (plain text)
 */

/**
 * @typedef {Object} WelcomeData
 * @property {string} name - Nama user
 */

/**
 * @typedef {Object} ResetPasswordData
 * @property {string} name - Nama user
 * @property {string} resetLink - Link reset password
 */

/**
 * @typedef {Object} NotificationData
 * @property {string} title - Judul notifikasi
 * @property {string} message - Isi notifikasi
 */

/**
 * Dummy email templates.
 *
 * Setiap template adalah fungsi yang menerima data dan mengembalikan
 * object `{ subject, html, text }`.
 *
 * @type {Object<string, (data: object) => TemplateResult>}
 */
const templates = {
  /**
   * Template: Welcome email
   *
   * @param {WelcomeData} data
   * @returns {TemplateResult}
   */
  welcome: data => ({
    subject: 'Selamat Datang di E-Wallet Sentiment!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Selamat Datang, ${data.name}!</h1>
        <p>Terima kasih telah bergabung dengan E-Wallet Sentiment.</p>
        <p>Akun kamu sudah aktif dan siap digunakan.</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB;" />
        <p style="color: #6B7280; font-size: 12px;">
          Ini adalah email otomatis, mohon tidak membalas email ini.
        </p>
      </div>
    `,
    text: `Selamat Datang, ${data.name}!\n\nTerima kasih telah bergabung dengan E-Wallet Sentiment.\nAkun kamu sudah aktif dan siap digunakan.`
  }),

  /**
   * Template: Reset password
   *
   * @param {ResetPasswordData} data
   * @returns {TemplateResult}
   */
  resetPassword: data => ({
    subject: 'Reset Password - E-Wallet Sentiment',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">Reset Password</h1>
        <p>Halo ${data.name},</p>
        <p>Kami menerima permintaan untuk mereset password akun kamu.</p>
        <p>Klik tombol di bawah ini untuk mereset password:</p>
        <a href="${data.resetLink}"
           style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 6px;">
          Reset Password
        </a>
        <p style="margin-top: 16px; color: #6B7280;">
          Link ini akan kadaluarsa dalam 1 jam. Jika kamu tidak meminta reset password, abaikan email ini.
        </p>
        <hr style="border: none; border-top: 1px solid #E5E7EB;" />
        <p style="color: #6B7280; font-size: 12px;">
          Ini adalah email otomatis, mohon tidak membalas email ini.
        </p>
      </div>
    `,
    text: `Halo ${data.name},\n\nKami menerima permintaan untuk mereset password akun kamu.\nKlik link berikut: ${data.resetLink}\n\nLink ini akan kadaluarsa dalam 1 jam.`
  }),

  /**
   * Template: Notifikasi umum
   *
   * @param {NotificationData} data
   * @returns {TemplateResult}
   */
  notification: data => ({
    subject: `${data.title} - E-Wallet Sentiment`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4F46E5;">${data.title}</h1>
        <p>${data.message}</p>
        <hr style="border: none; border-top: 1px solid #E5E7EB;" />
        <p style="color: #6B7280; font-size: 12px;">
          Ini adalah email otomatis, mohon tidak membalas email ini.
        </p>
      </div>
    `,
    text: `${data.title}\n\n${data.message}`
  })
};

module.exports = templates;
