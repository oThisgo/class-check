const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router({ mergeParams: true }); 

router.post('/', authMiddleware, feedbackController.submitFeedback);
router.get('/', authMiddleware, feedbackController.getFeedbackByEvento);

module.exports = router;