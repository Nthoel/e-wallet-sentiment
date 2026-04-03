const profileResponseSchema = {
  id: {
    type: 'string',
    format: 'uuid',
    description: 'User ID'
  },
  email: {
    type: 'string',
    format: 'email',
    description: 'User email'
  },
  username: {
    type: 'string',
    description: 'Username'
  },
  role: {
    type: 'string',
    enum: ['ADMIN', 'EDITOR', 'VIEWER'],
    description: 'User role'
  },
  avatarUrl: {
    type: 'string',
    nullable: true,
    description: 'Avatar URL'
  },
  isVerified: {
    type: 'boolean',
    description: 'Email verification status'
  },
  verifiedAt: {
    type: 'string',
    format: 'date-time',
    nullable: true,
    description: 'Verification timestamp'
  },
  lastLoginAt: {
    type: 'string',
    format: 'date-time',
    nullable: true,
    description: 'Last login timestamp'
  },
  createdAt: {
    type: 'string',
    format: 'date-time',
    description: 'Account creation timestamp'
  }
};

const validateGetProfile = (req, _res, next) => {
  next();
};

module.exports = {
  profileResponseSchema,
  validateGetProfile
};
