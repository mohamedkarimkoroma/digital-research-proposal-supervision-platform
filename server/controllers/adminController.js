const Proposal = require('../models/Proposal');
const User = require('../models/User');

// @desc    Assign a supervisor to a proposal
// @route   PUT /api/admin/proposals/:proposalId/assign
// @access  Private (admin only)
const assignSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.body;
    const { proposalId } = req.params;

    if (!supervisorId) {
      return res.status(400).json({ message: 'supervisorId is required' });
    }

    // Make sure the user exists and has the supervisor role
    const supervisor = await User.findById(supervisorId);
    if (!supervisor || supervisor.role !== 'supervisor') {
      return res.status(400).json({ message: 'Invalid supervisor ID' });
    }

    const proposal = await Proposal.findById(proposalId);
    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    proposal.supervisor = supervisorId;
    if (proposal.status === 'Submitted') {
      proposal.status = 'Under Review';
    }
    await proposal.save();

    res.json(proposal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    List all supervisors
// @route   GET /api/admin/supervisors
// @access  Private (admin only)
const listSupervisors = async (req, res) => {
  try {
    const supervisors = await User.find({ role: 'supervisor' }).select(
      'fullName email department'
    );
    res.json(supervisors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    List all students
// @route   GET /api/admin/students
// @access  Private (admin only)
const listStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select(
      'fullName email department'
    );
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get all users (students, supervisors, admins)
// @route   GET /api/admin/users
// @access  Private (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { assignSupervisor, listSupervisors, listStudents, getAllUsers };