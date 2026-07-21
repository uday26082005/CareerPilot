import { Users, Target, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
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
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-4 text-base font-semibold text-slate-500 dark:text-gray-400">Your Interview Progress</h3>
      
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 flex-1">
          {/* Card 1 */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-4 transition-colors hover:bg-white/[0.04]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">Interviews Taken</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.total_interviews || 0}</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-4 transition-colors hover:bg-white/[0.04]">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">Avg. Score</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.average_score || 0}%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
