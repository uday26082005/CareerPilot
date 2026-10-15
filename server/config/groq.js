const Groq = require("groq-sdk");
const { env } = require("./env");
const { AppError } = require("../middleware/error/AppError");

const clientPool = new Map();

/**
 * Returns an array of available Groq API instances in priority order:
 * 1. Primary API (GROQ_API_KEY)
 * 2. Secondary API (GROQ_API_KEY_2)
 * 3. Tertiary API (GROQ_API_KEY_3)
 */
const getGroqClients = () => {
  const keys = [
    { id: 1, name: "Primary API (Key 1)", key: env.GROQ_API_KEY || process.env.GROQ_API_KEY },
    { id: 2, name: "Secondary API (Key 2)", key: env.GROQ_API_KEY_2 || process.env.GROQ_API_KEY_2 },
    { id: 3, name: "Tertiary API (Key 3)", key: env.GROQ_API_KEY_3 || process.env.GROQ_API_KEY_3 },
  ].filter(item => Boolean(item.key && item.key.trim().length > 0));

  if (keys.length === 0) {
    throw new AppError("No Groq API keys are configured.", 500);
  }

  return keys.map(({ id, name, key }) => {
    const trimmedKey = key.trim();
    const existing = clientPool.get(id);
    if (!existing || existing.key !== trimmedKey) {
      clientPool.set(id, { client: new Groq({ apiKey: trimmedKey }), key: trimmedKey });
    }
    return {
      id,
      name,
      client: clientPool.get(id).client
    };
  });
};

const getGroqClient = () => {
  const all = getGroqClients();
  return all[0].client;
};

module.exports = {
  getGroqClient,
  getGroqClients,
  groqModel: env.GROQ_MODEL || "qwen/qwen3.8-27b",
};
