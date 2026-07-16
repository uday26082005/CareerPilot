import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { 
  Bot, Home, FileText, Mic, BarChart2, Map, PieChart, 
  Trophy, Sparkles, LogOut, Bell, Settings, Moon, Sun, 
  Maximize, Minimize, Plus, ArrowRight
} from "lucide-react";

const SIDEBAR_LINKS = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "AI Resume Analysis", path: "/resume-analysis", icon: FileText },
  { name: "Mock Interviews", path: "/mock-interviews", icon: Mic },
  { name: "Skill Gap Analysis", path: "/skill-gap-analysis", icon: BarChart2 },
  { name: "Roadmaps", path: "/roadmaps", icon: Map },
  { name: "Career Insights", path: "/career-insights", icon: PieChart },
  { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
  { name: "AskAI", path: "/ask-ai", icon: Sparkles },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function AppLayout({ children }) {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className="relative flex h-screen w-full bg-slate-50 dark:bg-[#060816] text-slate-900 dark:text-white overflow-hidden">
      {/* Ambient Background Glows for Glassmorphism effect */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-violet-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="relative z-10 flex h-full w-64 flex-col border-r border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] transition-all duration-500">
        {/* Logo */}
        <div className="flex h-20 items-center px-6">
          <Link to="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 shadow-[0_0_20px_rgba(139,92,246,.3)] group-hover:shadow-[0_0_25px_rgba(139,92,246,.5)] transition-shadow duration-300">
              <Bot className="h-5 w-5 text-slate-900 dark:text-white transition-transform duration-500 group-hover:rotate-12" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-violet-100">
              CareerPilot<span className="text-violet-400"> AI</span>
            </h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 hover:translate-x-1 ${
                  isActive 
                    ? "bg-violet-100 text-violet-600 dark:bg-violet-600/20 dark:text-violet-300 shadow-none dark:shadow-[0_0_15px_rgba(139,92,246,0.15)] border border-violet-200 dark:border-transparent" 
                    : "text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <link.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-violet-500 dark:text-violet-400" : ""}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Promo Box */}
        <div className="mx-4 mb-4 mt-2 rounded-xl border border-violet-200 dark:border-violet-500/20 bg-[#f5f3ff] dark:bg-violet-500/5 p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-100 dark:hover:bg-violet-500/10 hover:shadow-sm dark:hover:shadow-[0_4px_20px_rgba(139,92,246,0.1)]">
          <div className="mb-2 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-violet-500 dark:text-violet-400" />
            <h3 className="text-[11px] font-bold text-violet-600 dark:text-violet-300">Top Performer</h3>
          </div>
          <p className="mb-3 text-[10px] leading-relaxed text-slate-500 dark:text-gray-400">
            Keep learning and climb the leaderboard!
          </p>
          <Link to="/leaderboard" className="flex items-center gap-1.5 text-[10px] font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300">
            View My Progress <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-white/5">
          <Link
            to="/login"
            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 dark:text-gray-400 transition-all duration-300 hover:translate-x-1 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400"
          >
            <LogOut className="h-5 w-5 text-red-500 dark:text-red-400 transition-transform duration-300 group-hover:scale-110" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="flex h-24 shrink-0 items-center justify-between border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#060816]/80 px-8 backdrop-blur-md">
          
          {/* Greetings */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Good evening, Uday! <span className="text-2xl">👋</span>
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
              Let's make today a step closer to your dream career.
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Icon Buttons */}
            <div className="flex items-center gap-2">
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet-500 text-[9px] font-bold text-slate-900 dark:text-white">3</span>
              </button>
              <Link to="/settings" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white">
                <Settings className="h-5 w-5" />
              </Link>
              <div className="flex items-center rounded-full bg-slate-100 dark:bg-white/5 p-1">
                <button 
                  onClick={toggleTheme}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${isDark ? 'bg-violet-600/30 text-violet-400' : 'text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-white'}`}
                >
                  <Moon className="h-4 w-4" />
                </button>
                <button 
                  onClick={toggleTheme}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${!isDark ? 'bg-violet-600/30 text-violet-400' : 'text-slate-500 hover:text-slate-900 dark:text-gray-500 dark:hover:text-white'}`}
                >
                  <Sun className="h-4 w-4" />
                </button>
              </div>
              <button onClick={toggleFullscreen} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white">
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="mx-2 h-8 w-px bg-slate-200 dark:bg-white/10" />
            <button className="flex items-center gap-3 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-1.5 pr-4 transition-colors hover:bg-slate-200 dark:hover:bg-white/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                U
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white">Uday Kumar</span>
            </button>

            {/* New Goal Button */}
            <button className="ml-2 flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-colors hover:bg-violet-500">
              <Plus className="h-4 w-4" /> New Goal
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
        
      </div>
    </div>
  );
}
