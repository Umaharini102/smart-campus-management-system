const Notice = require('../models/Notice');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
const getAllNotices = async (req, res) => {
  try {
    const { targetRole, priority } = req.query;
    let query = {};

    if (targetRole && targetRole !== 'all') {
      query.$or = [{ targetRole: 'all' }, { targetRole: targetRole }];
    }
    if (priority) query.priority = priority;

    const notices = await Notice.find(query)
      .populate('createdBy', 'name email role')
      .sort({ pinned: -1, createdAt: -1 });

    return res.status(200).json({ success: true, count: notices.length, notices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get notice by ID
// @route   GET /api/notices/:id
// @access  Public
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('createdBy', 'name email');
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    return res.status(200).json({ success: true, notice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new notice
// @route   POST /api/notices
// @access  Private (Admin & Faculty)
const createNotice = async (req, res) => {
  try {
    const { title, description, targetRole, priority, pinned } = req.body;
    const notice = await Notice.create({
      title,
      description,
      targetRole: targetRole || 'all',
      priority: priority || 'Medium',
      pinned: pinned || false,
      createdBy: req.user._id,
    });

    const populated = await Notice.findById(notice._id).populate('createdBy', 'name email role');
    return res.status(201).json({ success: true, message: 'Notice broadcasted successfully', notice: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private (Admin & Faculty)
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    return res.status(200).json({ success: true, message: 'Notice updated', notice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private (Admin & Faculty)
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }
    return res.status(200).json({ success: true, message: 'Notice deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
};
