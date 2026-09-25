import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { 
  BarChart3, TrendingUp, Target, Code, Loader2, AlertCircle 
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
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
        <Loader2 className="h-10 w-10 text-violet-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-gray-400">Loading your statistical dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { stats, trends } = data;

  // KPIs
  const kpis = [
    { label: "Total Interviews", value: stats.total_interviews || 0, icon: BarChart3, color: "text-blue-500" },
    { label: "Practice Sessions", value: stats.total_practice || 0, icon: Target, color: "text-emerald-500" },
    { label: "Skills Mastered", value: stats.total_tasks || 0, icon: Code, color: "text-violet-500" },
    { label: "Avg Interview Score", value: `${stats.lifetime_avg_interview || 0}%`, icon: TrendingUp, color: "text-orange-500" }
  ];

  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          Performance Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Track your growth across mock interviews, practice sessions, and roadmap milestones.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-white/5 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50 ${kpi.color}`}>
              <kpi.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Cumulative Mastered Skills */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-white/5 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Cumulative Skills Mastered</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date_label" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#c4b5fd' }}
                />
                <Area type="monotone" dataKey="cumulative_tasks" name="Total Roadmap Tasks" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Moving Average of Interview & Practice */}
        <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-white/5 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Performance Trends (7-Day Avg)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="date_label" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="moving_avg_interview" name="Mock Interviews" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="avg_practice_accuracy" name="Practice Accuracy" stroke="#10b981" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
