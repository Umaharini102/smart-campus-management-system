const Faculty = require('../models/Faculty');
const User = require('../models/User');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Private
const getAllFaculty = async (req, res) => {
  try {
    const { departmentId, search } = req.query;
    let query = {};

    if (departmentId) query.departmentId = departmentId;

    let facultyList = await Faculty.find(query)
      .populate('userId', 'name email phone profileImage role')
      .populate('departmentId', 'name code')
      .populate('subjects', 'name code semester credits')
      .sort({ createdAt: -1 });

    if (search) {
      const searchLower = search.toLowerCase();
      facultyList = facultyList.filter((f) => {
        const nameMatch = f.userId?.name?.toLowerCase().includes(searchLower);
        const emailMatch = f.userId?.email?.toLowerCase().includes(searchLower);
        const idMatch = f.facultyId?.toLowerCase().includes(searchLower);
        return nameMatch || emailMatch || idMatch;
      });
    }

    return res.status(200).json({ success: true, count: facultyList.length, faculty: facultyList });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single faculty by ID
// @route   GET /api/faculty/:id
// @access  Private
const getFacultyById = async (req, res) => {
  try {
    const facultyMember = await Faculty.findById(req.params.id)
      .populate('userId', 'name email phone profileImage role')
      .populate('departmentId', 'name code description')
      .populate('subjects', 'name code semester credits');

    if (!facultyMember) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }

    return res.status(200).json({ success: true, faculty: facultyMember });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new faculty member
// @route   POST /api/faculty
// @access  Private (Admin)
const createFaculty = async (req, res) => {
  try {
    const { name, email, password, phone, facultyId, departmentId, designation, subjects } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const newUser = await User.create({
      name,
      email,
      password: password || 'Faculty@123',
      role: 'faculty',
      phone: phone || '',
    });

    const newFaculty = await Faculty.create({
      facultyId: facultyId || `FAC-${Date.now().toString().slice(-4)}`,
      userId: newUser._id,
      departmentId,
      designation: designation || 'Assistant Professor',
      subjects: subjects || [],
      phone: phone || '',
    });

    const populated = await Faculty.findById(newFaculty._id)
      .populate('userId', 'name email phone')
      .populate('departmentId', 'name code')
      .populate('subjects', 'name code');

    return res.status(201).json({
      success: true,
      message: 'Faculty appointed successfully',
      faculty: populated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update faculty member
// @route   PUT /api/faculty/:id
// @access  Private (Admin)
const updateFaculty = async (req, res) => {
  try {
    const facultyMember = await Faculty.findById(req.params.id);
    if (!facultyMember) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }

    facultyMember.departmentId = req.body.departmentId || facultyMember.departmentId;
    facultyMember.designation = req.body.designation || facultyMember.designation;
    facultyMember.phone = req.body.phone !== undefined ? req.body.phone : facultyMember.phone;
    if (req.body.subjects) facultyMember.subjects = req.body.subjects;

    await facultyMember.save();

    if (req.body.name || req.body.phone) {
      await User.findByIdAndUpdate(facultyMember.userId, {
        ...(req.body.name && { name: req.body.name }),
        ...(req.body.phone && { phone: req.body.phone }),
      });
    }

    const updated = await Faculty.findById(facultyMember._id)
      .populate('userId', 'name email phone')
      .populate('departmentId', 'name code')
      .populate('subjects', 'name code');

    return res.status(200).json({
      success: true,
      message: 'Faculty updated successfully',
      faculty: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete faculty member and user
// @route   DELETE /api/faculty/:id
// @access  Private (Admin)
const deleteFaculty = async (req, res) => {
  try {
    const facultyMember = await Faculty.findById(req.params.id);
    if (!facultyMember) {
      return res.status(404).json({ success: false, message: 'Faculty member not found' });
    }

    await User.findByIdAndDelete(facultyMember.userId);
    await Faculty.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
};
