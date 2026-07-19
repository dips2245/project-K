const { body, validationResult } = require('express-validator');

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const PASSWORD_MESSAGE = 'Password must be at least 8 characters with uppercase, lowercase, and a number';

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').matches(PASSWORD_REGEX).withMessage(PASSWORD_MESSAGE),
  body('phone').optional().trim(),
  body('termsAccepted').isBoolean().withMessage('You must accept the terms and conditions'),
  handleErrors,
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleErrors,
];

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').matches(PASSWORD_REGEX).withMessage(PASSWORD_MESSAGE),
  handleErrors,
];

module.exports = { registerRules, loginRules, changePasswordRules };
