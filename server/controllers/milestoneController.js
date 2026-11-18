const Milestone = require('../models/Milestone');
const Proposal = require('../models/Proposal');

// @desc    Create a milestone for a proposal
// @route   POST /api/milestones/:proposalId
// @access  Private (supervisor only)
const createMilestone = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const { proposalId } = req.params;

    if (!title || !dueDate) {
      return res
        .status(400)
        .json({ message: 'Please add title and dueDate' });
    }

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const milestone = await Milestone.create({
      proposal: proposalId,
      supervisor: req.user._id,
      title,
      description: description || '',
      dueDate,
    });

    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all milestones for a proposal
// @route   GET /api/milestones/proposal/:proposalId
// @access  Private
const getMilestonesForProposal = async (req, res) => {
  try {
    const milestones = await Milestone.find({
      proposal: req.params.proposalId,
    })
      .populate('supervisor', 'fullName email')
      .sort('dueDate');

    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a milestone status
// @route   PUT /api/milestones/:id
// @access  Private
const updateMilestoneStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ['Not Started', 'In Progress', 'Completed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    milestone.status = status;
    milestone.completedAt = status === 'Completed' ? new Date() : null;
    await milestone.save();

    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a milestone
// @route   DELETE /api/milestones/:id
// @access  Private (supervisor only)
const deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByIdAndDelete(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    res.json({ message: 'Milestone deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMilestone,
  getMilestonesForProposal,
  updateMilestoneStatus,
  deleteMilestone,
};