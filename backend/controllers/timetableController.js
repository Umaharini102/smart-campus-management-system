const Timetable = require('../models/Timetable');

// @desc    Get timetable slots
// @route   GET /api/timetable
// @access  Public
const getTimetable = async (req, res) => {
  try {
    const { day, facultyId, subjectId } = req.query;
    let query = {};
    if (day) query.day = day;
    if (facultyId) query.facultyId = facultyId;
    if (subjectId) query.subjectId = subjectId;

    const slots = await Timetable.find(query)
      .populate('subjectId', 'name code semester credits')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ period: 1 });

    return res.status(200).json({ success: true, count: slots.length, timetable: slots });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create timetable slot
// @route   POST /api/timetable
// @access  Private (Admin)
const createTimetableSlot = async (req, res) => {
  try {
    const slot = await Timetable.create(req.body);
    const populated = await Timetable.findById(slot._id)
      .populate('subjectId', 'name code')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name' },
      });
    return res.status(201).json({ success: true, message: 'Timetable slot created', slot: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update timetable slot
// @route   PUT /api/timetable/:id
// @access  Private (Admin)
const updateTimetableSlot = async (req, res) => {
  try {
    const slot = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Timetable slot not found' });
    }
    return res.status(200).json({ success: true, message: 'Timetable slot updated', slot });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete timetable slot
// @route   DELETE /api/timetable/:id
// @access  Private (Admin)
const deleteTimetableSlot = async (req, res) => {
  try {
    const slot = await Timetable.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Timetable slot not found' });
    }
    return res.status(200).json({ success: true, message: 'Timetable slot deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTimetable,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
};
