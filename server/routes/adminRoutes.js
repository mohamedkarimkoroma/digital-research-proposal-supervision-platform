const express = require('express');
const router = express.Router();
const {
  assignSupervisor,
  listSupervisors,
  listStudents, getAllUsers 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');



router.put(
  '/proposals/:proposalId/assign',
  protect,
  authorize('admin'),
  assignSupervisor
);
router.get('/supervisors', protect, authorize('admin'), listSupervisors);
router.get('/students', protect, authorize('admin'), listStudents);
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;