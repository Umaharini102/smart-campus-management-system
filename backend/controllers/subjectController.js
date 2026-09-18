const Subject = require('../models/Subject');
const Faculty = require('../models/Faculty');

// @desc    Get all subjects
// @route   GET /api/subjects
// @access  Public
const getAllSubjects = async (req, res) => {
  try {
    const { courseId, facultyId, semester } = req.query;
    let query = {};
    if (courseId) query.courseId = courseId;
    if (facultyId) query.facultyId = facultyId;
    if (semester) query.semester = Number(semester);

    const subjects = await Subject.find(query)
      .populate('courseId', 'name code')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ semester: 1, code: 1 });

    return res.status(200).json({ success: true, count: subjects.length, subjects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get subject by ID
// @route   GET /api/subjects/:id
// @access  Public
const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id)
      .populate('courseId', 'name code')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name email' },
      });

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }
    return res.status(200).json({ success: true, subject });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create subject
// @route   POST /api/subjects
// @access  Private (Admin)
const createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);

    // If faculty assigned, add to their subjects array
    if (req.body.facultyId) {
      await Faculty.findByIdAndUpdate(req.body.facultyId, {
        $addToSet: { subjects: subject._id },
      });
    }

    const populated = await Subject.findById(subject._id)
      .populate('courseId', 'name code')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name email' },
      });

    return res.status(201).json({ success: true, message: 'Subject created', subject: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update subject
// @route   PUT /api/subjects/:id
// @access  Private (Admin)
const updateSubject = async (req, res) => {
  try {
    const oldSubject = await Subject.findById(req.params.id);
    if (!oldSubject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // If faculty changed, update both faculty records
    if (req.body.facultyId && req.body.facultyId !== oldSubject.facultyId?.toString()) {
      if (oldSubject.facultyId) {
        await Faculty.findByIdAndUpdate(oldSubject.facultyId, {
          $pull: { subjects: subject._id },
        });
      }
      await Faculty.findByIdAndUpdate(req.body.facultyId, {
        $addToSet: { subjects: subject._id },
      });
    }

    const populated = await Subject.findById(subject._id)
      .populate('courseId', 'name code')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name email' },
      });

    return res.status(200).json({ success: true, message: 'Subject updated', subject: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete subject
// @route   DELETE /api/subjects/:id
// @access  Private (Admin)
const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    if (subject.facultyId) {
      await Faculty.findByIdAndUpdate(subject.facultyId, {
        $pull: { subjects: subject._id },
      });
    }

    return res.status(200).json({ success: true, message: 'Subject deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
