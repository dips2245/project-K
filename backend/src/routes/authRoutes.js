const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { register, login, refreshToken, getMe, verifyEmail } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerRules, loginRules } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { prisma } = require('../config/db');

router.post('/register', authLimiter, registerRules, register);
router.get('/verify-email', verifyEmail);
router.post('/login', authLimiter, loginRules, login);
router.post('/refresh', authLimiter, refreshToken);
router.post('/logout', protect, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = require('jsonwebtoken').decode(token);
    if (decoded && decoded.exp) {
      const hash = crypto.createHash('sha256').update(token).digest('hex');
      await prisma.blacklistedToken.create({
        data: {
          tokenHash: hash,
          expiresAt: new Date(decoded.exp * 1000),
        },
      });
    }
    await prisma.user.update({
      where: { id: req.user.id },
      data: { refreshToken: null },
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Logout failed' });
  }
});
router.get('/me', protect, getMe);

module.exports = router;
