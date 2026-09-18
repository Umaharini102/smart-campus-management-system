const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require('../controllers/studentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(protect, getAllStudents)
  .post(protect, authorizeRoles('admin'), createStudent);

router
  .route('/:id')
  .get(protect, getStudentById)
  .put(protect, authorizeRoles('admin'), updateStudent)
  .delete(protect, authorizeRoles('admin'), deleteStudent);

module.exports = router;
