const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
} = require('../controllers/notificationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, getUserNotifications)
  .post(protect, authorizeRoles('admin'), createNotification);

router.route('/read-all').put(protect, markAllAsRead);
router.route('/:id/read').put(protect, markAsRead);

module.exports = router;
