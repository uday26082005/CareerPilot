import { FileText, BarChart2, PieChart, Map, Mic, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import StatCard from "../components/dashboard/StatCard";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";
import RoadmapWidget from "../components/dashboard/RoadmapWidget";
import AIRecommendations from "../components/dashboard/AIRecommendations";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from "recharts";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Dashboard() {
  const { session } = useAuth();
  const { isDark } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    if (!session?.access_token) return;
    try {
      const [dashRes, analyticsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/dashboard`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }),
        axios.get(`${API_BASE_URL}/analytics/dashboard`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        }).catch((err) => {
          console.warn("Analytics fetch failed:", err);
          return null;
        })
      ]);
      
      const data = dashRes.data?.data || dashRes.data;
      const targetRole = data?.profile?.target_role || data?.profile?.targetRole || session?.user?.user_metadata?.target_role;
      if (!data?.profile || !targetRole) {
        console.log("Incomplete profile found, redirecting to onboarding...");
        navigate("/onboarding");
        return;
      }

      if (data.profile && !data.profile.target_role && targetRole) {
        data.profile.target_role = targetRole;
      }
      
      setDashboardData(data);
      if (analyticsRes?.data?.data?.trends) {
        setTrends(analyticsRes.data.data.trends);
      }
    } catch (err) {
      console.error("Error fetching dashboard data", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [session, navigate]);

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center text-slate-500">Loading your AI Dashboard...</div>;
  }

  if (error) {
    return <div className="flex h-[60vh] items-center justify-center text-red-500">{error}</div>;
  }

  const userTargetRole = dashboardData?.profile?.target_role || dashboardData?.profile?.targetRole || session?.user?.user_metadata?.target_role;
  if (!dashboardData || !userTargetRole) {
    return <Navigate to="/onboarding" replace />;
  }

  const { profile, resume, skill_gap, roadmap, interviews, practice, upcoming_tasks } = dashboardData;

  const getExperienceLabel = (years) => {
    const y = Number(years) || 0;
    if (y <= 2) return "Beginner";
    if (y <= 5) return "Intermediate";
    return "Expert";
  };

  const generateSummary = (tip) => {
    let summary = tip.split(",")[0];
    summary = summary.split(" to ")[0];
    summary = summary.replace(/such as.*/, "").trim();
    return summary;
  };

  const dynamicRecommendations = (resume?.improvement_tips || []).map((tip) => {
    // tip is an object: { title: "...", description: "..." }
    const titleText = tip.title || tip;
    const summary = generateSummary(titleText);
    const formattedSummary = summary.charAt(0).toLowerCase() + summary.slice(1);
    
    return {
      title: titleText,
      question: `How can I ${formattedSummary}?`,
      desc: tip.description || "",
      type: "resume"
    };
  });


  // Map Upcoming Tasks to UpcomingEvents component visually
  let dynamicUpcoming = [...(upcoming_tasks || [])];
  
  if (dynamicUpcoming.length === 0) {
    const today = new Date();
    dynamicUpcoming.push({ 
      title: "Start your journey", 
      subtitle: profile?.target_role || "Target Role", 
      date: today.toISOString(), 
      type: "assessment" 
    });
  }

  // Generate dynamic roadmap from backend summary
  const dynamicRoadmap = [
    { title: "Profile Creation", status: profile?.target_role ? "completed" : "pending" },
    { title: "AI Resume Analysis", status: (resume?.overall_score > 0 || resume?.strong_skills?.length > 0) ? "completed" : "pending" },
    { title: "Skill Gap Check", status: (skill_gap?.skill_match > 0 || skill_gap?.missing_skills > 0) ? "completed" : "pending" },
    { title: "Mock Interviews", status: interviews?.taken > 0 ? "completed" : "pending" },
    { title: "Practice Arena", status: practice?.sessions > 0 ? "completed" : "pending" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-6">
      

      {/* Stats Row 1: Profile & Resume */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Resume Score"
          value={resume?.overall_score || "N/A"}
          subtitle={`ATS: ${resume?.ats_score || "N/A"}/100`}
          subtitleColor={resume?.overall_score > 80 ? "text-emerald-400" : "text-yellow-400"}
          icon={FileText}
          iconBgColor="bg-[#4ee4cb]/10"
          iconColor="text-[#4ee4cb]"
          chartData={[]}
          chartColor="#4ee4cb"
          themeVariant="mint"
        />
        <StatCard 
          title="Skill Match"
          value={`${skill_gap?.skill_match || 0}%`}
          subtitle={`${skill_gap?.missing_skills || 0} Missing Skills`}
          subtitleColor="text-blue-400"
          icon={BarChart2}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-400"
          chartData={[]}
          chartColor="#3b82f6"
          themeVariant="yellow"
        />
        <StatCard 
          title="Target Role"
          value={profile?.target_role || "Not Set"}
          valueClassName="capitalize"
          subtitle={`${getExperienceLabel(profile?.years_experience)} Level`}
          subtitleColor="text-fuchsia-400"
          icon={PieChart}
          iconBgColor="bg-[#e29aff]/10"
          iconColor="text-[#e29aff]"
          chartData={[]}
          chartColor="#e29aff"
          themeVariant="lavender"
          allowWrap={true}
        />
      </div>

      {/* Stats Row 2: Roadmap, Interviews, Practice */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Roadmap Progress"
          value={`${roadmap?.completion || 0}%`}
          subtitle={`${roadmap?.completed_tasks}/${roadmap?.completed_tasks + roadmap?.pending_tasks} Tasks Completed`}
          subtitleColor="text-emerald-400"
          icon={Map}
          iconBgColor="bg-emerald-500/15 border border-emerald-500/30"
          iconColor="text-emerald-400"
          chartData={[]}
          chartColor="#10b981"
          themeVariant="pink"
        />
        <StatCard 
          title="Interviews"
          value={interviews?.taken || 0}
          subtitle={`Avg Score: ${interviews?.average_score || 0} | Best: ${interviews?.best_score || 0}`}
          subtitleColor="text-amber-400"
          icon={Mic}
          iconBgColor="bg-amber-500/15 border border-amber-500/30"
          iconColor="text-amber-400"
          chartData={[]}
          chartColor="#f59e0b"
          themeVariant="peach"
        />
        <StatCard 
          title="Practice Arena"
          value={practice?.sessions || 0}
          subtitle={`Accuracy: ${practice?.accuracy || 0}% · Best: ${practice?.best_category || "General"}`}
          subtitleColor="text-cyan-400"
          icon={Target}
          iconBgColor="bg-[#72c5ff]/10"
          iconColor="text-[#72c5ff]"
          chartData={[]}
          chartColor="#72c5ff"
          themeVariant="sky"
        />
      </div>

      {/* Events Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <UpcomingEvents events={dynamicUpcoming} onEventCreated={fetchDashboardData} />
        </div>
      </div>

      {/* Roadmap & Recommendations Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RoadmapWidget steps={dynamicRoadmap} />
        </div>
        <div className="lg:col-span-1">
          {dynamicRecommendations.length > 0 ? (
            <AIRecommendations recommendations={dynamicRecommendations} />
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 h-full flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm dark:shadow-xl dark:shadow-black/25">
              No AI recommendations available.
            </div>
          )}
        </div>
      </div>

      {/* Performance & Growth Analytics Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cumulative Mastered Skills */}
        <div className="bg-white dark:bg-[#1c1e24] rounded-3xl border border-slate-200 dark:border-white/[0.08] p-6 shadow-sm dark:shadow-xl dark:shadow-black/25">
          <h3 className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-6">Cumulative Skills Mastered</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date_label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} tickFormatter={(value) => `${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#ffffff" : "#000000"} opacity={isDark ? 0.06 : 0.06} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1c1e24' : '#ffffff', 
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', 
                    borderRadius: '16px', 
                    color: isDark ? '#fff' : '#0f172a', 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' 
                  }}
                  itemStyle={{ color: isDark ? '#4ee4cb' : '#0d9488' }}
                />
                <Area type="monotone" dataKey="cumulative_tasks" name="Total Roadmap Tasks" stroke={isDark ? "#4ee4cb" : "#0d9488"} strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Moving Average of Interview & Practice */}
        <div className="bg-white dark:bg-[#1c1e24] rounded-3xl border border-slate-200 dark:border-white/[0.08] p-6 shadow-sm dark:shadow-xl dark:shadow-black/25">
          <h3 className="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-6">Performance Trends (7-Day Avg)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={(trends || []).map(t => ({
                  ...t,
                  moving_avg_interview: t.moving_avg_interview ?? 0,
                  moving_avg_practice: t.moving_avg_practice ?? 0,
                }))} 
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorInterview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? "#ffd159" : "#f59e0b"} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={isDark ? "#ffd159" : "#f59e0b"} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPractice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? "#4ee4cb" : "#0d9488"} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={isDark ? "#4ee4cb" : "#0d9488"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date_label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#ffffff" : "#000000"} opacity={isDark ? 0.06 : 0.06} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1c1e24' : '#ffffff', 
                    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', 
                    borderRadius: '16px', 
                    color: isDark ? '#fff' : '#0f172a', 
                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)' 
                  }}
                  formatter={(value) => [`${value}%`]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', color: isDark ? '#94a3b8' : '#64748b' }} />
                <Area type="monotone" dataKey="moving_avg_interview" name="Mock Interviews" stroke={isDark ? "#ffd159" : "#d97706"} strokeWidth={2} fillOpacity={1} fill="url(#colorInterview)" />
                <Area type="monotone" dataKey="moving_avg_practice" name="Practice Accuracy" stroke={isDark ? "#4ee4cb" : "#0d9488"} strokeWidth={2} fillOpacity={1} fill="url(#colorPractice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
