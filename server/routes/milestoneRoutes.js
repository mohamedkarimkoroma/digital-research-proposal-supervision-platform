const express = require('express');
const router = express.Router();
const {
  createMilestone,
  getMilestonesForProposal,
  updateMilestoneStatus,
  deleteMilestone,
} = require('../controllers/milestoneController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Supervisor creates a milestone
router.post('/:proposalId', protect, authorize('supervisor'), createMilestone);

// Anyone logged in can view milestones for a proposal
router.get('/proposal/:proposalId', protect, getMilestonesForProposal);

// Update status (student or supervisor)
router.put('/:id', protect, updateMilestoneStatus);

// Supervisor deletes
router.delete('/:id', protect, authorize('supervisor'), deleteMilestone);

module.exports = router;