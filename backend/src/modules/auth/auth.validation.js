const { z } = require('zod');

const EMAIL_REQUIRED_MESSAGE = 'Email is required';
const EMAIL_INVALID_MESSAGE = 'Email must be a valid email address';

const forgetPasswordSchema = z
  .object({
    email: z.unknown().optional()
  })
  .strip()
  .superRefine((data, ctx) => {
    const email =
      typeof data.email === 'string' ? data.email.trim() : data.email;

    if (typeof email !== 'string' || email.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: EMAIL_REQUIRED_MESSAGE
      });
      return;
    }

    const emailValidation = z
      .string()
      .email(EMAIL_INVALID_MESSAGE)
      .safeParse(email);

    if (!emailValidation.success) {
      ctx.addIssue({
        code: 'custom',
        path: ['email'],
        message: EMAIL_INVALID_MESSAGE
      });
    }
  })
  .transform(data => ({
    email: data.email.trim()
  }));

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

const verifiTokenSchema = z.object({
  token: z
    .string({
      required_error: 'Token is required'
    })
    .min(1, 'Token cannot be empty')
});
const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token wajib diisi')
});

module.exports = {
  loginSchema,
  registerSchema,
  forgetPasswordSchema,
  verifiTokenSchema,
  refreshTokenSchema
};
