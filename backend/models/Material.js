const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Material title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Faculty',
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      default: 'pdf',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Material', materialSchema);
