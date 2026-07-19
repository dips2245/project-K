const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');
const { auditLog } = require('../middleware/audit');
const upload = require('../middleware/upload');

router.get('/', getCategories);
router.get('/:slug', getCategory);
router.post('/', protect, adminOnly, auditLog('create', 'category'), upload.single('image'), createCategory);
router.put('/:id', protect, adminOnly, auditLog('update', 'category'), upload.single('image'), updateCategory);
router.delete('/:id', protect, adminOnly, auditLog('delete', 'category'), deleteCategory);

module.exports = router;
