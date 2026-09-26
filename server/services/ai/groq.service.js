const { getGroqClient, groqModel } = require("../../config/groq");
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
 * Features automated multi-model fallback and dynamic token ceiling.
 */
const generateStructuredResponse = async (prompt, zodSchema, options = {}) => {
  const { temperature = 0.2, maxRetries = 2, max_tokens = 1800 } = options;
  const client = getGroqClient();

  const modelsToTry = [
    groqModel || "qwen/qwen3.8-27b",
    ...BACKUP_MODELS.filter(m => m !== (groqModel || "qwen/qwen3.8-27b"))
  ];

  let lastError;

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
        const isRateLimit = msg.includes("429");
        const isBusy = msg.includes("503") || msg.includes("UNAVAILABLE");
        const isTruncated = msg.includes("json_validate_failed") || msg.includes("max completion tokens");

        if (isRateLimit && mIdx < modelsToTry.length - 1) {
          console.warn(`[Groq AI] Rate limit reached on ${currentModel}. Seamlessly switching to fallback model ${modelsToTry[mIdx + 1]}...`);
          break; // break to try next model immediately without delay
        }

        if ((isBusy || isRateLimit || isTruncated) && attempt < maxRetries) {
          const delayMs = attempt * 1200;
          console.warn(`[Groq AI] Request busy or rate-limited (${currentModel}, attempt ${attempt}/${maxRetries}). Retrying in ${delayMs}ms...`);
          await new Promise(res => setTimeout(res, delayMs));
          continue;
        }

        if (error instanceof AppError) {
          throw error;
        }

        // Try next fallback model if available
        break;
      }
    }
  }

  console.error("All Groq AI models/retries exhausted:", lastError);
  throw new AppError(`AI analysis failed: ${lastError?.message || "Unknown error"}`, 500);
};

const fs = require('fs');

/**
 * Transcribes audio using Groq's Whisper API.
 */
const transcribeAudio = async (filePath, extension = "webm") => {
  const client = getGroqClient();
  
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
    console.error("Groq Transcription failed:", error);
    throw new AppError(`Transcription failed: ${error.message}`, 500);
  }
};

module.exports = {
  generateStructuredResponse,
  transcribeAudio,
};
