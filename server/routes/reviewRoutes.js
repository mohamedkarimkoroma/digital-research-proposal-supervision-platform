const express = require('express');
const router = express.Router();
const {
  addReview,
  getReviewsForProposal,
  getMyReviews,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:proposalId', protect, authorize('supervisor'), addReview);
router.get('/my', protect, authorize('supervisor'), getMyReviews);
router.get('/proposal/:proposalId', protect, getReviewsForProposal);

module.exports = router;