/**
 * Middleware untuk validasi request dengan Joi schema
 */
const BAD_REQUEST_STATUS = 400;

const validate = schema => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Tampilkan semua error sekaligus
      stripUnknown: true // Hapus field yang tidak ada di schema
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      return res.status(BAD_REQUEST_STATUS).json({
        status: 'error',
        message: errorMessage
      });
    }

    // Replace body dengan value yang sudah divalidasi
    req.body = value;
    next();
  };
};

module.exports = { validate };
