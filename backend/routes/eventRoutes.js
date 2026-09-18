const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllEvents)
  .post(protect, authorizeRoles('admin', 'faculty'), createEvent);

router
  .route('/:id')
  .get(getEventById)
  .put(protect, authorizeRoles('admin', 'faculty'), updateEvent)
  .delete(protect, authorizeRoles('admin', 'faculty'), deleteEvent);

module.exports = router;
