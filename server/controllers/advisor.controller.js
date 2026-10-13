const advisorService = require("../services/advisor/advisor.service");

const chat = async (req, res, next) => {
  try {
    const { messages, conversationId } = req.body;
    const userId = req.user.id;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "A valid messages array is required.",
      });
    }

    // 1. Generate AI Response
    const aiResponse = await advisorService.generateChatResponse(messages);

    // 2. Persist in conversation history
    let activeConversationId = conversationId || null;
    try {
      const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
      if (lastUserMsg?.content) {
        activeConversationId = await advisorService.saveChatExchange(
          userId,
          conversationId,
          lastUserMsg.content,
          aiResponse
        );
      }
    } catch (dbErr) {
      console.error("Failed to persist chat exchange in background:", dbErr);
    }

    res.status(200).json({
      success: true,
      data: {
        role: "assistant",
        content: aiResponse,
        conversationId: activeConversationId,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const conversations = await advisorService.getConversations(req.user.id);
    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

const getConversation = async (req, res, next) => {
  try {
    const data = await advisorService.getConversationDetails(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteConversation = async (req, res, next) => {
  try {
    await advisorService.deleteConversation(req.user.id, req.params.id);
    res.status(200).json({
      success: true,
      message: "Conversation deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const renameConversation = async (req, res, next) => {
  try {
    const { title } = req.body;
    const conversation = await advisorService.renameConversation(req.user.id, req.params.id, title);
    res.status(200).json({
      success: true,
      data: conversation,
      message: "Conversation renamed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
  getConversations,
  getConversation,
  deleteConversation,
  renameConversation,
};
