const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getCoachAdvice, getChatHistory } = require('../controllers/aiController');

router.use(authMiddleware);

router.post('/chat', getCoachAdvice);
router.get('/history', getChatHistory);

module.exports = router;