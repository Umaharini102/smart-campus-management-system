const Department = require('../models/Department');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    return res.status(200).json({ success: true, count: departments.length, departments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Public
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    return res.status(200).json({ success: true, department });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create department
// @route   POST /api/departments
// @access  Private (Admin)
const createDepartment = async (req, res) => {
  try {
    const { name, code, description, hod } = req.body;
    const department = await Department.create({ name, code, description, hod });
    return res.status(201).json({ success: true, message: 'Department created', department });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update department
// @route   PUT /api/departments/:id
// @access  Private (Admin)
const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    return res.status(200).json({ success: true, message: 'Department updated', department });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }
    return res.status(200).json({ success: true, message: 'Department deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
