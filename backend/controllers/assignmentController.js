const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
const getAllAssignments = async (req, res) => {
  try {
    const { subjectId, facultyId } = req.query;
    let query = {};
    if (subjectId) query.subjectId = subjectId;
    if (facultyId) query.facultyId = facultyId;

    const assignments = await Assignment.find(query)
      .populate('subjectId', 'name code')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ dueDate: 1 });

    return res.status(200).json({ success: true, count: assignments.length, assignments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single assignment with submissions
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('subjectId', 'name code')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name email' },
      });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    // If faculty or admin, fetch all submissions
    let submissions = [];
    if (req.user.role === 'faculty' || req.user.role === 'admin') {
      submissions = await Submission.find({ assignmentId: assignment._id })
        .populate({
          path: 'studentId',
          populate: { path: 'userId', select: 'name email rollNumber' },
        })
        .sort({ submittedAt: -1 });
    } else if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user._id });
      if (student) {
        submissions = await Submission.find({ assignmentId: assignment._id, studentId: student._id });
      }
    }

    return res.status(200).json({ success: true, assignment, submissions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private (Faculty & Admin)
const createAssignment = async (req, res) => {
  try {
    const { title, description, subjectId, dueDate, totalMarks } = req.body;

    let facultyId = req.body.facultyId;
    if (!facultyId && req.user.role === 'faculty') {
      const faculty = await Faculty.findOne({ userId: req.user._id });
      if (faculty) facultyId = faculty._id;
    }

    let attachment = '';
    if (req.file) {
      attachment = `/uploads/${req.file.filename}`;
    }

    const assignment = await Assignment.create({
      title,
      description,
      subjectId,
      facultyId,
      dueDate: new Date(dueDate),
      totalMarks: totalMarks || 100,
      attachment,
    });

    const populated = await Assignment.findById(assignment._id)
      .populate('subjectId', 'name code')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name' },
      });

    return res.status(201).json({ success: true, message: 'Assignment published', assignment: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Faculty & Admin)
const updateAssignment = async (req, res) => {
  try {
    let updateData = { ...req.body };
    if (req.file) {
      updateData.attachment = `/uploads/${req.file.filename}`;
    }

    const assignment = await Assignment.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    return res.status(200).json({ success: true, message: 'Assignment updated', assignment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Faculty & Admin)
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }
    await Submission.deleteMany({ assignmentId: req.params.id });
    return res.status(200).json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit solution for an assignment
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(400).json({ success: false, message: 'Student profile not found' });
    }

    let filePath = '';
    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
    }

    // Check if already submitted
    let submission = await Submission.findOne({
      assignmentId: assignment._id,
      studentId: student._id,
    });

    const isLate = new Date() > new Date(assignment.dueDate);

    if (submission) {
      submission.file = filePath || submission.file;
      submission.comments = req.body.comments || submission.comments;
      submission.submittedAt = new Date();
      submission.status = isLate ? 'Late' : 'Submitted';
      await submission.save();
    } else {
      submission = await Submission.create({
        assignmentId: assignment._id,
        studentId: student._id,
        file: filePath,
        comments: req.body.comments || '',
        status: isLate ? 'Late' : 'Submitted',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully',
      submission,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Grade submission
// @route   PUT /api/assignments/submissions/:submissionId/grade
// @access  Private (Faculty & Admin)
const gradeSubmission = async (req, res) => {
  try {
    const { marks, feedback } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.submissionId,
      {
        marks: Number(marks),
        feedback: feedback || '',
        status: 'Graded',
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    return res.status(200).json({ success: true, message: 'Submission graded', submission });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  submitAssignment,
  gradeSubmission,
};
