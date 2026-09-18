const express = require('express');
const router = express.Router();
const {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
} = require('../controllers/assignmentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(protect, getAllAssignments)
  .post(protect, authorizeRoles('admin', 'faculty'), upload.single('attachment'), createAssignment);

router
  .route('/:id')
  .get(protect, getAssignmentById)
  .put(protect, authorizeRoles('admin', 'faculty'), upload.single('attachment'), updateAssignment)
  .delete(protect, authorizeRoles('admin', 'faculty'), deleteAssignment);

router
  .route('/:id/submit')
  .post(protect, authorizeRoles('student'), upload.single('file'), submitAssignment);

router
  .route('/submissions/:submissionId/grade')
  .put(protect, authorizeRoles('admin', 'faculty'), gradeSubmission);

module.exports = router;
