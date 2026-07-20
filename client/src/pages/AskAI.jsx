import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BrainCircuit, Plus, Send, FileText, BookOpen, Target, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function AskAI() {
  const suggestions = [
    { text: "How can I improve my resume?", icon: FileText, color: "text-violet-400 bg-violet-500/10" },
    { text: "What skills are in demand in 2024?", icon: BookOpen, color: "text-emerald-400 bg-emerald-500/10" },
    { text: "How to prepare for system design?", icon: Target, color: "text-blue-400 bg-blue-500/10" },
    { text: "Suggest a learning roadmap for me", icon: Briefcase, color: "text-orange-400 bg-orange-500/10" },
  ];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || "";

  const [question, setQuestion] = useState(initialQuery);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q');
    if (q) {
      setQuestion(q);
    }
  }, [location.search]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file.name);
      // You can add further file handling logic here
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full min-h-[calc(100vh-12rem)] pb-8">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
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

      {/* Header */}
      <div className="hidden relative z-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AskAI</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center w-full relative z-10">
        
        {/* Avatar & Greeting */}
        <div className="flex flex-col items-center mb-6">
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
            Hi, Uday!
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base text-slate-500 dark:text-gray-400"
          >
            How can I help you today?
          </motion.p>
        </div>

        {/* Suggestion Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl"
        >
          {suggestions.map((item, idx) => (
            <button 
              key={idx}
              onClick={() => setQuestion(item.text)}
              className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 text-left transition-all hover:bg-white/[0.05] hover:border-slate-200 dark:border-white/10 hover:-translate-y-1"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color} transition-transform group-hover:scale-110`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-600 dark:text-gray-300 leading-snug">{item.text}</span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* Bottom Input Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-40 w-full relative z-10"
      >
        <div className="mx-auto w-full max-w-4xl">
          <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0c1a] px-4 py-3 shadow-lg focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/50 transition-all">
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 dark:text-gray-400 transition-all hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hover:scale-110 active:scale-95 shrink-0"
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
              placeholder="Type your question here..." 
              className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:text-gray-500 focus:outline-none"
            />
            
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-slate-900 dark:text-white shadow-lg transition-colors hover:bg-violet-500 shrink-0">
              <Send className="h-4 w-4 -ml-0.5" />
            </button>
            
          </div>
        </div>
      </motion.div>

    </div>
  );
}
