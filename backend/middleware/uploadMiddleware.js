const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter (documents, pdf, zip, images)
const fileFilter = (req, file, cb) => {
  const allowedExts = /jpeg|jpg|png|pdf|doc|docx|zip|rar|txt|ppt|pptx/;
  const extname = allowedExts.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only document and archive files are allowed (PDF, DOCX, ZIP, PNG, etc.)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max limit
  fileFilter: fileFilter,
});

module.exports = upload;
