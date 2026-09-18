const express = require('express');
const router = express.Router();
const {
  getAllMaterials,
  uploadMaterial,
  deleteMaterial,
} = require('../controllers/materialController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router
  .route('/')
  .get(protect, getAllMaterials)
  .post(protect, authorizeRoles('admin', 'faculty'), upload.single('file'), uploadMaterial);

router
  .route('/:id')
  .delete(protect, authorizeRoles('admin', 'faculty'), deleteMaterial);

module.exports = router;
