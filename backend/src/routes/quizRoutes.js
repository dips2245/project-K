const express = require('express');
const router = express.Router();
const {
    getQuiz,
    submitQuiz,
    getQuizResults,
    getProductsByTags,
} = require('../controllers/quizController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', getQuiz);
router.post('/submit', optionalAuth, submitQuiz);
router.get('/results/:responseId', getQuizResults);
router.get('/products-by-tags', getProductsByTags);

module.exports = router;
