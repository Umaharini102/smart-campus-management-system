const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getFacultyStats,
  getStudentStats,
} = require('../controllers/reportController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/admin', protect, authorizeRoles('admin'), getAdminStats);
router.get('/faculty', protect, authorizeRoles('faculty'), getFacultyStats);
router.get('/student', protect, authorizeRoles('student'), getStudentStats);

module.exports = router;
