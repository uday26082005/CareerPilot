const { getGroqClient, getGroqClients, groqModel } = require("../../config/groq");
const { AppError } = require("../../middleware/error/AppError");

// Available backup models in case primary model hits rate limit or error
const BACKUP_MODELS = [
  groqModel || "qwen/qwen3.8-27b",
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b"
];

const extractJson = (responseText) => {
  const trimmed = String(responseText || "").trim();
  const jsonText = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Failed to parse schema-enforced JSON:", jsonText);
    throw new AppError("Invalid response format received from AI.", 500);
  }
};

/**
 * Generates a structured JSON response from Groq, validated against a Zod schema.
 * Features 3-tier API failover (Key 1 -> Key 2 -> Key 3) and multi-model fallback.
 */
const generateStructuredResponse = async (prompt, zodSchema, options = {}) => {
  const { temperature = 0.2, maxRetries = 2, max_tokens = 1800 } = options;
  const clients = getGroqClients();

  const modelsToTry = [
    groqModel || "qwen/qwen3.8-27b",
    ...BACKUP_MODELS.filter(m => m !== (groqModel || "qwen/qwen3.8-27b"))
  ];

  let lastError;

  // Failover across configured API tiers (Primary -> Backup 1 -> Backup 2)
  for (let cIdx = 0; cIdx < clients.length; cIdx++) {
    const { name, client } = clients[cIdx];

    for (let mIdx = 0; mIdx < modelsToTry.length; mIdx++) {
      const currentModel = modelsToTry[mIdx];

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await client.chat.completions.create({
            model: currentModel,
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature,
            max_tokens,
          });

          const parsedJson = extractJson(response.choices[0].message.content);
          return zodSchema.parse(parsedJson);
        } catch (error) {
          lastError = error;
          const msg = String(error.message || "");
          const isRateLimit = msg.includes("429") || msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("tokens per minute");
          const isQuota = msg.includes("insufficient_quota") || msg.toLowerCase().includes("quota");
          const isAuth = msg.includes("401") || msg.toLowerCase().includes("invalid api key");
          const isBusy = msg.includes("503") || msg.includes("UNAVAILABLE");
          const isTruncated = msg.includes("json_validate_failed") || msg.includes("max completion tokens");

          // If rate limit, quota or auth failure and another API tier exists, switch to next API tier immediately
          if ((isRateLimit || isQuota || isAuth) && cIdx < clients.length - 1) {
            console.warn(`[Groq Multi-API] ${name} encountered an issue (${error.message}). Seamlessly redirecting to next API tier (${clients[cIdx + 1].name})...`);
            mIdx = modelsToTry.length; // break model loop to move to next client
            break; // break retry loop
          }

          // If rate limited on the current client and more models exist
          if (isRateLimit && mIdx < modelsToTry.length - 1) {
            console.warn(`[Groq AI] Rate limit reached on ${currentModel} (${name}). Switching to fallback model ${modelsToTry[mIdx + 1]}...`);
            break;
          }

          if ((isBusy || isRateLimit || isTruncated) && attempt < maxRetries) {
            const delayMs = attempt * 1000;
            console.warn(`[Groq AI] Request busy or rate-limited (${currentModel}, ${name}, attempt ${attempt}/${maxRetries}). Retrying in ${delayMs}ms...`);
            await new Promise(res => setTimeout(res, delayMs));
            continue;
          }

          if (error instanceof AppError) {
            throw error;
          }

          // Try next fallback model
          break;
        }
      }
    }
  }

  console.error("All Groq AI API tiers and models exhausted:", lastError);
  throw new AppError(`AI analysis failed: ${lastError?.message || "Unknown error"}`, 500);
};

const fs = require('fs');

/**
 * Transcribes audio using Groq's Whisper API with multi-tier API failover.
 */
const transcribeAudio = async (filePath, extension = "webm") => {
  const clients = getGroqClients();
  let lastError;

  for (let cIdx = 0; cIdx < clients.length; cIdx++) {
    const { name, client } = clients[cIdx];
    try {
      const file = fs.createReadStream(filePath);
      
      const response = await client.audio.transcriptions.create({
        file: file,
        model: "whisper-large-v3",
        response_format: "json",
        temperature: 0.0,
        prompt: "This is a candidate's answer during a professional job interview. Please transcribe their voice.",
        language: "en",
      });
      return response.text;
    } catch (error) {
      lastError = error;
      console.warn(`[Groq Multi-API] Transcription failed on ${name}: ${error.message}.`);
      if (cIdx < clients.length - 1) {
        console.warn(`Redirecting to next API tier (${clients[cIdx + 1].name})...`);
      }
    }
  }

  console.error("Groq Transcription failed across all API tiers:", lastError);
  throw new AppError(`Transcription failed: ${lastError?.message || "Unknown error"}`, 500);
};

module.exports = {
  generateStructuredResponse,
  transcribeAudio,
};
