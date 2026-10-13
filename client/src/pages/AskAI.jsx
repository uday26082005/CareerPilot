import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { 
  Plus, Send, FileText, BookOpen, Target, Briefcase, 
  Bot, User, Loader2, History, Copy, Check, X, 
  MessageSquare, Trash2, AlertCircle, Pencil, Sun, Moon 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ui/ConfirmModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const ACTIVE_CONV_STORAGE_KEY = "careerpilot_active_advisor_conv";
const DEFAULT_GREETING = { 
  role: "assistant", 
  content: "Hi! I am CareerPilot AI. How can I help you with your career today?" 
};

const formatRelativeTime = (isoString) => {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

const extractText = (node) => {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node.props && node.props.children) return extractText(node.props.children);
  return String(node);
};

// Formats messy raw AI responses neatly into proper Markdown before rendering
const formatAiResponse = (text) => {
  if (!text || typeof text !== "string") return "";

  // Separate code blocks from regular markdown so code contents aren't modified
  const codeBlockRegex = /(```[\s\S]*?```|~~~[\s\S]*?~~~)/g;
  const segments = text.split(codeBlockRegex);

  const formattedSegments = segments.map((segment) => {
    // If it's a code block, preserve it as is
    if (/^(```|~~~)/.test(segment.trim())) {
      return segment;
    }

    let s = segment;

    // 1. Fix squashed markdown tables where rows are separated by | | or |  | instead of newlines
    s = s.replace(/\|\s*\|\s*/g, "|\n| ");

    // 2. Ensure each row starting with | ends with | if missing before a newline or end of text
    s = s.split("\n").map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("|") && !trimmed.endsWith("|")) {
        return line + " |";
      }
      return line;
    }).join("\n");

    // 3. Ensure a blank line BEFORE the entire table if preceded by text
    s = s.replace(/([^\n|])\n(\|[^\n]+\|)/g, "$1\n\n$2");

    // 4. Ensure a blank line AFTER a table if followed by normal text
    s = s.replace(/(\|[^\n]+\|)\n([^\n|])/g, "$1\n\n$2");

    // 5. Ensure headings (#, ##, ###) have a leading blank line if preceded by normal text
    s = s.replace(/([^\n#])\n(#{1,6}\s+)/g, "$1\n\n$2");

    // 6. Ensure headings have a space after hashes: e.g. "###Heading" -> "### Heading"
    s = s.replace(/^(#{1,6})([^#\s])/gm, "$1 $2");

    // 7. Ensure lists have a leading blank line if preceded by normal text
    s = s.replace(/([^\n])\n([*-]\s+|\d+\.\s+)/g, "$1\n\n$2");

    // 8. Clean up excessive consecutive blank lines (max 2)
    s = s.replace(/\n{3,}/g, "\n\n");

    return s;
  });

  return formattedSegments.join("");
};

// Code block with language tag and top-right copy button
function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);
  const codeContent = extractText(children).replace(/\r?\n$/, "");

  const codeChild = React.isValidElement(children) ? children : null;
  const className = codeChild?.props?.className || "";
  const langMatch = /language-(\w+)/.exec(className);
  const language = langMatch ? langMatch[1] : "";

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!codeContent) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(codeContent);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = codeContent;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code to clipboard:", err);
    }
  };

  return (
    <div className="relative group my-3 rounded-xl border border-white/[0.08] bg-[#121316] overflow-hidden not-prose">
      {/* Code Header Bar: Language label on left, Copy button on top right */}
      <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-white/[0.06] bg-[#16171c]/80 select-none">
        <span className="text-[11px] font-mono font-medium text-slate-400 lowercase">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all focus:outline-none focus:ring-1 focus:ring-[#ffd159]/40"
          title={copied ? "Copied code" : "Copy code"}
          aria-label={copied ? "Copied code" : "Copy code"}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#4ee4cb]" />
              <span className="text-[#4ee4cb] font-medium text-[11px]">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <pre className="!m-0 p-4 !bg-transparent overflow-x-auto text-[13.5px] font-mono leading-relaxed text-slate-200">
        {children}
      </pre>
    </div>
  );
}

const markdownComponents = {
  pre: CodeBlock,
  table: ({ children }) => (
    <div className="my-4 w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#16171c]/60 shadow-sm">
      <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-white/[0.04] text-xs font-semibold uppercase tracking-wider text-slate-800 dark:text-slate-200">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-200 text-xs whitespace-nowrap">
      {children}
    </th>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-slate-200 dark:border-white/[0.04] transition-colors hover:bg-slate-100/60 dark:hover:bg-white/[0.02] last:border-0">
      {children}
    </tr>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-[13.5px] leading-relaxed text-slate-700 dark:text-slate-300">
      {children}
    </td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-3 border-amber-500 bg-amber-500/5 px-4 py-2.5 rounded-r-xl text-slate-700 dark:text-slate-300 italic text-[14px]">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-5 border-slate-200 dark:border-white/[0.08]" />,
};

export default function AskAI() {
  const currentYear = new Date().getFullYear();
  const suggestions = [
    { text: "How can I improve my resume?", icon: FileText, color: "text-purple-600 dark:text-[#e29aff] bg-purple-50 dark:bg-[#e29aff]/10 border border-purple-200 dark:border-[#e29aff]/20" },
    { text: `What skills are in demand in ${currentYear}?`, icon: BookOpen, color: "text-teal-600 dark:text-[#4ee4cb] bg-teal-50 dark:bg-[#4ee4cb]/10 border border-teal-200 dark:border-[#4ee4cb]/20" },
    { text: "How to prepare for system design?", icon: Target, color: "text-blue-600 dark:text-[#72c5ff] bg-blue-50 dark:bg-[#72c5ff]/10 border border-blue-200 dark:border-[#72c5ff]/20" },
    { text: "Suggest a learning roadmap for me", icon: Briefcase, color: "text-amber-600 dark:text-[#ffd159] bg-amber-50 dark:bg-[#ffd159]/10 border border-amber-200 dark:border-[#ffd159]/20" },
  ];

  const location = useLocation();
  const { session } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  
  // Chat state
  const [messages, setMessages] = useState([DEFAULT_GREETING]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  
  // History state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);

  // Rename state
  const [editingConvId, setEditingConvId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  // Themed delete modal state
  const [convToDelete, setConvToDelete] = useState(null);
  const [isDeletingConv, setIsDeletingConv] = useState(false);

  const fileInputRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Fetch list of conversations
  const fetchConversations = async () => {
    if (!session?.access_token) return;
    setIsLoadingHistory(true);
    setHistoryError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/advisor/conversations`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setConversations(data.data);
        return data.data;
      } else {
        throw new Error(data.message || "Failed to load chat history");
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setHistoryError("Failed to load chat history. Please try again.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Load a specific conversation's messages
  const loadConversation = async (id) => {
    if (!id || !session?.access_token) return;
    setIsLoadingConversation(true);
    try {
      const res = await fetch(`${API_BASE_URL}/advisor/conversations/${id}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      const data = await res.json();
      if (data.success && data.data?.messages) {
        setConversationId(id);
        localStorage.setItem(ACTIVE_CONV_STORAGE_KEY, id);
        // Prepend friendly assistant greeting so layout remains consistent
        setMessages([DEFAULT_GREETING, ...data.data.messages]);
        setIsHistoryOpen(false);
      } else {
        throw new Error(data.message || "Conversation not found");
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
      toast.error("Could not load selected conversation.");
    } finally {
      setIsLoadingConversation(false);
    }
  };

  // Start fresh new conversation
  const handleNewChat = () => {
    setConversationId(null);
    localStorage.removeItem(ACTIVE_CONV_STORAGE_KEY);
    setMessages([DEFAULT_GREETING]);
    setQuestion("");
    setIsHistoryOpen(false);
  };

  // Open custom themed confirm dialog for deletion
  const handlePromptDelete = (conv, e) => {
    e.stopPropagation();
    setConvToDelete(conv);
  };

  // Confirm and execute conversation deletion
  const handleConfirmDelete = async () => {
    if (!convToDelete) return;
    setIsDeletingConv(true);
    try {
      const res = await fetch(`${API_BASE_URL}/advisor/conversations/${convToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setConversations(prev => prev.filter(c => c.id !== convToDelete.id));
        if (conversationId === convToDelete.id) {
          handleNewChat();
        }
        toast.success("Conversation deleted");
      } else {
        toast.error(data.message || "Failed to delete conversation");
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
      toast.error("Failed to delete conversation. Please try again.");
    } finally {
      setIsDeletingConv(false);
      setConvToDelete(null);
    }
  };

  // Start renaming a conversation
  const handleStartRename = (conv, e) => {
    e.stopPropagation();
    setEditingConvId(conv.id);
    setEditingTitle(conv.title || "");
  };

  // Cancel renaming
  const handleCancelRename = (e) => {
    if (e) e.stopPropagation();
    setEditingConvId(null);
    setEditingTitle("");
  };

  // Save renamed conversation title
  const handleSaveRename = async (id, e) => {
    if (e) e.stopPropagation();
    const trimmedTitle = editingTitle.trim();
    if (!trimmedTitle) {
      handleCancelRename();
      return;
    }

    setIsRenaming(true);
    try {
      const res = await fetch(`${API_BASE_URL}/advisor/conversations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ title: trimmedTitle })
      });
      const data = await res.json();
      if (data.success) {
        setConversations(prev =>
          prev.map(c => (c.id === id ? { ...c, title: trimmedTitle } : c))
        );
        setEditingConvId(null);
        setEditingTitle("");
        toast.success("Conversation renamed");
      } else {
        throw new Error(data.message || "Failed to rename conversation");
      }
    } catch (err) {
      console.error("Failed to rename conversation:", err);
      toast.error("Could not rename conversation. Please try again.");
    } finally {
      setIsRenaming(false);
    }
  };

  // Initial load: fetch history and restore active conversation if any
  useEffect(() => {
    if (session?.access_token) {
      fetchConversations().then((loadedConvs) => {
        const savedConvId = localStorage.getItem(ACTIVE_CONV_STORAGE_KEY);
        if (savedConvId && loadedConvs && loadedConvs.some(c => c.id === savedConvId)) {
          loadConversation(savedConvId);
        }
      });
    }
  }, [session?.access_token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
    }
  };

  const handleSend = async (textToSend = question) => {
    if (!textToSend.trim()) return;

    const newMessages = [...messages, { role: "user", content: textToSend }];
    setMessages(newMessages);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/advisor/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          conversationId: conversationId || undefined
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: data.data.role, content: data.data.content }]);
        
        // Save active conversation ID and update history list
        if (data.data.conversationId) {
          setConversationId(data.data.conversationId);
          localStorage.setItem(ACTIVE_CONV_STORAGE_KEY, data.data.conversationId);
          fetchConversations();
        }
      } else {
        throw new Error(data.message || "Failed to fetch AI response");
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error while processing your request. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q) {
      setQuestion(q);
      setTimeout(() => handleSend(q), 100);
    }
  }, [location.search]);

  useEffect(() => {
    if (messages.length > 1 && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 max-w-5xl w-full mx-auto gap-4 relative">
      {/* Page Header */}
      <div className="shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">AskAI</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your personalized AI career coach</p>
        </div>

        {/* Action Controls: Theme, New Chat & History */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] text-slate-600 dark:text-slate-300 shadow-sm transition-all hover:bg-slate-100 dark:hover:bg-[#242730] dark:hover:text-white active:scale-95"
            title={isDark ? "Switch to White Mode" : "Switch to Dark Mode"}
            aria-label={isDark ? "Switch to White Mode" : "Switch to Dark Mode"}
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-[#ffd159] transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
            )}
          </button>
          <button
            type="button"
            onClick={handleNewChat}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition-all hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#242730] hover:text-slate-900 dark:hover:text-white active:scale-95"
            title="Start a new conversation"
          >
            <Plus className="h-4 w-4 text-amber-500 dark:text-[#ffd159]" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsHistoryOpen(true);
              fetchConversations();
            }}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-sm transition-all active:scale-95 ${
              isHistoryOpen
                ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:border-[#ffd159]/40 dark:bg-[#ffd159]/10 dark:text-[#ffd159]"
                : "border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-[#242730] hover:text-slate-900 dark:hover:text-white"
            }`}
            title="View chat history"
          >
            <History className="h-4 w-4" />
            <span>History</span>
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        
        {/* Messages Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 min-h-0 overflow-y-auto py-4 space-y-6 relative"
        >
          
          {messages.length === 1 && (
            <div className="flex flex-col items-center justify-center h-full text-center mt-6 mb-10 px-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd159]/10 text-amber-600 dark:text-[#ffd159] border border-amber-500/20 dark:border-[#ffd159]/20 mb-5 shadow-lg shadow-amber-500/5">
                <Bot className="h-7 w-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                How can I help you accelerate your career today?
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-md">
                Ask anything about interview prep, technical roadmaps, resume improvement, or current market demands.
              </p>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-4xl">
                {suggestions.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(item.text)}
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-5 text-center transition-all hover:bg-slate-50 dark:hover:bg-[#20222a] hover:border-slate-300 dark:hover:border-white/20 hover:-translate-y-0.5 shadow-sm dark:shadow-md dark:shadow-black/20 group"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.color} transition-transform group-hover:scale-110 shadow-sm`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-relaxed">{item.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.length > 1 && messages.map((msg, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={idx}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-1 ${msg.role === "user" ? "bg-gradient-to-r from-[#ffd159] to-[#fed656] text-slate-950 font-bold shadow-md shadow-amber-500/10" : "bg-[#ffd159]/10 text-amber-600 dark:text-[#ffd159] border border-amber-500/20 dark:border-[#ffd159]/20"}`}>
                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`group relative rounded-2xl px-5 py-4 ${msg.role === "user" ? "bg-gradient-to-r from-[#ffd159] to-[#fed656] text-slate-950 font-medium shadow-md shadow-amber-500/10 rounded-tr-sm" : "bg-white dark:bg-[#1c1e24] border border-slate-200 dark:border-white/[0.08] text-slate-800 dark:text-slate-200 shadow-sm dark:shadow-md rounded-tl-sm"}`}>
                    {msg.role === "user" ? (
                      <p className="text-[15px] whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <div className="prose prose-sm dark:prose-invert max-w-none text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 prose-headings:text-slate-900 dark:prose-headings:text-white prose-strong:text-slate-900 dark:prose-strong:text-white prose-a:text-amber-600 dark:prose-a:text-[#ffd159] hover:prose-a:underline prose-code:text-teal-700 dark:prose-code:text-[#4ee4cb] prose-code:bg-slate-100 dark:prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-[#121316] prose-pre:border prose-pre:border-slate-800 dark:prose-pre:border-white/[0.08]">
                          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {formatAiResponse(msg.content)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full justify-start"
              >
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-1 bg-[#ffd159]/10 text-amber-600 dark:text-[#ffd159] border border-amber-500/20 dark:border-[#ffd159]/20">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl px-5 py-4 bg-white dark:bg-[#1c1e24] border border-slate-200 dark:border-white/[0.08] shadow-sm dark:shadow-md rounded-tl-sm flex items-center gap-3">
                    <Loader2 className="h-4 w-4 text-amber-500 dark:text-[#ffd159] animate-spin" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">CareerPilot AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>

        {/* Bottom Input Area */}
        <div className="shrink-0 pt-4 pb-2">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] px-4 py-2.5 shadow-sm dark:shadow-lg dark:shadow-black/20 focus-within:border-amber-500/50 dark:focus-within:border-[#ffd159]/50 focus-within:ring-1 focus-within:ring-amber-500/50 dark:focus-within:ring-[#ffd159]/50 transition-all"
          >
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white shrink-0 transition-colors"
              title="Attach file"
            >
              <Plus className="h-5 w-5" />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
            
            <input 
              type="text" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything about your career..." 
              className="flex-1 bg-transparent px-3 py-2 text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
              disabled={isLoading}
            />
            
            <button 
              type="submit"
              disabled={!question.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] text-slate-950 font-bold shadow-md shadow-amber-500/10 transition-all hover:brightness-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-100 dark:disabled:bg-[#2e323e] disabled:text-slate-400 dark:disabled:text-slate-500 shrink-0"
            >
              <Send className="h-4 w-4 -ml-0.5" />
            </button>
          </form>
        </div>

      </div>

      {/* History Slide-over Drawer */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHistoryOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-over Drawer Panel */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-88 md:w-96 bg-white dark:bg-[#16171c] border-l border-slate-200 dark:border-white/[0.08] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#1c1e24]">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffd159]/10 text-amber-600 dark:text-[#ffd159] border border-amber-500/20 dark:border-[#ffd159]/20">
                    <History className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Chat History</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Previous AskAI conversations</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsHistoryOpen(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    title="Close history"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Content / Conversation List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
                {isLoadingHistory ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-3 text-slate-400">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-500 dark:text-[#ffd159]" />
                    <span className="text-xs">Loading conversations...</span>
                  </div>
                ) : historyError ? (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center">
                    <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400 mx-auto mb-2" />
                    <p className="text-xs text-red-600 dark:text-red-300 mb-3">{historyError}</p>
                    <button
                      type="button"
                      onClick={fetchConversations}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-700 dark:text-red-300 text-xs font-semibold hover:bg-red-500/30 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#242730] text-slate-400 dark:text-slate-500 mb-3 border border-slate-200 dark:border-white/[0.06]">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">No conversations yet</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[220px]">
                      Your conversations with CareerPilot AI will appear here automatically.
                    </p>
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const isActive = conversationId === conv.id;
                    const isEditing = editingConvId === conv.id;

                    return (
                      <div
                        key={conv.id}
                        onClick={() => {
                          if (!isEditing) loadConversation(conv.id);
                        }}
                        className={`group relative flex items-start justify-between gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isActive
                            ? "bg-[#FFF7E6] border-[#FDE7B0] text-amber-900 dark:bg-[#ffd159]/10 dark:border-[#ffd159]/30 dark:text-white shadow-2xs font-semibold"
                            : "bg-white dark:bg-[#1c1e24] border-slate-200 dark:border-white/[0.06] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#20222a] hover:border-slate-300 dark:hover:border-white/15 hover:text-slate-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <MessageSquare className={`h-4 w-4 mt-0.5 shrink-0 ${isActive ? "text-amber-600 dark:text-[#ffd159]" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                          <div className="min-w-0 flex-1">
                            {isEditing ? (
                              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSaveRename(conv.id, e);
                                    if (e.key === "Escape") handleCancelRename(e);
                                  }}
                                  autoFocus
                                  disabled={isRenaming}
                                  className="w-full rounded-lg border border-amber-500/40 dark:border-[#ffd159]/40 bg-slate-50 dark:bg-[#121316] px-2 py-1 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:focus:ring-[#ffd159]"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => handleSaveRename(conv.id, e)}
                                  disabled={isRenaming}
                                  className="p-1 rounded-lg text-teal-600 dark:text-[#4ee4cb] hover:bg-teal-500/10 transition-colors shrink-0"
                                  title="Save title"
                                >
                                  {isRenaming ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelRename}
                                  disabled={isRenaming}
                                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors shrink-0"
                                  title="Cancel"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <>
                                <h4 className="text-xs font-semibold truncate leading-snug">
                                  {conv.title || "Untitled Conversation"}
                                </h4>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                                  {formatRelativeTime(conv.updated_at || conv.created_at)}
                                </p>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Action buttons (Rename & Delete) */}
                        {!isEditing && (
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => handleStartRename(conv, e)}
                              className="p-1 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-[#ffd159] hover:bg-amber-500/10 transition-all"
                              title="Rename conversation"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handlePromptDelete(conv, e)}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                              title="Delete conversation"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#1c1e24]">
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] py-2.5 font-bold text-xs text-slate-950 transition-all hover:brightness-105 active:scale-95 shadow-md shadow-amber-500/10"
                >
                  <Plus className="h-4 w-4" />
                  <span>Start New Conversation</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Loading Overlay while switching conversation */}
      {isLoadingConversation && (
        <div className="absolute inset-0 z-30 bg-slate-900/40 dark:bg-[#121316]/70 backdrop-blur-xs flex items-center justify-center rounded-2xl">
          <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-[#1c1e24] border border-slate-200 dark:border-white/10 px-5 py-3 shadow-xl">
            <Loader2 className="h-5 w-5 animate-spin text-amber-500 dark:text-[#ffd159]" />
            <span className="text-sm text-slate-800 dark:text-slate-300 font-medium">Loading conversation...</span>
          </div>
        </div>
      )}

      {/* Themed Confirmation Modal for Deleting Conversation */}
      <ConfirmModal
        isOpen={Boolean(convToDelete)}
        onClose={() => {
          if (!isDeletingConv) setConvToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Conversation?"
        description="Are you sure you want to delete this conversation? All messages within this chat will be permanently removed. This action cannot be undone."
        itemTitle={convToDelete?.title || "Untitled Conversation"}
        confirmText="Delete Chat"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeletingConv}
      />
    </div>
  );
}
