import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Bot, Home, FileText, Mic, BarChart2, Map, PieChart, 
  Trophy, Sparkles, LogOut, Bell, Settings,
  Maximize, Minimize, Plus, ArrowRight, Menu, Target, X
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SIDEBAR_LINKS = [
  { name: "Dashboard", path: "/dashboard", icon: Home },
  { name: "AI Resume Analysis", path: "/resume-analysis", icon: FileText },
  { name: "Mock Interviews", path: "/mock-interviews", icon: Mic },
  { name: "Skill Gap Analysis", path: "/skill-gap-analysis", icon: BarChart2 },
  { name: "Roadmaps", path: "/roadmaps", icon: Map },
  { name: "Career Insights", path: "/career-insights", icon: PieChart },
  { name: "Practice", path: "/practice", icon: Target },
  { name: "AskAI", path: "/ask-ai", icon: Sparkles },
];

export default function AppLayout({ children }) {
  const location = useLocation();
  const { session } = useAuth();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (session?.access_token) {
      fetch(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // ensure unread logic works on frontend by mapping is_read to !unread
          const mapped = data.data.map(n => ({ ...n, unread: !n.is_read }));
          setNotifications(mapped);
        }
      })
      .catch(err => console.error("Failed to fetch notifications", err));
    }
  }, [session?.access_token]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${session.access_token}` }
    }).then(() => {
      setNotifications(notifications.map(n => ({ ...n, unread: false })));
    });
  };

  const removeNotification = (id) => {
    fetch(`${API_BASE_URL}/notifications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` }
    }).then(() => {
      setNotifications(notifications.filter(n => n.id !== id));
    });
  };

  const markAsRead = (id) => {
    fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${session.access_token}` }
    }).then(() => {
      setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    });
  };

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
    <div className="relative flex h-screen w-full bg-slate-50 dark:bg-[#060816] text-slate-900 dark:text-white overflow-hidden print:h-auto print:overflow-visible">
      {/* Ambient Background Glows for Glassmorphism effect */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-violet-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <aside className={`relative z-10 flex h-full flex-col border-r border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.03] backdrop-blur-2xl shadow-xl dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] transition-all duration-300 ease-in-out overflow-hidden print:hidden ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex h-full w-64 flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center px-5">
            <Link to="/" className="group flex items-center gap-3 transition-transform duration-300 hover:scale-105" title={!isSidebarOpen ? "CareerPilot AI" : ""}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] backdrop-blur-xl border border-white/10 shadow-[0_4px_20px_rgba(139,92,246,0.2)] transition-transform duration-500 group-hover:rotate-12">
                <img src="/logo.jpg" alt="CareerPilot Logo" className="h-8 w-8 rounded-lg mix-blend-lighten" />
              </div>
              <h1 className={`text-xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-opacity duration-300 group-hover:text-violet-100 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
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
                  title={!isSidebarOpen ? link.name : ""}
                >
                  <link.icon className={`h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-violet-500 dark:text-violet-400" : ""}`} />
                  <span className={`whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-200 dark:border-white/5">
            <Link
              to="/login"
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 dark:text-gray-400 transition-all duration-300 hover:translate-x-1 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 dark:hover:text-red-400`}
              title={!isSidebarOpen ? "Logout" : ""}
            >
              <LogOut className="h-5 w-5 shrink-0 text-red-500 dark:text-red-400 transition-transform duration-300 group-hover:scale-110" />
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
        <header className="relative z-50 flex h-24 shrink-0 items-center justify-between border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#060816]/80 px-8 backdrop-blur-md print:hidden">
          
          <div className="flex items-center gap-6">
            {/* Sidebar Toggle */}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white"
              title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Greetings */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Good evening, Uday!
              </h2>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Icon Buttons */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-2 top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-violet-500 text-[9px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 top-full mt-3 w-80 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-[#0a0c1a]/90 p-4 shadow-xl backdrop-blur-xl dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-50">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:underline"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <p className="text-sm text-center text-slate-500 dark:text-gray-400 py-4">No notifications</p>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className="group flex gap-3 rounded-xl bg-slate-50 dark:bg-white/5 p-3 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 relative pr-8 cursor-pointer"
                            onClick={() => notification.unread && markAsRead(notification.id)}
                          >
                            <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.unread ? 'bg-violet-500' : 'bg-transparent border border-slate-300 dark:border-gray-600'}`}></div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{notification.title}</p>
                              <p className="text-xs text-slate-500 dark:text-gray-400">{notification.message}</p>
                              <p className="mt-1 text-[10px] text-slate-400 dark:text-gray-500">{new Date(notification.created_at).toLocaleDateString()}</p>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeNotification(notification.id); }}
                              className="absolute right-2 top-2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-slate-200 dark:hover:bg-white/10"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <button onClick={toggleFullscreen} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white">
                {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </button>
              <Link to="/settings" className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white">
                <Settings className="h-5 w-5" />
              </Link>
            </div>

            {/* Profile Dropdown */}
            <div className="mx-2 h-8 w-px bg-slate-200 dark:bg-white/10" />
            <Link to="/profile" className="flex items-center gap-3 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-1.5 pr-4 transition-colors hover:bg-slate-200 dark:hover:bg-white/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                U
              </div>
              <span className="text-sm font-medium text-slate-900 dark:text-white">Uday Kumar</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 print:overflow-visible print:p-0">
          {children}
        </main>
        
      </div>
    </div>
  );
}
