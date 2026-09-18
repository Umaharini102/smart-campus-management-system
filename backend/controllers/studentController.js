const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Get all students
// @route   GET /api/students
// @access  Private (Admin & Faculty)
const getAllStudents = async (req, res) => {
  try {
    const { departmentId, courseId, semester, search } = req.query;
    let query = {};

    if (departmentId) query.departmentId = departmentId;
    if (courseId) query.courseId = courseId;
    if (semester) query.semester = Number(semester);

    let students = await Student.find(query)
      .populate('userId', 'name email phone profileImage role')
      .populate('departmentId', 'name code')
      .populate('courseId', 'name code')
      .sort({ createdAt: -1 });

    if (search) {
      const searchLower = search.toLowerCase();
      students = students.filter((s) => {
        const nameMatch = s.userId?.name?.toLowerCase().includes(searchLower);
        const emailMatch = s.userId?.email?.toLowerCase().includes(searchLower);
        const idMatch = s.studentId?.toLowerCase().includes(searchLower);
        const rollMatch = s.rollNumber?.toLowerCase().includes(searchLower);
        return nameMatch || emailMatch || idMatch || rollMatch;
      });
    }

    return res.status(200).json({ success: true, count: students.length, students });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email phone profileImage role')
      .populate('departmentId', 'name code description')
      .populate('courseId', 'name code duration');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    return res.status(200).json({ success: true, student });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new student (User + Student record)
// @route   POST /api/students
// @access  Private (Admin)
const createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      studentId,
      departmentId,
      courseId,
      year,
      semester,
      section,
      rollNumber,
      address,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists' });
    }

    const newUser = await User.create({
      name,
      email,
      password: password || 'Student@123',
      role: 'student',
      phone: phone || '',
    });

    const newStudent = await Student.create({
      studentId: studentId || `STU-${Date.now().toString().slice(-6)}`,
      userId: newUser._id,
      departmentId,
      courseId,
      year: year || 1,
      semester: semester || 1,
      section: section || 'A',
      rollNumber: rollNumber || `R-${Date.now().toString().slice(-4)}`,
      phone: phone || '',
      address: address || '',
    });

    const populated = await Student.findById(newStudent._id)
      .populate('userId', 'name email phone')
      .populate('departmentId', 'name code')
      .populate('courseId', 'name code');

    return res.status(201).json({
      success: true,
      message: 'Student enrolled successfully',
      student: populated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private (Admin)
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    // Update Student model fields
    student.departmentId = req.body.departmentId || student.departmentId;
    student.courseId = req.body.courseId || student.courseId;
    student.year = req.body.year !== undefined ? req.body.year : student.year;
    student.semester = req.body.semester !== undefined ? req.body.semester : student.semester;
    student.section = req.body.section || student.section;
    student.rollNumber = req.body.rollNumber || student.rollNumber;
    student.phone = req.body.phone !== undefined ? req.body.phone : student.phone;
    student.address = req.body.address !== undefined ? req.body.address : student.address;
    await student.save();

    // Update associated User model fields
    if (req.body.name || req.body.phone) {
      await User.findByIdAndUpdate(student.userId, {
        ...(req.body.name && { name: req.body.name }),
        ...(req.body.phone && { phone: req.body.phone }),
      });
    }

    const updated = await Student.findById(student._id)
      .populate('userId', 'name email phone')
      .populate('departmentId', 'name code')
      .populate('courseId', 'name code');

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      student: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete student and associated user
// @route   DELETE /api/students/:id
// @access  Private (Admin)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student record not found' });
    }

    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
