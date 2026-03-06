/**
 * Mail module - menyediakan service pengiriman email
 * dengan dukungan multiple transport (logger, smtp, google).
 *
 * @module mail
 *
 * @example
 * const { sendMail, sendTemplateMail } = require('./mail');
 *
 * // Kirim langsung
 * await sendMail({ to: 'user@mail.com', subject: 'Test', html: '<p>Hello</p>' });
 *
 * // Kirim pakai template
 * await sendTemplateMail('welcome', 'user@mail.com', { name: 'John' });
 */
const mailService = require('./service.mail');
const {
  createTransport,
  TRANSPORTS,
  DEFAULT_TRANSPORT
} = require('./mail.transport');
const templates = require('./templates');

module.exports = {
  ...mailService,
  createTransport,
  TRANSPORTS,
  DEFAULT_TRANSPORT,
  templates
};
