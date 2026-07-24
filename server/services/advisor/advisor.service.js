const { getGroqClient, groqModel } = require("../../config/groq");
const { AppError } = require("../../middleware/error/AppError");

const generateChatResponse = async (messages) => {
  try {
    const client = getGroqClient();

    // Inject system prompt to set the persona
    const systemPrompt = {
      role: "system",
      content: `You are CareerPilot AI, an expert Senior Technical Career Coach and Software Architect. 
Your goal is to help software engineers navigate their careers, prepare for interviews, improve their resumes, and master technical skills like system design, DSA, and modern web frameworks.
Be concise, encouraging, and highly technical when appropriate. Format your responses using markdown.`
    };

    const apiMessages = [systemPrompt, ...messages];

    const response = await client.chat.completions.create({
      model: groqModel,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Groq Chat Error:", error);
    throw new AppError("Failed to generate AI response.", 500);
  }
};

module.exports = {
  generateChatResponse,
};
