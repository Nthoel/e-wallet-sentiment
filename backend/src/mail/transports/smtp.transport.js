const nodemailer = require('nodemailer');
const BaseTransport = require('./base.transport');

const DEFAULT_SMTP_PORT = 587;

/**
 * SMTP transport - mengirim email via SMTP server menggunakan nodemailer.
 *
 * Env yang dibutuhkan:
 * - `SMTP_HOST` - Hostname SMTP server
 * - `SMTP_PORT` - Port SMTP (default: 587)
 * - `SMTP_USER` - Username SMTP
 * - `SMTP_PASS` - Password SMTP
 * - `SMTP_SECURE` - Gunakan TLS ('true' | 'false')
 * - `MAIL_FROM` - Alamat pengirim default
 *
 * @extends BaseTransport
 */
class SmtpTransport extends BaseTransport {
  constructor() {
    super('smtp');

    /** @type {import('nodemailer').Transporter} */
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || DEFAULT_SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  /**
   * Kirim email via SMTP server.
   *
   * @param {import('./base.transport').MailOptions} mailOptions - Opsi pengiriman email
   * @returns {Promise<import('./base.transport').MailSendResult>} Hasil pengiriman
   */
  async send(mailOptions) {
    const info = await this.transporter.sendMail({
      from: mailOptions.from || process.env.MAIL_FROM,
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

module.exports = SmtpTransport;
