import { useState, useEffect } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import {
  Home, FileText, Mic, BarChart2, Map, PieChart, 
  Bot, LogOut, Settings,
  Maximize, Minimize, Menu, Target, Sun, Moon
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const SIDEBAR_LINKS = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "AI Resume Analysis", path: "/resume-analysis", icon: FileText },
  { name: "Mock Interviews", path: "/mock-interviews", icon: Mic },
  { name: "Skill Gap Analysis", path: "/skill-gap-analysis", icon: BarChart2 },
  { name: "Roadmaps", path: "/roadmaps", icon: Map },
  { name: "Career Insights", path: "/career-insights", icon: PieChart },
  { name: "Practice", path: "/practice", icon: Target },
  { name: "AskAI", path: "/ask-ai", icon: Bot },
];

export default function AppLayout({ children }) {
  const location = useLocation();
  const { session, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isAskAIPage = location.pathname === "/ask-ai" || location.pathname === "/ask-ai/";

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  if (!loading && !session) {
    return <Navigate to="/login" replace />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const userName = session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0] || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const avatarUrl = session?.user?.user_metadata?.avatar_url || "";

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
    <div className="relative flex h-screen w-full bg-[#fafcff] dark:bg-[#121316] text-slate-900 dark:text-white overflow-hidden print:h-auto print:overflow-visible">
      {/* Ambient Background Glows for Glassmorphism effect */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[#ffd159]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#4ee4cb]/5 blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <aside className={`relative z-10 flex h-full flex-col border-r border-slate-200/80 dark:border-white/[0.06] bg-white/95 dark:bg-[#16171c] backdrop-blur-2xl shadow-[1px_0_12px_rgba(15,23,42,0.03)] dark:shadow-none transition-all duration-300 ease-in-out overflow-hidden print:hidden ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex h-full w-64 flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center px-5">
            <Link to="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105" title={!isSidebarOpen ? "CareerPilot AI" : ""}>
              <img src="/logo.png" alt="CareerPilot Logo" className="h-9 w-9 shrink-0 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105" />
              <h1 className={`text-xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                CareerPilot<span className="text-amber-500 dark:text-[#ffd159]"> AI</span>
              </h1>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4">
            {SIDEBAR_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 hover:translate-x-1 ${
                    isActive 
                      ? "bg-[#FFF7E6] text-[#D97706] font-semibold border border-[#FDE7B0] shadow-xs dark:bg-[#242730] dark:text-[#ffd159] dark:border-[#ffd159]/25" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-white/[0.04] hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title={!isSidebarOpen ? link.name : ""}
                >
                  <link.icon className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-[#D97706] dark:text-[#ffd159]" : ""}`} />
                  <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-200/80 dark:border-white/[0.06]">
            <Link
              to="/login"
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 transition-all duration-200 hover:translate-x-1 hover:bg-rose-50 dark:hover:bg-red-500/10 hover:text-rose-600 dark:hover:text-red-400`}
              title={!isSidebarOpen ? "Logout" : ""}
            >
              <LogOut className="h-5 w-5 shrink-0 text-rose-500 dark:text-red-400 transition-transform duration-300 group-hover:scale-110" />
              <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                Logout
              </span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden print:overflow-visible">
        
        {/* Top Header */}
        {!isAskAIPage && (
          <header className="relative z-50 flex h-20 shrink-0 items-center justify-between border-b border-slate-200/80 dark:border-white/[0.06] bg-white/95 dark:bg-[#121316]/90 px-8 backdrop-blur-md shadow-xs print:hidden">
            
            <div className="flex items-center gap-6">
              {/* Sidebar Toggle */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 hover:text-slate-900 shadow-2xs dark:bg-[#1c1e24] dark:border-white/[0.08] dark:text-slate-300 dark:hover:bg-[#242730] dark:hover:text-white transition-colors"
                title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
              >
                <Menu className="h-5 w-5" />
              </button>
              
              {/* Greetings */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {getGreeting()}, <span className="capitalize">{userName.split(' ')[0]}</span>!
                </h2>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Icon Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={toggleFullscreen} 
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 hover:text-slate-900 shadow-2xs dark:bg-[#1c1e24] dark:border-white/[0.08] dark:text-slate-300 dark:hover:bg-[#242730] dark:hover:text-white transition-colors cursor-pointer"
                  title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                  {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
                <button 
                  onClick={toggleTheme} 
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 hover:text-slate-900 shadow-2xs dark:bg-[#1c1e24] dark:border-white/[0.08] dark:text-slate-300 dark:hover:bg-[#242730] dark:hover:text-white transition-colors cursor-pointer"
                  title={isDark ? "Switch to White Mode" : "Switch to Dark Mode"}
                  aria-label={isDark ? "Switch to White Mode" : "Switch to Dark Mode"}
                >
                  {isDark ? (
                    <Sun className="h-5 w-5 text-[#ffd159] transition-transform duration-200 hover:rotate-45" />
                  ) : (
                    <Moon className="h-5 w-5 text-amber-600 transition-transform duration-200 hover:-rotate-12" />
                  )}
                </button>
                <Link 
                  to="/settings" 
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 hover:text-slate-900 shadow-2xs dark:bg-[#1c1e24] dark:border-white/[0.08] dark:text-slate-300 dark:hover:bg-[#242730] dark:hover:text-white transition-colors cursor-pointer"
                  title="Settings"
                  aria-label="Settings"
                >
                  <Settings className="h-5 w-5" />
                </Link>
              </div>

              {/* Profile Dropdown */}
              <div className="mx-2 h-8 w-px bg-slate-200/80 dark:bg-white/[0.08]" />
              <Link to="/profile" className="flex items-center gap-3 rounded-full border border-slate-200/80 dark:border-white/[0.08] bg-slate-50 hover:bg-slate-100 dark:bg-[#1c1e24] p-1.5 pr-4 shadow-2xs transition-colors dark:hover:bg-[#242730]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-8 w-8 rounded-full object-cover border border-[#ffd159]/30" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd159] to-[#f5b82e] text-sm font-bold text-slate-950 uppercase">
                    {userInitial}
                  </div>
                )}
                <span className="text-sm font-medium text-slate-900 dark:text-white capitalize">{userName}</span>
              </Link>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className={`flex-1 flex flex-col print:overflow-visible print:p-0 ${
          isAskAIPage 
            ? "overflow-hidden p-6 sm:px-8 sm:py-6" 
            : "overflow-y-auto p-8"
        }`}>
          {children}
        </main>
        
      </div>
    </div>
  );
}
