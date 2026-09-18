const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllCourses)
  .post(protect, authorizeRoles('admin'), createCourse);

router
  .route('/:id')
  .get(getCourseById)
  .put(protect, authorizeRoles('admin'), updateCourse)
  .delete(protect, authorizeRoles('admin'), deleteCourse);

module.exports = router;
