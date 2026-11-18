
const Proposal = require('../models/Proposal');
const User = require('../models/User'); // <-- Added for university isolation

// @desc    Create a new proposal
// @route   POST /api/proposals
// @access  Private (student only)
const createProposal = async (req, res) => {
  try {
    const { title, abstract, keywords, documentPath } = req.body;

    if (!title || !abstract) {
      return res.status(400).json({ message: 'Please add title and abstract' });
    }

    const proposal = await Proposal.create({
      student: req.user._id,
      title,
      abstract,
      keywords: keywords || [],
      documentPath: documentPath || '',
      status: 'Submitted',
    });

    res.status(201).json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all proposals of logged-in student
// @route   GET /api/proposals/my
// @access  Private (student)
const getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ student: req.user._id })
      .populate('supervisor', 'fullName email')
      .sort('-createdAt');

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all proposals (admin) or supervised proposals (supervisor)
// @route   GET /api/proposals
// @access  Private (supervisor, admin)
const getAllProposals = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'supervisor') {
      // Supervisors only see proposals assigned to them
      filter.supervisor = req.user._id;
    } else if (req.user.role === 'admin') {
      // ADMIN ISOLATION: Admin only sees proposals from their university
      if (req.user.university) {
        // 1. Find all students from this admin's university
        const students = await User.find({ 
          role: 'student', 
          university: req.user.university 
        }).select('_id');
        
        // 2. Filter proposals to only those students
        filter.student = { $in: students.map(s => s._id) };
      }
    }

    const proposals = await Proposal.find(filter)
      .populate('student', 'fullName email department university studentId')
      .populate('supervisor', 'fullName email')
      .sort('-createdAt');

    res.json(proposals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single proposal by ID
// @route   GET /api/proposals/:id
// @access  Private
const getProposalById = async (req, res) => {
  try {
    // Fixed bug: removed the undefined 'filter' variable
    const proposal = await Proposal.findById(req.params.id)
      .populate('student', 'fullName email department university studentId')
      .populate('supervisor', 'fullName email');

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update proposal status
// @route   PUT /api/proposals/:id/status
// @access  Private (supervisor, admin)
const updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = [
      'Draft',
      'Submitted',
      'Under Review',
      'Revisions Required',
      'Approved',
      'Rejected',
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    proposal.status = status;
    await proposal.save();

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProposal,
  getMyProposals,
  getAllProposals,
  getProposalById,
  updateProposalStatus,
};