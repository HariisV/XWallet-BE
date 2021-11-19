const multer = require('multer');
const helper = require('@src/helpers/wrapper');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});

const limits = 1024 * 1024 * 1;

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: limits },
  fileFilter,
}).single('image');

const uploadFilter = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return helper.response(res, 401, err.message, null);
    } else if (err) {
      // An unknown error occurred when uploading.
      return helper.response(res, 401, err.message, null);
    }
    next();
    // Everything went fine.
  });
};

module.exports = uploadFilter;
