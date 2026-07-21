const { GoogleGenAI } = require("@google/genai");
const { env } = require("./env");
const { AppError } = require("../middleware/error/AppError");

let geminiClient;

const getGeminiClient = () => {
  if (!env.GEMINI_API_KEY) {
    throw new AppError("Gemini API key is not configured.", 500);
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }

  return geminiClient;
};

module.exports = {
  getGeminiClient,
  geminiModel: env.GEMINI_MODEL,
};
