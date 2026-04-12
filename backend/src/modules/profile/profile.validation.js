const { z } = require('zod');

const MIN_USERNAME_LENGTH = 3;

const updateProfileSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(
        MIN_USERNAME_LENGTH,
        `Username must be at least ${MIN_USERNAME_LENGTH} characters`
      )
      .optional(),
    email: z.string().trim().email('Invalid email format').optional()
  })
  .refine(data => data.username !== undefined || data.email !== undefined, {
    message: 'At least one field (username or email) is required',
    path: ['username']
  });

module.exports = {
  updateProfileSchema
};
