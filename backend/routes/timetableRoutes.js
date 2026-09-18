const express = require('express');
const router = express.Router();
const {
  getTimetable,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
} = require('../controllers/timetableController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getTimetable)
  .post(protect, authorizeRoles('admin'), createTimetableSlot);

router
  .route('/:id')
  .put(protect, authorizeRoles('admin'), updateTimetableSlot)
  .delete(protect, authorizeRoles('admin'), deleteTimetableSlot);

module.exports = router;
