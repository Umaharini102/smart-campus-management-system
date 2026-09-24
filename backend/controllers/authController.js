const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const Course = require('../models/Course');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      rollNumber,
      departmentId,
      courseId,
      designation,
      studentId,
      facultyId,
      year,
      semester,
      section,
      address,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'student',
      phone: phone || '',
    });

    let profileData = null;

    // If role is student, create corresponding Student record
    if (user.role === 'student') {
      let dept = departmentId;
      if (!dept) {
        const defaultDept = await Department.findOne();
        if (defaultDept) dept = defaultDept._id;
      }

      let course = courseId;
      if (!course) {
        const defaultCourse = await Course.findOne(dept ? { departmentId: dept } : {});
        if (defaultCourse) course = defaultCourse._id;
        else {
          const anyCourse = await Course.findOne();
          if (anyCourse) course = anyCourse._id;
        }
      }

      const newStudent = await Student.create({
        studentId: studentId || `STU-${Date.now().toString().slice(-6)}`,
        userId: user._id,
        departmentId: dept,
        courseId: course,
        year: Number(year) || 1,
        semester: Number(semester) || 1,
        section: section || 'A',
        rollNumber: rollNumber || `R-${Date.now().toString().slice(-4)}`,
        phone: phone || '',
        address: address || '',
      });

      profileData = await Student.findById(newStudent._id)
        .populate('departmentId', 'name code')
        .populate('courseId', 'name code');
    }

    // If role is faculty, create corresponding Faculty record
    if (user.role === 'faculty') {
      let dept = departmentId;
      if (!dept) {
        const defaultDept = await Department.findOne();
        if (defaultDept) dept = defaultDept._id;
      }

      const newFaculty = await Faculty.create({
        facultyId: facultyId || `FAC-${Date.now().toString().slice(-4)}`,
        userId: user._id,
        departmentId: dept,
        designation: designation || 'Assistant Professor',
        phone: phone || '',
      });

      profileData = await Faculty.findById(newFaculty._id)
        .populate('departmentId', 'name code')
        .populate('subjects', 'name code');
    }

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        profile: profileData,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Fetch related profile based on role
    let profileData = null;
    if (user.role === 'student') {
      profileData = await Student.findOne({ userId: user._id })
        .populate('departmentId', 'name code')
        .populate('courseId', 'name code');
    } else if (user.role === 'faculty') {
      profileData = await Faculty.findOne({ userId: user._id })
        .populate('departmentId', 'name code')
        .populate('subjects', 'name code');
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        profile: profileData,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let profileData = null;
    if (user.role === 'student') {
      profileData = await Student.findOne({ userId: user._id })
        .populate('departmentId', 'name code')
        .populate('courseId', 'name code');
    } else if (user.role === 'faculty') {
      profileData = await Faculty.findOne({ userId: user._id })
        .populate('departmentId', 'name code')
        .populate('subjects', 'name code');
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        profile: profileData,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    // Also update student/faculty profile fields if applicable
    if (user.role === 'student') {
      const studentUpdate = {};
      if (req.body.address !== undefined) studentUpdate.address = req.body.address;
      if (req.body.phone !== undefined) studentUpdate.phone = req.body.phone;
      if (req.body.rollNumber !== undefined) studentUpdate.rollNumber = req.body.rollNumber;
      if (req.body.year !== undefined) studentUpdate.year = Number(req.body.year);
      if (req.body.semester !== undefined) studentUpdate.semester = Number(req.body.semester);
      if (req.body.section !== undefined) studentUpdate.section = req.body.section;
      if (req.body.departmentId) studentUpdate.departmentId = req.body.departmentId;
      if (req.body.courseId) studentUpdate.courseId = req.body.courseId;

      await Student.findOneAndUpdate(
        { userId: user._id },
        { $set: studentUpdate },
        { new: true, upsert: false }
      );
    } else if (user.role === 'faculty') {
      const facultyUpdate = {};
      if (req.body.phone !== undefined) facultyUpdate.phone = req.body.phone;
      if (req.body.designation !== undefined) facultyUpdate.designation = req.body.designation;
      if (req.body.departmentId) facultyUpdate.departmentId = req.body.departmentId;

      await Faculty.findOneAndUpdate(
        { userId: user._id },
        { $set: facultyUpdate },
        { new: true, upsert: false }
      );
    }

    let profileData = null;
    if (user.role === 'student') {
      profileData = await Student.findOne({ userId: user._id })
        .populate('departmentId', 'name code')
        .populate('courseId', 'name code');
    } else if (user.role === 'faculty') {
      profileData = await Faculty.findOne({ userId: user._id })
        .populate('departmentId', 'name code')
        .populate('subjects', 'name code');
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        profile: profileData,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
};
