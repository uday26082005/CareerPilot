import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { 
  BarChart3, TrendingUp, Target, Code, Loader2, AlertCircle 
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AnalyticsDashboard() {
  const { session } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.access_token) return;
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_BASE_URL}/analytics/dashboard`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [session]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 text-[#ffd159] animate-spin mb-4" />
        <p className="text-slate-400">Loading your statistical dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-rose-400">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { stats, trends } = data;

  // KPIs
  const kpis = [
    { label: "Total Interviews", value: stats.total_interviews || 0, icon: BarChart3, badge: "bg-[#ffd159]/10 text-[#ffd159]" },
    { label: "Practice Sessions", value: stats.total_practice || 0, icon: Target, badge: "bg-[#4ee4cb]/10 text-[#4ee4cb]" },
    { label: "Skills Mastered", value: stats.total_tasks || 0, icon: Code, badge: "bg-[#e29aff]/10 text-[#e29aff]" },
    { label: "Avg Interview Score", value: `${stats.lifetime_avg_interview || 0}%`, icon: TrendingUp, badge: "bg-[#ffb48a]/10 text-[#ffb48a]" }
  ];

  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Performance Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Track your growth across mock interviews, practice sessions, and roadmap milestones.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-[#1c1e24] rounded-3xl p-5 border border-white/[0.08] shadow-xl shadow-black/25 flex items-center gap-4">
            <div className={`p-3.5 rounded-2xl ${kpi.badge}`}>
              <kpi.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{kpi.label}</p>
              <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Cumulative Mastered Skills */}
        <div className="bg-[#1c1e24] rounded-3xl border border-white/[0.08] p-6 shadow-xl shadow-black/25">
          <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-6">Cumulative Skills Mastered</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ee4cb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4ee4cb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date_label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} tickFormatter={(value) => `${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.06} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1e24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#4ee4cb' }}
                />
                <Area type="monotone" dataKey="cumulative_tasks" name="Total Roadmap Tasks" stroke="#4ee4cb" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Moving Average of Interview & Practice */}
        <div className="bg-[#1c1e24] rounded-3xl border border-white/[0.08] p-6 shadow-xl shadow-black/25">
          <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-6">Performance Trends (7-Day Avg)</h3>
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
                    <stop offset="5%" stopColor="#ffd159" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffd159" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPractice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ee4cb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4ee4cb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date_label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" opacity={0.06} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1e24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}
                  formatter={(value) => [`${value}%`]}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', color: '#94a3b8' }} />
                <Area type="monotone" dataKey="moving_avg_interview" name="Mock Interviews" stroke="#ffd159" strokeWidth={2} fillOpacity={1} fill="url(#colorInterview)" />
                <Area type="monotone" dataKey="moving_avg_practice" name="Practice Accuracy" stroke="#4ee4cb" strokeWidth={2} fillOpacity={1} fill="url(#colorPractice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
