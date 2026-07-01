const express = require('express');
const router = express.Router();
const { getProfile, getMyOrders, changePassword, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { changePasswordRules } = require('../middleware/validate');

router.get('/me', protect, getProfile);
router.get('/orders', protect, getMyOrders);
router.put('/password', protect, changePasswordRules, changePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
