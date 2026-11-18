const express = require('express');
const router = express.Router();
const {
  createProposal,
  getMyProposals,
  getAllProposals,
  getProposalById,
  updateProposalStatus,
} = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Student routes
router.post(
  '/',
  protect,
  authorize('student'),
  upload.single('document'),
  createProposal
);
router.get('/my', protect, authorize('student'), getMyProposals);

// Supervisor + Admin routes
router.get('/', protect, authorize('supervisor', 'admin'), getAllProposals);

// Any logged-in user
router.get('/:id', protect, getProposalById);

// Supervisor + Admin only
router.put(
  '/:id/status',
  protect,
  authorize('supervisor', 'admin'),
  updateProposalStatus
);

module.exports = router;