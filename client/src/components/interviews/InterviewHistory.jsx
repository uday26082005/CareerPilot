import React, { useState, useEffect } from "react";
import { Code, Briefcase, Building, Target, Star, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getIcon = (type) => {
  if (type === "Behavioral Interview") return { icon: Briefcase, bg: "bg-blue-500/10 text-blue-400", color: "text-blue-400" };
  if (type === "Role-specific Interview") return { icon: Target, bg: "bg-emerald-500/10 text-emerald-400", color: "text-emerald-400" };
  if (type === "Company-specific") return { icon: Building, bg: "bg-orange-500/10 text-orange-400", color: "text-orange-400" };
  return { icon: Code, bg: "bg-violet-500/10 text-violet-400", color: "text-violet-400" }; // Default Technical
};

export default function InterviewHistory({ refreshKey, onRowClick, onHistoryFetched }) {
  const { session } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/interviews/history`, {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
        const fetchedHistory = res.data?.data || [];
        setHistory(fetchedHistory);
        if (onHistoryFetched) onHistoryFetched(fetchedHistory);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [refreshKey]);

  const displayedHistory = isExpanded ? history : history.slice(0, 3);

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`h-3 w-3 ${star <= rating ? "fill-yellow-500 text-yellow-500" : star - 0.5 === rating ? "fill-yellow-500/50 text-yellow-500" : "fill-white/10 text-transparent"}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-5 backdrop-blur-md">
      <h3 className="mb-4 text-base font-semibold text-slate-500 dark:text-gray-400">Your Interview History</h3>
      
      {/* Table Header */}
      <div className="mb-3 grid grid-cols-12 gap-4 border-b border-slate-200 dark:border-white/5 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-gray-500">
        <div className="col-span-7">Role</div>
        <div className="col-span-3">Date</div>
        <div className="col-span-2">Score</div>
      </div>

      {/* Table Rows */}
      {loading ? (
        <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-violet-500" /></div>
      ) : displayedHistory.length === 0 ? (
        <div className="text-center p-4 text-slate-500 dark:text-gray-400">No interviews taken yet.</div>
      ) : (
        <div className="flex flex-col gap-2">
          {displayedHistory.map((row) => {
            const dateObj = new Date(row.created_at);
            const { icon: IconComp, bg } = getIcon(row.interview_type);
            return (
              <div 
                key={row.id} 
                onClick={() => {
                  if (onRowClick) {
                    if (row.status === 'In Progress') {
                      if (window.confirm("Do you want to resume this interview?")) {
                        onRowClick(row.id);
                      }
                    } else if (row.status === 'Completed') {
                      onRowClick(row.id);
                    }
                  }
                }}
                className="group grid grid-cols-12 items-center gap-4 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02] rounded-xl -mx-2 px-2 py-1.5"
              >
                
                {/* Role & Icon */}
                <div className="col-span-7 flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${bg}`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-300 transition-colors truncate">{row.target_role}</h4>
                    <p className="text-sm text-slate-500 dark:text-gray-400 truncate">{row.interview_type}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="col-span-3">
                  <p className="text-sm text-slate-900 dark:text-white">{dateObj.toLocaleDateString()}</p>
                  <p className="text-xs text-slate-400 dark:text-gray-500">{dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>

                {/* Score */}
                <div className="col-span-2">
                  <span className={`text-base font-bold ${row.overall_score >= 80 ? "text-emerald-400" : row.overall_score >= 60 ? "text-yellow-400" : "text-orange-400"}`}>
                    {row.overall_score !== null ? `${row.overall_score}%` : "In Progress"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="h-4 w-4" /></>
          ) : (
            <>View All Interviews <ChevronDown className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </div>
  );
}
