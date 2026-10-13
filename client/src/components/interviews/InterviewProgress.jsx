import { Users, Target, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function InterviewProgress({ refreshKey }) {
  const { session } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/interviews/statistics`, {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        setStats(res.data?.data || {});
      } catch (err) {
        console.error("Failed to fetch statistics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [refreshKey]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] p-6 shadow-sm dark:shadow-xl dark:shadow-black/25">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Your Interview Progress</h3>
      
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500 dark:text-[#ffd159]" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 flex-1">
          {/* Card 1 */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#242730] p-4 transition-all hover:bg-slate-100 dark:hover:bg-[#2b2f3a] hover:border-slate-300 dark:hover:border-white/10 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-500/15 dark:border-amber-500/30 dark:text-[#ffd159]">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Interviews Taken</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats?.total_interviews || 0}</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#242730] p-4 transition-all hover:bg-slate-100 dark:hover:bg-[#2b2f3a] hover:border-slate-300 dark:hover:border-white/10 shadow-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 border border-teal-200 text-teal-700 dark:bg-teal-500/15 dark:border-teal-500/30 dark:text-[#4ee4cb]">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Avg. Score</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{stats?.average_score || 0}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
