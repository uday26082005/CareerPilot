const { transcribeAudio } = require("../services/ai/groq.service");
const { sendSuccess } = require("../utils/responseHandler");
const fs = require('fs');
const path = require('path');
const os = require('os');

const transcribe = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No audio file provided" });
    }

    // Extract original extension
    const ext = req.file.originalname.split('.').pop() || 'webm';
    
    // Create a temporary file path
    const tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}.${ext}`);
    
    // Write buffer to temp file
    fs.writeFileSync(tempFilePath, req.file.buffer);

    try {
      // Pass the file path to Groq's whisper model
      const text = await transcribeAudio(tempFilePath, ext);
      sendSuccess(res, { data: { text }, message: "Audio transcribed successfully" });
    } finally {
      // Clean up the temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  transcribe
};
