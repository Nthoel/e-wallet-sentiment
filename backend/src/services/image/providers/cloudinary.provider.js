const { v2: cloudinary } = require('cloudinary');
const ApiError = require('../../../utils/api-error');
const getImageConfig = require('../../../config/image.config');

/**
 * @typedef {Object} CloudinaryUploadResult
 * @property {'cloudinary'} provider
 * @property {string} url
 * @property {string} key
 */

/**
 * Fungsi untuk memastikan konfigurasi Cloudinary sudah diatur.
 * @returns {Object} Konfigurasi Cloudinary yang sudah diatur
 * @throws {ApiError} Jika kredensial Cloudinary tidak lengkap
 */
const ensureCloudinaryConfig = () => {
  const imageConfig = getImageConfig();
  const { cloudinary: cloudinaryConfig } = imageConfig;

  if (
    !cloudinaryConfig.cloudName ||
    !cloudinaryConfig.apiKey ||
    !cloudinaryConfig.apiSecret
  ) {
    throw ApiError.badRequest('Cloudinary credentials are not configured');
  }

  cloudinary.config({
    cloud_name: cloudinaryConfig.cloudName,
    api_key: cloudinaryConfig.apiKey,
    api_secret: cloudinaryConfig.apiSecret,
    secure: true
  });

  return cloudinaryConfig;
};

/**
 * Fungsi untuk mengunggah gambar ke Cloudinary menggunakan stream.
 * @param {Buffer} buffer - Buffer file gambar
 * @param {Object} options - Opsi tambahan untuk proses unggah
 * @returns {Promise<import('cloudinary').UploadApiResponse>} Informasi hasil unggah dari Cloudinary
 */
const uploadWithStream = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error('Cloudinary returned empty upload result'));
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

/**
 * Fungsi untuk mengunggah gambar ke Cloudinary.
 * @param {Object} file - File gambar yang ingin diunggah
 * @param {Object} options - Opsi tambahan untuk proses unggah
 * @returns {Promise<CloudinaryUploadResult>} Informasi gambar yang berhasil diunggah
 */
const upload = async (file, options = {}) => {
  const cloudinaryConfig = ensureCloudinaryConfig();
  const folder = [cloudinaryConfig.folder, options.folder]
    .filter(Boolean)
    .join('/')
    .replace(/\/+/g, '/');

  try {
    const result = await uploadWithStream(file.buffer, {
      resource_type: 'image',
      folder,
      public_id_prefix: options.filenamePrefix,
      overwrite: false,
      unique_filename: true
    });

    return {
      provider: 'cloudinary',
      url: result.secure_url || result.url,
      key: result.public_id
    };
  } catch (error) {
    throw ApiError.badGateway(`Cloudinary upload failed: ${error.message}`);
  }
};

module.exports = {
  upload
};
