const logger = require('../config/logger.config');
const { createTransport } = require('./mail.transport');
const templates = require('./templates');

/**
 * @typedef {import('./transports/base.transport').MailOptions} MailOptions
 * @typedef {import('./transports/base.transport').MailSendResult} MailSendResult
 * @typedef {keyof typeof templates} TemplateName
 */

/** @type {import('./transports/base.transport') | null} */
let transportInstance = null;

/**
 * Ambil transport instance (lazy singleton).
 * Transport dibuat sekali saat pertama kali dipanggil.
 *
 * @returns {import('./transports/base.transport')} Transport instance aktif
 */
const getTransport = () => {
  if (!transportInstance) {
    transportInstance = createTransport();
    logger.info(`Mail transport aktif: ${transportInstance.name}`);
  }
  return transportInstance;
};

/**
 * Kirim email langsung dengan mailOptions.
 *
 * @param {MailOptions} mailOptions - Opsi pengiriman email
 * @returns {Promise<MailSendResult>} Hasil pengiriman
 */
const sendMail = async mailOptions => {
  const transport = getTransport();
  return transport.send(mailOptions);
};

/**
 * Kirim email menggunakan template.
 *
 * @param {TemplateName} templateName - Nama template (welcome, resetPassword, notification)
 * @param {string} to - Alamat penerima
 * @param {object} data - Data yang diteruskan ke fungsi template
 * @param {Partial<MailOptions>} [overrides] - Override mailOptions (from, dll)
 * @returns {Promise<MailSendResult>} Hasil pengiriman
 * @throws {Error} Jika template tidak ditemukan
 */
const sendTemplateMail = async (templateName, to, data, overrides = {}) => {
  const templateFn = templates[templateName];
  if (!templateFn) {
    const available = Object.keys(templates).join(', ');
    throw new Error(
      `Template "${templateName}" tidak ditemukan. Tersedia: ${available}`
    );
  }

  const { subject, html, text } = templateFn(data);

  return sendMail({
    to,
    subject,
    html,
    text,
    ...overrides
  });
};

module.exports = {
  sendMail,
  sendTemplateMail,
  getTransport
};
