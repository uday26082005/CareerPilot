const advisorService = require("../services/advisor/advisor.service");

const chat = async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "A valid messages array is required.",
      });
    }

    const aiResponse = await advisorService.generateChatResponse(messages);

    res.status(200).json({
      success: true,
      data: {
        role: "assistant",
        content: aiResponse,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
};
