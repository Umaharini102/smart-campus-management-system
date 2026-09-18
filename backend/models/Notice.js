const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Notice description is required'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    targetRole: {
      type: String,
      enum: ['all', 'student', 'faculty', 'admin'],
      default: 'all',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notice', noticeSchema);
