const { getGroqClient, getGroqClients, groqModel } = require("../../config/groq");
const { getSupabaseAdmin } = require("../../config/supabase");
const { AppError } = require("../../middleware/error/AppError");

const generateTitle = (text) => {
  if (!text || typeof text !== "string") return "New Conversation";
  const clean = text.replace(/[\r\n\t]+/g, " ").trim();
  if (clean.length <= 45) return clean;
  return clean.slice(0, 42).trim() + "...";
};

const generateChatResponse = async (messages) => {
  const clients = getGroqClients();

  // Inject system prompt to set the persona and strict formatting guidelines
  const systemPrompt = {
    role: "system",
    content: `You are CareerPilot AI, an expert Senior Technical Career Coach and Software Architect. 
Your goal is to help software engineers navigate their careers, prepare for interviews, improve their resumes, and master technical skills like system design, DSA, and modern web frameworks.
Be concise, encouraging, and highly technical when appropriate.

Format your responses neatly using GitHub Flavored Markdown:
- Use clear section headings (##, ###) and structured bullet points.
- When creating tables (such as action plans, comparisons, or schedules), format them strictly as valid multi-line Markdown tables with each row on its own separate line, preceded and followed by blank lines. Never squash table rows into a single line.
- Provide code snippets in fenced code blocks with the programming language tag (e.g., \`\`\`javascript, \`\`\`python).
- Always ensure your response is fully complete and never stops abruptly in the middle of a sentence, list, or table.`
  };

  const apiMessages = [systemPrompt, ...messages];
  let lastError;

  for (let cIdx = 0; cIdx < clients.length; cIdx++) {
    const { name, client } = clients[cIdx];
    try {
      const response = await client.chat.completions.create({
        model: groqModel,
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 4096,
      });

      return response.choices[0].message.content;
    } catch (error) {
      lastError = error;
      console.warn(`[Groq Multi-API] Chat completion on ${name} failed: ${error.message}.`);
      if (cIdx < clients.length - 1) {
        console.warn(`Redirecting to next API tier (${clients[cIdx + 1].name})...`);
      }
    }
  }

  console.error("Groq Chat Error across all API tiers:", lastError);
  throw new AppError("Failed to generate AI response across all available APIs.", 500);
};

const getConversations = async (userId) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("advisor_conversations")
    .select("id, title, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch advisor conversations:", error);
    throw new AppError("Failed to fetch chat history.", 500);
  }

  return data || [];
};

const getConversationDetails = async (userId, conversationId) => {
  const supabase = getSupabaseAdmin();

  // 1. Enforce ownership: conversation must belong to authenticated user
  const { data: conversation, error: convError } = await supabase
    .from("advisor_conversations")
    .select("id, title, created_at, updated_at")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .single();

  if (convError || !conversation) {
    throw new AppError("Conversation not found or access denied.", 404);
  }

  // 2. Fetch messages ordered chronologically
  const { data: messages, error: msgError } = await supabase
    .from("advisor_messages")
    .select("id, role, message, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (msgError) {
    console.error("Failed to fetch advisor messages:", msgError);
    throw new AppError("Failed to fetch conversation messages.", 500);
  }

  return {
    conversation,
    messages: (messages || []).map((m) => ({
      id: m.id,
      role: m.role,
      content: m.message,
      created_at: m.created_at,
    })),
  };
};

const saveChatExchange = async (userId, conversationId, userMessageText, aiResponseText) => {
  const supabase = getSupabaseAdmin();
  let activeConversationId = conversationId;

  // If conversationId is provided, verify it belongs to this user
  if (activeConversationId) {
    const { data: existing, error: checkError } = await supabase
      .from("advisor_conversations")
      .select("id")
      .eq("id", activeConversationId)
      .eq("user_id", userId)
      .single();

    if (checkError || !existing) {
      activeConversationId = null;
    }
  }

  // If no valid conversationId, create a new conversation
  if (!activeConversationId) {
    const title = generateTitle(userMessageText);
    const { data: newConv, error: createError } = await supabase
      .from("advisor_conversations")
      .insert({
        user_id: userId,
        title: title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError || !newConv) {
      console.error("Failed to create advisor conversation:", createError);
      throw new AppError("Failed to initialize conversation in database.", 500);
    }

    activeConversationId = newConv.id;
  } else {
    // Update updated_at on existing conversation
    await supabase
      .from("advisor_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", activeConversationId)
      .eq("user_id", userId);
  }

  // Persist both user message and AI response
  const now = new Date().toISOString();
  const { error: msgInsertError } = await supabase
    .from("advisor_messages")
    .insert([
      {
        conversation_id: activeConversationId,
        role: "user",
        message: userMessageText,
        created_at: now,
      },
      {
        conversation_id: activeConversationId,
        role: "assistant",
        message: aiResponseText,
        created_at: new Date(Date.now() + 10).toISOString(),
      },
    ]);

  if (msgInsertError) {
    console.error("Failed to persist advisor messages:", msgInsertError);
  }

  return activeConversationId;
};

const deleteConversation = async (userId, conversationId) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("advisor_conversations")
    .delete()
    .eq("id", conversationId)
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to delete advisor conversation:", error);
    throw new AppError("Failed to delete conversation.", 500);
  }

  return { success: true };
};

const renameConversation = async (userId, conversationId, newTitle) => {
  const supabase = getSupabaseAdmin();
  if (!newTitle || typeof newTitle !== "string" || !newTitle.trim()) {
    throw new AppError("A valid conversation title is required.", 400);
  }

  const cleanTitle = newTitle.trim().slice(0, 100);

  const { data, error } = await supabase
    .from("advisor_conversations")
    .update({ 
      title: cleanTitle,
      updated_at: new Date().toISOString()
    })
    .eq("id", conversationId)
    .eq("user_id", userId)
    .select("id, title, updated_at")
    .single();

  if (error || !data) {
    console.error("Failed to rename advisor conversation:", error);
    throw new AppError("Failed to rename conversation.", 500);
  }

  return data;
};

module.exports = {
  generateChatResponse,
  getConversations,
  getConversationDetails,
  saveChatExchange,
  deleteConversation,
  renameConversation,
};
