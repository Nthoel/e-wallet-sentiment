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

module.exports = {
  forgetPasswordSchema
};
