import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Send, FileText, BookOpen, Target, Briefcase, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import ReactMarkdown from 'react-markdown';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AskAI() {
  const currentYear = new Date().getFullYear();
  const suggestions = [
    { text: "How can I improve my resume?", icon: FileText, color: "text-[#e29aff] bg-[#e29aff]/10 border border-[#e29aff]/20" },
    { text: `What skills are in demand in ${currentYear}?`, icon: BookOpen, color: "text-[#4ee4cb] bg-[#4ee4cb]/10 border border-[#4ee4cb]/20" },
    { text: "How to prepare for system design?", icon: Target, color: "text-[#72c5ff] bg-[#72c5ff]/10 border border-[#72c5ff]/20" },
    { text: "Suggest a learning roadmap for me", icon: Briefcase, color: "text-[#ffd159] bg-[#ffd159]/10 border border-[#ffd159]/20" },
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

  return (
    <div className="flex flex-col flex-1 max-w-5xl w-full mx-auto gap-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AskAI</h1>
        <p className="mt-1 text-sm text-slate-400">Your personalized AI career coach</p>
      </div>

      {/* Chat Container */}
      <div className="flex flex-col flex-1 overflow-hidden min-h-[520px]">
        
        {/* Messages Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto py-4 space-y-6 relative"
        >
          
          {messages.length === 1 && (
            <div className="flex flex-col items-center justify-center h-full text-center mt-6 mb-10 px-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffd159]/10 text-[#ffd159] border border-[#ffd159]/20 mb-5 shadow-lg shadow-amber-500/5">
                <Bot className="h-7 w-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                How can I help you accelerate your career today?
              </h2>
              <p className="text-sm text-slate-400 mb-8 max-w-md">
                Ask anything about interview prep, technical roadmaps, resume improvement, or current market demands.
              </p>

              {/* Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-4xl">
                {suggestions.map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(item.text)}
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-[#1c1e24] p-5 text-center transition-all hover:bg-[#20222a] hover:border-white/20 hover:-translate-y-0.5 shadow-md shadow-black/20 group"
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.color} transition-transform group-hover:scale-110 shadow-sm`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white leading-relaxed">{item.text}</span>
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
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-1 ${msg.role === "user" ? "bg-gradient-to-r from-[#ffd159] to-[#fed656] text-slate-950 font-bold shadow-md shadow-amber-500/10" : "bg-[#ffd159]/10 text-[#ffd159] border border-[#ffd159]/20"}`}>
                    {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-2xl px-5 py-4 ${msg.role === "user" ? "bg-gradient-to-r from-[#ffd159] to-[#fed656] text-slate-950 font-medium shadow-md shadow-amber-500/10 rounded-tr-sm" : "bg-[#1c1e24] border border-white/[0.08] text-slate-200 shadow-md rounded-tl-sm"}`}>
                    {msg.role === "user" ? (
                      <p className="text-[15px] whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="prose prose-sm prose-invert max-w-none text-[15px] leading-relaxed text-slate-200 prose-headings:text-white prose-strong:text-white prose-a:text-[#ffd159] hover:prose-a:underline prose-code:text-[#4ee4cb] prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-pre:bg-[#121316] prose-pre:border prose-pre:border-white/[0.08]">
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
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl mt-1 bg-[#ffd159]/10 text-[#ffd159] border border-[#ffd159]/20">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="rounded-2xl px-5 py-4 bg-[#1c1e24] border border-white/[0.08] shadow-md rounded-tl-sm flex items-center gap-3">
                    <Loader2 className="h-4 w-4 text-[#ffd159] animate-spin" />
                    <span className="text-sm text-slate-400">CareerPilot AI is thinking...</span>
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
            className="relative flex items-center rounded-2xl border border-white/[0.08] bg-[#1c1e24] px-4 py-2.5 shadow-lg shadow-black/20 focus-within:border-[#ffd159]/50 focus-within:ring-1 focus-within:ring-[#ffd159]/50 transition-all"
          >
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-white/5 hover:text-white shrink-0 transition-colors"
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
              className="flex-1 bg-transparent px-3 py-2 text-[15px] text-white placeholder:text-slate-500 focus:outline-none"
              disabled={isLoading}
            />
            
            <button 
              type="submit"
              disabled={!question.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] text-slate-950 font-bold shadow-md shadow-amber-500/10 transition-all hover:brightness-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-[#2e323e] disabled:text-slate-500 shrink-0"
            >
              <Send className="h-4 w-4 -ml-0.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
