const Material = require('../models/Material');
const Faculty = require('../models/Faculty');

// @desc    Get study materials
// @route   GET /api/materials
// @access  Private
const getAllMaterials = async (req, res) => {
  try {
    const { subjectId } = req.query;
    let query = {};
    if (subjectId) query.subjectId = subjectId;

    const materials = await Material.find(query)
      .populate('subjectId', 'name code')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name email' },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: materials.length, materials });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload study material
// @route   POST /api/materials
// @access  Private (Faculty & Admin)
const uploadMaterial = async (req, res) => {
  try {
    const { title, description, subjectId } = req.body;

    let facultyId = req.body.facultyId;
    if (!facultyId && req.user.role === 'faculty') {
      const faculty = await Faculty.findOne({ userId: req.user._id });
      if (faculty) facultyId = faculty._id;
    }

    let filePath = '';
    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
    } else if (req.body.file) {
      filePath = req.body.file;
    }

    if (!filePath) {
      return res.status(400).json({ success: false, message: 'Please attach a document or presentation file' });
    }

    const material = await Material.create({
      title,
      description,
      subjectId,
      facultyId,
      file: filePath,
    });

    const populated = await Material.findById(material._id)
      .populate('subjectId', 'name code')
      .populate({
        path: 'facultyId',
        populate: { path: 'userId', select: 'name' },
      });

    return res.status(201).json({ success: true, message: 'Study material uploaded', material: populated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete study material
// @route   DELETE /api/materials/:id
// @access  Private (Faculty & Admin)
const deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    return res.status(200).json({ success: true, message: 'Material removed' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllMaterials,
  uploadMaterial,
  deleteMaterial,
};
