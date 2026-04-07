const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const getImageConfig = require('../../../config/image.config');

const MIME_EXTENSION_MAP = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

/**
 * Membersihkan segment path.
 * @param {string} value - Segment path
 * @returns {string} Segment path yang telah dibersihkan
 */
const sanitizeSegment = value => value.replace(/[^a-zA-Z0-9_-]/g, '');

/**
 * Normalisasi path folder.
 * @param {string} folder - Path folder
 * @returns {string} Path folder yang telah dinormalisasi
 */
const normalizeFolder = folder => {
  return folder
    .split(/[\\/]+/)
    .map(part => sanitizeSegment(part))
    .filter(Boolean)
    .join('/');
};

/**
 * Mengonversi path ke format POSIX.
 * @param {string} value - Path yang ingin dikonversi
 * @returns {string} Path dalam format POSIX
 */
const toPosixPath = value => value.split(path.sep).join('/');

/**
 * Mendapatkan ekstensi file berdasarkan tipe MIME atau nama file.
 * @param {Object} file - File gambar
 * @returns {string} Ekstensi file
 */
const getFileExtension = file => {
  const extensionFromMime = MIME_EXTENSION_MAP[file.mimetype];

  if (extensionFromMime) {
    return extensionFromMime;
  }

  const extensionFromName = path
    .extname(file.originalname || '')
    .replace('.', '');

  if (extensionFromName) {
    return extensionFromName.toLowerCase();
  }

  return 'jpg';
};

/**
 * Mengunggah gambar ke direktori lokal.
 * @param {Object} file - File gambar yang ingin diunggah
 * @param {Object} options - Opsi tambahan untuk proses unggah
 * @returns {Promise<Object>} Informasi gambar yang berhasil diunggah
 */
const upload = async (file, options = {}) => {
  const imageConfig = getImageConfig();
  const folder = options.folder ? normalizeFolder(options.folder) : '';
  const prefix = options.filenamePrefix
    ? `${sanitizeSegment(String(options.filenamePrefix))}-`
    : '';
  const extension = getFileExtension(file);
  // eslint-disable-next-line no-magic-numbers
  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
  const filename = `${prefix}${uniqueSuffix}.${extension}`;

  const folderSegments = folder ? folder.split('/') : [];
  const targetDir = path.join(
    imageConfig.localUploadAbsoluteDir,
    ...folderSegments
  );

  await fs.mkdir(targetDir, { recursive: true });

  const outputPath = path.join(targetDir, filename);
  await fs.writeFile(outputPath, file.buffer);

  const relativePath = folder ? `${folder}/${filename}` : filename;

  return {
    provider: 'local',
    url: `${imageConfig.localPublicBaseUrl}/${relativePath}`,
    key: toPosixPath(relativePath)
  };
};

module.exports = {
  upload
};
