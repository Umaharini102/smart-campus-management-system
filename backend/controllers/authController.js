const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, rollNumber, departmentId, courseId, designation, studentId, facultyId } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      phone: phone || '',
    });

    // If role is student, create corresponding Student record if details provided
    if (user.role === 'student' && (rollNumber || studentId)) {
      await Student.create({
        studentId: studentId || `STU-${Date.now().toString().slice(-6)}`,
        userId: user._id,
        departmentId: departmentId || null,
        courseId: courseId || null,
        rollNumber: rollNumber || `R-${Date.now().toString().slice(-4)}`,
        phone: phone || '',
      });
    }

    // If role is faculty, create corresponding Faculty record if details provided
    if (user.role === 'faculty' && (designation || facultyId)) {
      await Faculty.create({
        facultyId: facultyId || `FAC-${Date.now().toString().slice(-4)}`,
        userId: user._id,
        departmentId: departmentId || null,
        designation: designation || 'Assistant Professor',
        phone: phone || '',
      });
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

    // Also update student/faculty profile address/phone if applicable
    if (user.role === 'student' && req.body.address !== undefined) {
      await Student.findOneAndUpdate({ userId: user._id }, { address: req.body.address, phone: user.phone });
    } else if (user.role === 'faculty' && user.phone) {
      await Faculty.findOneAndUpdate({ userId: user._id }, { phone: user.phone });
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
