const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// @desc    Get attendance logs
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
  try {
    const { subjectId, date, studentId, facultyId } = req.query;
    let query = {};

    if (subjectId) query.subjectId = subjectId;
    if (studentId) query.studentId = studentId;
    if (facultyId) query.facultyId = facultyId;

    if (date) {
      const searchDate = new Date(date);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDate };
    }

    const records = await Attendance.find(query)
      .populate({
        path: 'studentId',
        populate: { path: 'userId', select: 'name email profileImage' },
      })
      .populate('subjectId', 'name code')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ date: -1 });

    return res.status(200).json({ success: true, count: records.length, attendance: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark attendance (Single or Batch)
// @route   POST /api/attendance
// @access  Private (Faculty & Admin)
const markAttendance = async (req, res) => {
  try {
    const { subjectId, date, records } = req.body;
    // records: [{ studentId, status: 'Present'|'Absent' }]

    let facultyId = req.body.facultyId;
    if (!facultyId && req.user.role === 'faculty') {
      const faculty = await Faculty.findOne({ userId: req.user._id });
      if (faculty) facultyId = faculty._id;
    }

    if (!records || !Array.isArray(records)) {
      // Single record submission
      const { studentId, status } = req.body;
      const att = await Attendance.create({
        studentId,
        subjectId,
        facultyId,
        date: date ? new Date(date) : new Date(),
        status: status || 'Present',
      });
      return res.status(201).json({ success: true, message: 'Attendance marked', attendance: att });
    }

    // Batch records submission
    const attendanceDate = date ? new Date(date) : new Date();
    const createdRecords = [];

    for (const item of records) {
      // Upsert: if already marked for same student, subject and day, update; otherwise create
      const startOfDay = new Date(attendanceDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(attendanceDate);
      endOfDay.setHours(23, 59, 59, 999);

      const existing = await Attendance.findOne({
        studentId: item.studentId,
        subjectId: subjectId,
        date: { $gte: startOfDay, $lte: endOfDay },
      });

      if (existing) {
        existing.status = item.status;
        await existing.save();
        createdRecords.push(existing);
      } else {
        const newRecord = await Attendance.create({
          studentId: item.studentId,
          subjectId,
          facultyId,
          date: attendanceDate,
          status: item.status || 'Present',
        });
        createdRecords.push(newRecord);
      }
    }

    return res.status(201).json({
      success: true,
      message: `Successfully saved attendance for ${createdRecords.length} students`,
      count: createdRecords.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update single attendance record
// @route   PUT /api/attendance/:id
// @access  Private (Faculty & Admin)
const updateAttendance = async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!record) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }
    return res.status(200).json({ success: true, message: 'Attendance updated', record });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get attendance for specific student with statistics
// @route   GET /api/attendance/student/:studentId
// @access  Private
const getStudentAttendance = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    let query;
    if (mongoose.Types.ObjectId.isValid(req.params.studentId)) {
      query = {
        $or: [{ _id: req.params.studentId }, { studentId: req.params.studentId }, { userId: req.params.studentId }],
      };
    } else {
      query = {
        $or: [{ studentId: req.params.studentId }, { rollNumber: req.params.studentId }],
      };
    }

    const student = await Student.findOne(query);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const records = await Attendance.find({ studentId: student._id })
      .populate('subjectId', 'name code credits')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name' },
      })
      .sort({ date: -1 });

    const totalClasses = records.length;
    const attendedClasses = records.filter((r) => r.status === 'Present').length;
    const overallPercentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 100;

    // Subject-wise grouping
    const subjectMap = {};
    records.forEach((rec) => {
      const subId = rec.subjectId?._id?.toString() || 'unknown';
      if (!subjectMap[subId]) {
        subjectMap[subId] = {
          subjectId: rec.subjectId?._id,
          name: rec.subjectId?.name || 'General Subject',
          code: rec.subjectId?.code || 'GEN-101',
          total: 0,
          attended: 0,
          percentage: 100,
        };
      }
      subjectMap[subId].total += 1;
      if (rec.status === 'Present') subjectMap[subId].attended += 1;
    });

    const subjectStats = Object.values(subjectMap).map((sub) => ({
      ...sub,
      percentage: sub.total > 0 ? Math.round((sub.attended / sub.total) * 100) : 100,
    }));

    return res.status(200).json({
      success: true,
      summary: {
        totalClasses,
        attendedClasses,
        overallPercentage,
      },
      subjectStats,
      records,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAttendance,
  markAttendance,
  updateAttendance,
  getStudentAttendance,
};
