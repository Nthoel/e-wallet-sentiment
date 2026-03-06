const LoggerTransport = require('./transports/logger.transport');
const SmtpTransport = require('./transports/smtp.transport');
const GoogleTransport = require('./transports/google.transport');

/**
 * @typedef {'logger' | 'smtp' | 'google'} TransportName
 */

/**
 * Map nama transport ke class-nya.
 * @type {Record<TransportName, new () => import('./transports/base.transport')>}
 */
const TRANSPORTS = {
  logger: LoggerTransport,
  smtp: SmtpTransport,
  google: GoogleTransport
};

/** @type {TransportName} */
const DEFAULT_TRANSPORT = 'logger';

/**
 * Buat instance transport berdasarkan nama.
 *
 * @param {TransportName} [name] - Nama transport.
 *   Default: `process.env.MAIL_TRANSPORT` atau `'logger'`.
 * @returns {import('./transports/base.transport')} Transport instance
 * @throws {Error} Jika nama transport tidak dikenali
 */
const createTransport = name => {
  const transportName = name || process.env.MAIL_TRANSPORT || DEFAULT_TRANSPORT;
  const TransportClass = TRANSPORTS[transportName];

  if (!TransportClass) {
    const available = Object.keys(TRANSPORTS).join(', ');
    throw new Error(
      `Transport "${transportName}" tidak ditemukan. Tersedia: ${available}`
    );
  }

  return new TransportClass();
};

module.exports = { createTransport, TRANSPORTS, DEFAULT_TRANSPORT };
