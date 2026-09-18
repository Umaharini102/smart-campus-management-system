const express = require('express');
const router = express.Router();
const {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllNotices)
  .post(protect, authorizeRoles('admin', 'faculty'), createNotice);

router
  .route('/:id')
  .get(getNoticeById)
  .put(protect, authorizeRoles('admin', 'faculty'), updateNotice)
  .delete(protect, authorizeRoles('admin', 'faculty'), deleteNotice);

module.exports = router;
