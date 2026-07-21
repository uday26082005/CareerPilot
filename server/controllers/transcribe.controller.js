const { transcribeAudio } = require("../services/ai/groq.service");
const { sendSuccess } = require("../utils/responseHandler");

const transcribe = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No audio file provided" });
    }

    // Extract original extension
    const ext = req.file.originalname.split('.').pop() || 'webm';

    // Pass the buffer to Groq's whisper model
    const text = await transcribeAudio(req.file.buffer, ext);
    
    sendSuccess(res, { data: { text }, message: "Audio transcribed successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  transcribe
};
