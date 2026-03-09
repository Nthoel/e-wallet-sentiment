const Joi = require('joi');

const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  })
});

module.exports = {
  forgetPasswordSchema
};
