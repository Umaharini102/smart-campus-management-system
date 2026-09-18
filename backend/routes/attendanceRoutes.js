const express = require('express');
const router = express.Router();
const {
  getAttendance,
  markAttendance,
  updateAttendance,
  getStudentAttendance,
} = require('../controllers/attendanceController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, getAttendance)
  .post(protect, authorizeRoles('admin', 'faculty'), markAttendance);

router
  .route('/:id')
  .put(protect, authorizeRoles('admin', 'faculty'), updateAttendance);

router
  .route('/student/:studentId')
  .get(protect, getStudentAttendance);

module.exports = router;
