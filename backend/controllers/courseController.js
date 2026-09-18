const Course = require('../models/Course');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res) => {
  try {
    const { departmentId } = req.query;
    let query = {};
    if (departmentId) query.departmentId = departmentId;

    const courses = await Course.find(query).populate('departmentId', 'name code').sort({ name: 1 });
    return res.status(200).json({ success: true, count: courses.length, courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('departmentId', 'name code description');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    return res.status(200).json({ success: true, course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Admin)
const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    const populated = await Course.findById(course._id).populate('departmentId', 'name code');
    return res.status(201).json({ success: true, message: 'Course created successfully', course: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('departmentId', 'name code');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    return res.status(200).json({ success: true, message: 'Course updated', course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    return res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
