const { getGeminiClient, geminiModel } = require("../../config/gemini");
const { AppError } = require("../../middleware/error/AppError");

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
 * Generates a structured JSON response from Gemini, validated against a Zod schema.
 * 
 * @param {string} prompt - The prompt to send to Gemini.
 * @param {import("zod").ZodSchema} zodSchema - The Zod schema to parse and validate the result.
 * @param {object} options - Additional configuration options.
 * @returns {Promise<object>} The validated data.
 */
const generateStructuredResponse = async (prompt, zodSchema, options = {}) => {
  const { temperature = 0.2 } = options;
  const client = getGeminiClient();

  try {
    const response = await client.models.generateContent({
      model: geminiModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        // Pass a very generic object schema to force JSON output
        responseSchema: {
          type: "OBJECT",
        },
        temperature,
      },
    });

    const parsedJson = extractJson(response.text);
    return zodSchema.parse(parsedJson);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error("Gemini AI request failed:", error);
    throw new AppError(`AI analysis failed: ${error.message}`, 500);
  }
};

module.exports = {
  generateStructuredResponse,
};
