const ApiError = require('../../utils/api-error');
const getImageConfig = require('../../config/image.config');
const localProvider = require('./providers/local.provider');
const cloudinaryProvider = require('./providers/cloudinary.provider');

// Daftar provider yang didukung, tambahkan di sini jika ingin menambah provider baru
const PROVIDERS = {
  local: localProvider,
  cloudinary: cloudinaryProvider
};

/**
 * Fungsi untuk mendapatkan provider gambar yang sesuai berdasarkan konfigurasi.
 * @returns {Object} Provider gambar yang sudah dipilih
 * @throws {ApiError} Jika provider yang dipilih tidak didukung
 */
const getProvider = () => {
  const { provider } = getImageConfig();
  const selectedProvider = PROVIDERS[provider];

  if (!selectedProvider) {
    throw ApiError.server(
      `Unsupported IMAGE_PROVIDER "${provider}". Use "local" or "cloudinary"`
    );
  }

  return selectedProvider;
};

/**
 * Fungsi untuk mengunggah gambar ke provider yang sesuai.
 * @param {Object} file - File gambar yang ingin diunggah
 * @param {Object} options - Opsi tambahan untuk proses unggah
 * @returns {Promise<Object>} Informasi tentang gambar yang berhasil diunggah
 */
const uploadImage = async (file, options = {}) => {
  if (!file || !file.buffer) {
    throw ApiError.badRequest('Image file is required');
  }

  const provider = getProvider();
  return provider.upload(file, options);
};

module.exports = {
  uploadImage,
  PROVIDERS
};
