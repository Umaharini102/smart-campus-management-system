const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    file: {
      type: String,
      default: '',
    },
    comments: {
      type: String,
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    marks: {
      type: Number,
      default: null,
    },
    feedback: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Graded', 'Late'],
      default: 'Submitted',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Submission', submissionSchema);
