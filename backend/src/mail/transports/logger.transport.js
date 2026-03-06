const logger = require('../../config/logger.config');
const BaseTransport = require('./base.transport');

/**
 * Logger transport - mencatat email ke winston logger.
 * Digunakan sebagai default transport untuk development/testing.
 *
 * @extends BaseTransport
 */
class LoggerTransport extends BaseTransport {
  constructor() {
    super('logger');
  }

  /**
   * Catat email ke winston logger (tidak benar-benar mengirim).
   *
   * @param {import('./base.transport').MailOptions} mailOptions - Opsi pengiriman email
   * @returns {Promise<import('./base.transport').MailSendResult>} Hasil log
   */
  async send(mailOptions) {
    const { to, subject, html, text, from } = mailOptions;

    logger.info('=== MAIL (logger transport) ===');
    logger.info(`From   : ${from || '(default)'}`);
    logger.info(`To     : ${to}`);
    logger.info(`Subject: ${subject}`);
    logger.info(`Body   : ${text || html}`);
    logger.info('=== END MAIL ===');

    return {
      transport: this.name,
      accepted: [to],
      messageId: `logger-${Date.now()}`
    };
  }
}

module.exports = LoggerTransport;
