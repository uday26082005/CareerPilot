import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BrainCircuit, Plus, Send, FileText, BookOpen, Target, Briefcase, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import ReactMarkdown from 'react-markdown';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AskAI() {
  const suggestions = [
    { text: "How can I improve my resume?", icon: FileText, color: "text-violet-400 bg-violet-500/10" },
    { text: "What skills are in demand in 2024?", icon: BookOpen, color: "text-emerald-400 bg-emerald-500/10" },
    { text: "How to prepare for system design?", icon: Target, color: "text-blue-400 bg-blue-500/10" },
    { text: "Suggest a learning roadmap for me", icon: Briefcase, color: "text-orange-400 bg-orange-500/10" },
  ];

  const location = useLocation();
  const { session } = useAuth();
  
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I am CareerPilot AI. How can I help you with your career today?" }
  ]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q) {
      setQuestion(q);
      // Wait a tick for state to settle then send
      setTimeout(() => handleSend(q), 100);
    }
  }, [location.search]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
      // Feature for later
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
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
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

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-10rem)]">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600 blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }} 
          transition={{ duration: 10, repeat: Infinity, delay: 2, ease: "easeInOut" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600 blur-[120px]"
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 z-10 w-full max-w-4xl mx-auto space-y-6 pb-4">
        
        {messages.length === 1 && (
          <div className="flex flex-col items-center justify-center h-full mt-20">
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-800 shadow-[0_0_30px_rgba(139,92,246,0.4)] border border-violet-400/30"
            >
              <BrainCircuit className="h-8 w-8 text-white" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-slate-900 dark:text-white mb-2"
            >
              Ask CareerPilot AI
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base text-slate-500 dark:text-gray-400 mb-8"
            >
              How can I help you accelerate your career today?
            </motion.p>

            {/* Suggestion Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl"
            >
              {suggestions.map((item, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleSend(item.text)}
                  className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] p-4 text-left transition-all hover:bg-white dark:hover:bg-white/[0.05] hover:border-slate-300 dark:border-white/10 shadow-sm"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color} transition-transform group-hover:scale-110`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[13px] font-medium text-slate-700 dark:text-gray-300">{item.text}</span>
                </button>
              ))}
            </motion.div>
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
              <div className={`flex max-w-[80%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1 ${msg.role === "user" ? "bg-violet-600 text-white" : "bg-gradient-to-br from-violet-600 to-purple-800 text-white"}`}>
                  {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`rounded-2xl px-5 py-4 ${msg.role === "user" ? "bg-violet-600 text-white shadow-md rounded-tr-sm" : "bg-white dark:bg-[#0a0c1a] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-gray-200 shadow-xl rounded-tl-sm"}`}>
                  {msg.role === "user" ? (
                    <p className="text-[15px] whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert prose-violet max-w-none text-[15px]">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
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
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1 bg-gradient-to-br from-violet-600 to-purple-800 text-white">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl px-5 py-4 bg-white dark:bg-[#0a0c1a] border border-slate-200 dark:border-white/10 shadow-xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-violet-500 animate-spin" />
                  <span className="text-sm text-slate-500 dark:text-gray-400">CareerPilot AI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Bottom Input Area */}
      <div className="sticky bottom-[-2rem] mt-auto w-full z-20 pt-8 pb-2 bg-slate-50 dark:bg-[#060816]">
        <div className="mx-auto w-full max-w-4xl">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0c1a] px-4 py-3 shadow-2xl focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/50 transition-all"
          >
            
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 dark:text-gray-400 transition-all hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white shrink-0"
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
              className="flex-1 bg-transparent px-4 py-2 text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:text-gray-500 focus:outline-none"
              disabled={isLoading}
            />
            
            <button 
              type="submit"
              disabled={!question.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg transition-colors hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="h-4 w-4 -ml-0.5" />
            </button>
            
          </form>
          <div className="text-center mt-2 text-xs text-slate-400 dark:text-gray-500">
            CareerPilot AI can make mistakes. Verify important information.
          </div>
        </div>
      </div>

    </div>
  );
}
