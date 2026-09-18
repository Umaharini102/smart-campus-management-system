const express = require('express');
const router = express.Router();
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('../controllers/departmentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getAllDepartments)
  .post(protect, authorizeRoles('admin'), createDepartment);

router
  .route('/:id')
  .get(getDepartmentById)
  .put(protect, authorizeRoles('admin'), updateDepartment)
  .delete(protect, authorizeRoles('admin'), deleteDepartment);

module.exports = router;
