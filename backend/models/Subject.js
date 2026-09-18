const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      trim: true,
      uppercase: true,
      unique: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      default: null,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    credits: {
      type: Number,
      default: 3,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Subject', subjectSchema);
