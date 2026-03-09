const { z } = require('zod');

const MIN_PASSWORD_LENGTH = 6;
const MIN_USERNAME_LENGTH = 3;

const registerSchema = z.object({
  username: z.string().min(MIN_USERNAME_LENGTH, 'Username must be at least 3 characters'),
  email: z.email('Invalid email format'),
  password: z.string().min(MIN_PASSWORD_LENGTH, 'Password must be at least 6 characters')
});

module.exports = { registerSchema };
