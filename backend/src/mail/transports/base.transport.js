/**
 * @typedef {Object} MailOptions
 * @property {string} to - Alamat penerima
 * @property {string} subject - Subject email
 * @property {string} html - Body email (HTML)
 * @property {string} [text] - Body email (plain text)
 * @property {string} [from] - Alamat pengirim (override default)
 */

/**
 * @typedef {Object} MailSendResult
 * @property {string} transport - Nama transport yang digunakan
 * @property {string[]} accepted - Daftar alamat yang berhasil dikirim
 * @property {string} messageId - ID pesan unik
 */

/**
 * Base transport - kontrak dasar untuk semua mail transport.
 * Setiap transport harus mengimplementasikan method `send()`.
 *
 * @abstract
 */
class BaseTransport {
  /**
   * @param {string} name - Nama transport
   * @throws {Error} Jika di-instantiate langsung
   */
  constructor(name) {
    if (new.target === BaseTransport) {
      throw new Error('BaseTransport tidak bisa di-instantiate langsung');
    }

    /** @type {string} */
    this.name = name;
  }

  /**
   * Kirim email. Harus di-override oleh subclass.
   *
   * @param {MailOptions} _mailOptions - Opsi pengiriman email
   * @returns {Promise<MailSendResult>} Hasil pengiriman
   * @throws {Error} Jika belum diimplementasikan
   */
  async send(_mailOptions) {
    throw new Error(
      `Transport "${this.name}" belum mengimplementasikan send()`
    );
  }
}

module.exports = BaseTransport;
