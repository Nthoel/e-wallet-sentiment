const nodemailer = require('nodemailer');
const BaseTransport = require('./base.transport');

/**
 * Google transport - mengirim email via Gmail menggunakan nodemailer.
 *
 * Env yang dibutuhkan:
 * - `GOOGLE_MAIL_USER` - Alamat email Gmail
 * - `GOOGLE_MAIL_APP_PASSWORD` - App Password dari Google Account
 * - `MAIL_FROM` - Alamat pengirim default (opsional, fallback ke GOOGLE_MAIL_USER)
 *
 * Catatan: Gunakan "App Password" dari Google Account, bukan password biasa.
 * @see https://support.google.com/accounts/answer/185833
 *
 * @extends BaseTransport
 */
class GoogleTransport extends BaseTransport {
  constructor() {
    super('google');

    /** @type {import('nodemailer').Transporter} */
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_MAIL_USER,
        pass: process.env.GOOGLE_MAIL_APP_PASSWORD
      }
    });
  }

  /**
   * Kirim email via Gmail.
   *
   * @param {import('./base.transport').MailOptions} mailOptions - Opsi pengiriman email
   * @returns {Promise<import('./base.transport').MailSendResult>} Hasil pengiriman
   */
  async send(mailOptions) {
    const info = await this.transporter.sendMail({
      from:
        mailOptions.from ||
        process.env.MAIL_FROM ||
        process.env.GOOGLE_MAIL_USER,
      to: mailOptions.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text
    });

    return {
      transport: this.name,
      accepted: info.accepted,
      messageId: info.messageId
    };
  }
}

module.exports = GoogleTransport;
