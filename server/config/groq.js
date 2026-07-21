const Groq = require("groq-sdk");
const { env } = require("./env");
const { AppError } = require("../middleware/error/AppError");

let groqClient;

const getGroqClient = () => {
  if (!env.GROQ_API_KEY) {
    throw new AppError("Groq API key is not configured.", 500);
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey: env.GROQ_API_KEY });
  }

  return groqClient;
};

module.exports = {
  getGroqClient,
  groqModel: env.GROQ_MODEL,
};
