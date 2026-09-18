const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return res.status(200).json({ success: true, unreadCount, count: notifications.length, notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    return res.status(200).json({ success: true, notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { isRead: true });
    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create notification
// @route   POST /api/notifications
// @access  Private (Admin)
const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    const notification = await Notification.create({
      userId,
      title,
      message,
      type: type || 'info',
    });
    return res.status(201).json({ success: true, notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
};
