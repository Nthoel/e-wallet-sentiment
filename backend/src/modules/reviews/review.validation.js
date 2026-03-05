/* eslint-disable no-magic-numbers */
const { z } = require('zod');

const createReviewSchema = z.object({
  review_id: z.string().max(255),
  user_name: z.string().max(255).nullable().optional(),
  user_image: z.string().nullable().optional(),
  content: z.string(),
  score: z.number().int().min(1).max(5).nullable().optional(),
  thumbs_up_count: z.number().int().nonnegative().nullable().optional(),
  review_created_version: z.string().max(100).nullable().optional(),
  review_datetime: z
    .string()
    .transform(val => (val ? new Date(val) : null))
    .nullable()
    .optional(),
  reply_content: z.string().nullable().optional(),
  replied_at: z
    .string()
    .transform(val => (val ? new Date(val) : null))
    .nullable()
    .optional(),
  app_version: z.string().max(100).nullable().optional(),
  timestamp_unix: z
    .number()
    .transform(val => (val ? BigInt(val) : null))
    .nullable()
    .optional(),
  timestamp_formatted: z.string().max(50).nullable().optional(),
  source: z.string().max(50)
});

module.exports = {
  createReviewSchema
};
