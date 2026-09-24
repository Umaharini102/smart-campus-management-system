const express = require('express');
const router = express.Router();
const {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  getPublicFaculty,
} = require('../controllers/facultyController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public faculty directory route (fictional demo profiles)
router.get('/public', getPublicFaculty);

router
  .route('/')
  .get(protect, getAllFaculty)
  .post(protect, authorizeRoles('admin'), createFaculty);

router
  .route('/:id')
  .get(protect, getFacultyById)
  .put(protect, authorizeRoles('admin'), updateFaculty)
  .delete(protect, authorizeRoles('admin'), deleteFaculty);

module.exports = router;
