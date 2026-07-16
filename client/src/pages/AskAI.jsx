import { Bot, Paperclip, Send, FileText, BookOpen, Target, Briefcase } from "lucide-react";

export default function AskAI() {
  const suggestions = [
    { text: "How can I improve my resume?", icon: FileText, color: "text-violet-400 bg-violet-500/10" },
    { text: "What skills are in demand in 2024?", icon: BookOpen, color: "text-emerald-400 bg-emerald-500/10" },
    { text: "How to prepare for system design?", icon: Target, color: "text-blue-400 bg-blue-500/10" },
    { text: "Suggest a learning roadmap for me", icon: Briefcase, color: "text-orange-400 bg-orange-500/10" },
  ];

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-8rem)]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AskAI</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Your AI career assistant. Ask anything about your career, skills, interview prep and more.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center mt-10">
        
        {/* Avatar & Greeting */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-800 shadow-[0_0_40px_rgba(139,92,246,0.4)] border border-violet-400/30">
            <Bot className="h-12 w-12 text-slate-900 dark:text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Hi, Uday! 👋</h2>
          <p className="text-lg text-slate-500 dark:text-gray-400">How can I help you today?</p>
        </div>

        {/* Suggestion Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          {suggestions.map((item, idx) => (
            <button 
              key={idx}
              className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 text-left transition-all hover:bg-white/[0.05] hover:border-slate-200 dark:border-white/10 hover:-translate-y-1"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-medium text-slate-600 dark:text-gray-300 leading-snug">{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Input Area */}
      <div className="mt-auto pt-10">
        <div className="mx-auto w-full max-w-4xl">
          <div className="relative flex items-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0c1a] px-4 py-3 shadow-lg focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/50 transition-all">
            
            <button className="flex h-10 w-10 items-center justify-center text-slate-500 dark:text-gray-400 transition-colors hover:text-slate-900 dark:text-white shrink-0">
              <Paperclip className="h-5 w-5" />
            </button>
            
            <input 
              type="text" 
              placeholder="Type your question here..." 
              className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:text-gray-500 focus:outline-none"
            />
            
            <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-slate-900 dark:text-white shadow-lg transition-colors hover:bg-violet-500 shrink-0">
              <Send className="h-4 w-4 -ml-0.5" />
            </button>
            
          </div>
          
          <p className="mt-4 text-center text-[10px] text-slate-400 dark:text-gray-500">
            AskAI can make mistakes. Please verify important information.
          </p>
        </div>
      </div>

    </div>
  );
}
