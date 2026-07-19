const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const { auditLog } = require('../middleware/audit');
const upload = require('../middleware/upload');

router.get('/', getProducts);
router.get('/:slug', getProduct);
router.post('/', protect, adminOnly, auditLog('create', 'product'), upload.array('images', 5), createProduct);
router.put('/:id', protect, adminOnly, auditLog('update', 'product'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, adminOnly, auditLog('delete', 'product'), deleteProduct);

module.exports = router;
