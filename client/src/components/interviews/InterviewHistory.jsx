import { useState, useEffect } from "react";
import { Code, Briefcase, Building, Target, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getIcon = (type) => {
  if (type === "Behavioral Interview") return { icon: Briefcase, bg: "bg-[#ffd159]/10 text-[#ffd159]", color: "text-[#ffd159]" };
  if (type === "Role-specific Interview") return { icon: Target, bg: "bg-[#e29aff]/10 text-[#e29aff]", color: "text-[#e29aff]" };
  if (type === "Company-specific") return { icon: Building, bg: "bg-[#ffb48a]/10 text-[#ffb48a]", color: "text-[#ffb48a]" };
  return { icon: Code, bg: "bg-[#4ee4cb]/10 text-[#4ee4cb]", color: "text-[#4ee4cb]" }; // Default Technical
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

  return (
    <div className="flex flex-col rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
      <h3 className="mb-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Your Interview History</h3>
      
      {/* Table Header */}
      <div className="mb-3 grid grid-cols-12 gap-4 border-b border-white/[0.06] pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        <div className="col-span-7">Role</div>
        <div className="col-span-3">Date</div>
        <div className="col-span-2">Score</div>
      </div>

      {/* Table Rows */}
      {loading ? (
        <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-[#ffd159]" /></div>
      ) : displayedHistory.length === 0 ? (
        <div className="text-center p-4 text-slate-400">No interviews taken yet.</div>
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
                className="group grid grid-cols-12 items-center gap-4 cursor-pointer transition-colors hover:bg-[#242730] rounded-xl -mx-2 px-3 py-2"
              >
                
                {/* Role & Icon */}
                <div className="col-span-7 flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-base font-bold text-white group-hover:text-[#ffd159] transition-colors truncate">{row.target_role}</h4>
                    <p className="text-sm text-slate-400 truncate">{row.interview_type}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="col-span-3">
                  <p className="text-sm text-slate-200">{dateObj.toLocaleDateString()}</p>
                  <p className="text-xs text-slate-400">{dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>

                {/* Score */}
                <div className="col-span-2">
                  <span className={`text-base font-bold ${row.overall_score >= 80 ? "text-[#4ee4cb]" : row.overall_score >= 60 ? "text-[#ffd159]" : "text-[#ff94aa]"}`}>
                    {row.overall_score !== null ? `${row.overall_score}%` : "In Progress"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/[0.06]">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm font-medium text-[#4ee4cb] transition-colors hover:text-[#4ee4cb]/80"
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
