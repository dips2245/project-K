const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    whatsappMessage,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');
const { auditLog } = require('../middleware/audit');

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.post('/whatsapp-message', whatsappMessage);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, adminOnly, auditLog('update-status', 'order'), updateOrderStatus);

module.exports = router;
