const multer = require("multer");
const { env } = require("../../config/env");
const { AppError } = require("../error/AppError");

const storage = multer.memoryStorage();

const resumeUpload = multer({
  storage,
  limits: {
    fileSize: env.FILE_SIZE_LIMIT_MB * 1024 * 1024,
    files: 1,
  },
  fileFilter(req, file, callback) {
    if (file.mimetype !== "application/pdf") {
      callback(new AppError("Only PDF resume uploads are allowed.", 400));
      return;
    }

    callback(null, true);
  },
});

module.exports = {
  resumeUpload,
};
