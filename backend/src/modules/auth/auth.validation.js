const { z } = require('zod');

const MIN_PASSWORD_LENGTH = 6;
const MIN_USERNAME_LENGTH = 3;

const loginSchema = z
  .object({
    username: z.string().optional(),
    email: z.string().email('Format email tidak valid').optional(),
    password: z.string().min(1, 'Password wajib diisi')
  })
  .refine(data => data.username || data.email, {
    message: 'Username atau email wajib diisi',
    path: ['username']
  });

const registerSchema = z.object({
  username: z
    .string()
    .min(MIN_USERNAME_LENGTH, 'Username must be at least 3 characters'),
  email: z.email('Invalid email format'),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, 'Password must be at least 6 characters')
});

module.exports = {
  loginSchema,
  registerSchema
};
