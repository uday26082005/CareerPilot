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
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q) {
      setQuestion(q);
      // Wait a tick for state to settle then send
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
    <div className="flex flex-col flex-1 max-w-5xl w-full mx-auto gap-4">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AskAI</h1>
        <p className="text-slate-500 dark:text-gray-400">Your personalized AI career coach</p>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col flex-1 overflow-hidden min-h-[400px]">
        
        {/* Messages Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative"
        >
          
          {messages.length === 1 && (
            <div className="flex flex-col items-center justify-center h-full text-center mt-8 mb-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                How can I help you accelerate your career today?
              </h2>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl">
                {suggestions.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(item.text)}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-4 text-center transition-all hover:bg-violet-50 dark:hover:bg-white/[0.05] hover:border-violet-200 dark:hover:border-white/10 shadow-sm group"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color} transition-transform group-hover:scale-110`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <span className="text-[12px] font-medium text-slate-700 dark:text-gray-300 group-hover:text-violet-600 dark:group-hover:text-violet-300 leading-tight">{item.text}</span>
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
                <div className={`flex max-w-[85%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1 ${msg.role === "user" ? "bg-violet-600 text-white" : "bg-gradient-to-br from-violet-600 to-purple-800 text-white shadow-lg"}`}>
                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-2xl px-5 py-4 ${msg.role === "user" ? "bg-violet-600 text-white shadow-md rounded-tr-sm" : "bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-gray-200 shadow-sm rounded-tl-sm"}`}>
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1 bg-gradient-to-br from-violet-600 to-purple-800 text-white shadow-lg">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl px-5 py-4 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 shadow-sm rounded-tl-sm flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-violet-500 animate-spin" />
                    <span className="text-sm text-slate-500 dark:text-gray-400">CareerPilot AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>

        {/* Bottom Input Area */}
        <div className="shrink-0 p-4">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="relative flex items-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0c1a] px-3 py-2 shadow-sm focus-within:border-violet-500 focus-within:ring-1 focus-within:ring-violet-500 transition-all"
          >
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-600 dark:hover:text-white shrink-0 transition-colors"
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
              className="flex-1 bg-transparent px-3 py-2 text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 dark:text-gray-500 focus:outline-none"
              disabled={isLoading}
            />
            
            <button 
              type="submit"
              disabled={!question.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md transition-colors hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="h-4 w-4 -ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
