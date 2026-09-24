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

// @desc    Get public / demo faculty profiles
// @route   GET /api/faculty/public
// @access  Public
const SAMPLE_FACULTY = [
  {
    _id: 'fac-demo-1',
    facultyId: 'FAC-DEMO-001',
    name: 'Dr. Arjun Rao',
    country: 'India',
    department: 'Computer Science',
    designation: 'Professor',
    specialization: 'Artificial Intelligence',
    email: 'arjun.rao@institution.generic',
    phone: '+91 98765 43210',
    officeLocation: 'Academic Wing A, Room 301',
    bio: 'Specializing in deep learning architectures, cognitive computing, and ethical AI frameworks.',
    experience: '16+ Years',
    publications: 34,
    status: 'Active',
    isDemo: true,
  },
  {
    _id: 'fac-demo-2',
    facultyId: 'FAC-DEMO-002',
    name: 'Dr. Priya Sharma',
    country: 'India',
    department: 'Information Technology',
    designation: 'Associate Professor',
    specialization: 'Data Science',
    email: 'priya.sharma@institution.generic',
    phone: '+91 98765 43211',
    officeLocation: 'IT Complex, Room 204',
    bio: 'Focused on high-dimensional data analytics, predictive modeling, and scalable big data ecosystems.',
    experience: '11+ Years',
    publications: 22,
    status: 'Active',
    isDemo: true,
  },
  {
    _id: 'fac-demo-3',
    facultyId: 'FAC-DEMO-003',
    name: 'Dr. Rahul Mehta',
    country: 'India',
    department: 'Electronics',
    designation: 'Professor',
    specialization: 'Embedded Systems',
    email: 'rahul.mehta@institution.generic',
    phone: '+91 98765 43212',
    officeLocation: 'Electronics Block, Room 410',
    bio: 'Researches IoT sensor networks, low-power microcontrollers, and real-time operating systems.',
    experience: '18+ Years',
    publications: 41,
    status: 'Active',
    isDemo: true,
  },
  {
    _id: 'fac-demo-4',
    facultyId: 'FAC-DEMO-004',
    name: 'Dr. Ananya Iyer',
    country: 'India',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    specialization: 'Cybersecurity',
    email: 'ananya.iyer@institution.generic',
    phone: '+91 98765 43213',
    officeLocation: 'Cyber Security Lab, Room 105',
    bio: 'Expertise in cryptographic protocols, zero-trust network architectures, and cloud security compliance.',
    experience: '7+ Years',
    publications: 15,
    status: 'Active',
    isDemo: true,
  },
  {
    _id: 'fac-demo-5',
    facultyId: 'FAC-DEMO-005',
    name: 'Dr. Vikram Reddy',
    country: 'India',
    department: 'Mechanical Engineering',
    designation: 'Professor',
    specialization: 'Robotics',
    email: 'vikram.reddy@institution.generic',
    phone: '+91 98765 43214',
    officeLocation: 'Robotics Center, Room 502',
    bio: 'Investigating autonomous robot kinematics, mechatronics control, and robotic automation systems.',
    experience: '19+ Years',
    publications: 48,
    status: 'Active',
    isDemo: true,
  },
  {
    _id: 'fac-demo-6',
    facultyId: 'FAC-DEMO-006',
    name: 'Dr. Emily Carter',
    country: 'United Kingdom',
    department: 'Computer Science',
    designation: 'Professor',
    specialization: 'Machine Learning',
    email: 'emily.carter@institution.generic',
    phone: '+44 20 7946 0192',
    officeLocation: 'Computing Pavilion, Room B-21',
    bio: 'Pioneering research in reinforcement learning, probabilistic inference, and algorithmic neural systems.',
    experience: '15+ Years',
    publications: 39,
    status: 'Active',
    isDemo: true,
  },
  {
    _id: 'fac-demo-7',
    facultyId: 'FAC-DEMO-007',
    name: 'Dr. Daniel Wilson',
    country: 'United States',
    department: 'Information Systems',
    designation: 'Associate Professor',
    specialization: 'Cloud Computing',
    email: 'daniel.wilson@institution.generic',
    phone: '+1 (555) 019-2831',
    officeLocation: 'Cloud Systems Wing, Room 315',
    bio: 'Specialist in distributed microservice architectures, edge compute optimization, and serverless pipelines.',
    experience: '12+ Years',
    publications: 26,
    status: 'Active',
    isDemo: true,
  },
  {
    _id: 'fac-demo-8',
    facultyId: 'FAC-DEMO-008',
    name: 'Dr. Sophia Martin',
    country: 'France',
    department: 'Computer Engineering',
    designation: 'Professor',
    specialization: 'Computer Vision',
    email: 'sophia.martin@institution.generic',
    phone: '+33 1 42 68 55 00',
    officeLocation: 'Vision & Imaging Center, Room 408',
    bio: 'Researching multi-spectral image processing, convolutional visual tracking, and biometric sensor vision.',
    experience: '17+ Years',
    publications: 45,
    status: 'Active',
    isDemo: true,
  },
  {
    _id: 'fac-demo-9',
    facultyId: 'FAC-DEMO-009',
    name: 'Dr. Kenji Nakamura',
    country: 'Japan',
    department: 'Artificial Intelligence',
    designation: 'Associate Professor',
    specialization: 'Intelligent Systems',
    email: 'kenji.nakamura@institution.generic',
    phone: '+81 3 5555 0143',
    officeLocation: 'Intelligence Research Hub, Room 112',
    bio: 'Focusing on autonomous agent decision models, intelligent cyber-physical systems, and human-AI collaboration.',
    experience: '13+ Years',
    publications: 31,
    status: 'Active',
    isDemo: true,
  },
  {
    _id: 'fac-demo-10',
    facultyId: 'FAC-DEMO-010',
    name: 'Dr. Maria Silva',
    country: 'Brazil',
    department: 'Information Technology',
    designation: 'Assistant Professor',
    specialization: 'Software Engineering',
    email: 'maria.silva@institution.generic',
    phone: '+55 11 98765 4321',
    officeLocation: 'Software Labs, Room 220',
    bio: 'Dedicated to empirical software design methodologies, clean DevOps delivery, and modular system synthesis.',
    experience: '8+ Years',
    publications: 18,
    status: 'Active',
    isDemo: true,
  },
];

const getPublicFaculty = async (req, res) => {
  try {
    const { department, country, designation, search } = req.query;
    let list = [...SAMPLE_FACULTY];

    if (department && department !== 'All') {
      list = list.filter((f) => f.department.toLowerCase() === department.toLowerCase());
    }
    if (country && country !== 'All') {
      list = list.filter((f) => f.country.toLowerCase() === country.toLowerCase());
    }
    if (designation && designation !== 'All') {
      list = list.filter((f) => f.designation.toLowerCase() === designation.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q) ||
          f.specialization.toLowerCase().includes(q) ||
          f.country.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      count: list.length,
      isDemo: true,
      notice: 'Fictional demo profiles created only for UI demonstration and testing purposes.',
      faculty: list,
    });
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
  getPublicFaculty,
  SAMPLE_FACULTY,
};
