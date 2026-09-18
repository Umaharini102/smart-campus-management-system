const Event = require('../models/Event');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email role')
      .sort({ date: 1 });
    return res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.status(200).json({ success: true, event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin & Faculty)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category } = req.body;
    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      time,
      location,
      category: category || 'Academic',
      createdBy: req.user._id,
    });

    const populated = await Event.findById(event._id).populate('createdBy', 'name email');
    return res.status(201).json({ success: true, message: 'Campus event created', event: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin & Faculty)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.status(200).json({ success: true, message: 'Event updated', event });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin & Faculty)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
