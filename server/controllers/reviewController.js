const Review = require('../models/Review');
const Proposal = require('../models/Proposal');

// @desc    Add a review to a proposal
// @route   POST /api/reviews/:proposalId
// @access  Private (supervisor only)
const addReview = async (req, res) => {
  try {
    const { feedback, decision, rating } = req.body;
    const { proposalId } = req.params;

    if (!feedback || !decision) {
      return res
        .status(400)
        .json({ message: 'Please add feedback and decision' });
    }

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    const review = await Review.create({
      proposal: proposalId,
      supervisor: req.user._id,
      feedback,
      decision,
      rating: rating || 3,
    });

    if (decision === 'Approved') proposal.status = 'Approved';
    else if (decision === 'Revisions Required')
      proposal.status = 'Revisions Required';
    else if (decision === 'Rejected') proposal.status = 'Rejected';

    await proposal.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a proposal
// @route   GET /api/reviews/proposal/:proposalId
// @access  Private
const getReviewsForProposal = async (req, res) => {
  try {
    const reviews = await Review.find({ proposal: req.params.proposalId })
      .populate('supervisor', 'fullName email')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews written by logged-in supervisor
// @route   GET /api/reviews/my
// @access  Private (supervisor)
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ supervisor: req.user._id })
      .populate('proposal', 'title status')
      .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addReview, getReviewsForProposal, getMyReviews };