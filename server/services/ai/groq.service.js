const { getGroqClient, groqModel } = require("../../config/groq");
const { AppError } = require("../../middleware/error/AppError");
const { toFile } = require("groq-sdk");

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
 */
const generateStructuredResponse = async (prompt, zodSchema, options = {}) => {
  const { temperature = 0.2, maxRetries = 3 } = options;
  const client = getGroqClient();

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: groqModel,
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature,
      });

      const parsedJson = extractJson(response.choices[0].message.content);
      return zodSchema.parse(parsedJson);
    } catch (error) {
      const isRetryable = error.message?.includes("503") || error.message?.includes("429") || error.message?.includes("UNAVAILABLE");
      
      if (isRetryable && attempt < maxRetries) {
        const delayMs = attempt * 2000;
        console.warn(`Groq API busy (Attempt ${attempt}/${maxRetries}). Retrying in ${delayMs}ms...`);
        await new Promise(res => setTimeout(res, delayMs));
        continue;
      }

      if (error instanceof AppError) {
        throw error;
      }
      console.error("Groq AI request failed:", error);
      throw new AppError(`AI analysis failed: ${error.message}`, 500);
    }
  }
};

/**
 * Transcribes audio using Groq's Whisper API.
 */
const transcribeAudio = async (buffer, extension = "webm") => {
  const client = getGroqClient();
  
  try {
    const file = await toFile(buffer, `audio.${extension}`, { type: `audio/${extension}` });
    
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
