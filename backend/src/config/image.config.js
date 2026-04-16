const path = require('path');

const DEFAULT_MAX_FILE_SIZE_MB = 5;
const DEFAULT_API_PORT = '3001';
// eslint-disable-next-line no-magic-numbers
const BYTES_PER_MB = 1024 * 1024;
const DEFAULT_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

/**
 * Fungsi untuk memastikan bahwa serve path selalu diawali dengan slash dan tidak diakhiri dengan slash.
 * Jika tidak diberikan, default ke "/uploads".
 * @param {string} value - Nilai serve path dari environment variable
 * @returns {string} Serve path yang sudah dinormalisasi
 */
const normalizeServePath = value => {
  if (!value) {
    return '/uploads';
  }

  return value.startsWith('/') ? value : `/${value}`;
};

/**
 * Fungsi untuk menyelesaikan path upload menjadi path absolut.
 * @param {string} value - Path upload dari environment variable
 * @returns {string} Path upload yang sudah dinormalisasi menjadi path absolut
 */
const resolveUploadDir = value => {
  const uploadDir = value || 'uploads';
  return path.isAbsolute(uploadDir)
    ? uploadDir
    : path.resolve(process.cwd(), uploadDir);
};

/**
 * Fungsi untuk mengonversi nilai menjadi angka positif.
 * @param {*} value - Nilai yang ingin dikonversi
 * @param {*} fallback - Nilai fallback jika konversi gagal
 * @returns {number} Angka positif atau nilai fallback
 */
const toPositiveNumber = (value, fallback) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

/**
 * Fungsi untuk membangun konfigurasi gambar berdasarkan environment variables.
 * @returns {Object} Konfigurasi gambar yang sudah diproses
 */
const buildImageConfig = () => {
  const provider = (process.env.IMAGE_PROVIDER || 'local').toLowerCase();
  const localServePath = normalizeServePath(process.env.IMAGE_LOCAL_SERVE_PATH);
  const localUploadAbsoluteDir = resolveUploadDir(
    process.env.IMAGE_LOCAL_UPLOAD_DIR
  );
  const apiBaseUrl =
    process.env.API_BASE_URL ||
    `http://localhost:${process.env.PORT || DEFAULT_API_PORT}`;
  const localPublicBaseUrl =
    process.env.IMAGE_LOCAL_PUBLIC_BASE_URL || `${apiBaseUrl}${localServePath}`;

  const allowedMimeTypesRaw = process.env.IMAGE_ALLOWED_MIME_TYPES;
  const allowedMimeTypes = allowedMimeTypesRaw
    ? allowedMimeTypesRaw
      .split(',')
      .map(type => type.trim())
      .filter(Boolean)
    : DEFAULT_ALLOWED_MIME_TYPES;

  const maxFileSizeMb = toPositiveNumber(
    process.env.IMAGE_MAX_FILE_SIZE_MB,
    DEFAULT_MAX_FILE_SIZE_MB
  );

  return {
    provider,
    maxFileSizeBytes: maxFileSizeMb * BYTES_PER_MB,
    allowedMimeTypes,
    localServePath,
    localUploadAbsoluteDir,
    localPublicBaseUrl: localPublicBaseUrl.replace(/\/$/, ''),
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
      folder: process.env.CLOUDINARY_FOLDER || 'e-wallet-sentiment'
    }
  };
};

module.exports = buildImageConfig;
