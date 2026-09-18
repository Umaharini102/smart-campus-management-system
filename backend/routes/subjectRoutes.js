const express = require('express');
const router = express.Router();
const {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} = require('../controllers/subjectController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllSubjects)
  .post(protect, authorizeRoles('admin'), createSubject);

router
  .route('/:id')
  .get(getSubjectById)
  .put(protect, authorizeRoles('admin'), updateSubject)
  .delete(protect, authorizeRoles('admin'), deleteSubject);

module.exports = router;
