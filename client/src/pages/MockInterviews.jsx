import HeroBanner from "../components/interviews/HeroBanner";
import InterviewProgress from "../components/interviews/InterviewProgress";
import InterviewTypes from "../components/interviews/InterviewTypes";
import InterviewHistory from "../components/interviews/InterviewHistory";
import InterviewTips from "../components/interviews/InterviewTips";
import InterviewModal from "../components/interviews/InterviewModal";
import { useState } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function MockInterviews() {
  const { session } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Technical Interview");
  const [companyName, setCompanyName] = useState("");
  const [isCompanyConfirmed, setIsCompanyConfirmed] = useState(false);
  const [resumeInterviewId, setResumeInterviewId] = useState(null);
  const [activeInterviews, setActiveInterviews] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // Assuming a generic trigger to refresh data when modal closes
  const [refreshKey, setRefreshKey] = useState(0);

  const executeDeleteInterview = async () => {
    setShowDeleteConfirm(false);
    try {
      for (const interview of activeInterviews) {
        await axios.delete(`${API_BASE_URL}/interviews/${interview.id}`, {
          headers: { Authorization: `Bearer ${session?.access_token}` }
        });
      }
      setActiveInterviews([]);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Failed to delete interview(s):", error);
    }
  };

  const handleCancelInterview = () => {
    setShowDeleteConfirm(true);
  };

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Mock Interviews</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Practice real interview scenarios, get AI feedback and improve your confidence.
        </p>
      </div>

      {activeInterviews.length > 0 && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 dark:bg-[#1c1e24] p-4 text-amber-700 dark:text-amber-400 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm dark:shadow-xl dark:shadow-black/25">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">You have {activeInterviews.length} pending interview(s) in progress.</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <button 
              onClick={handleCancelInterview}
              className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Cancel
            </button>
            <button 
              onClick={() => {
                setResumeInterviewId(activeInterviews[0].id);
                setIsModalOpen(true);
              }}
              className="rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] px-4 py-2 text-sm font-bold text-slate-950 shadow-md hover:brightness-105 active:scale-95 transition-all"
            >
              Resume Now
            </button>
          </div>
        </div>
      )}

      {/* Top Row: Hero and Progress */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <HeroBanner 
            activeInterview={activeInterviews.length > 0 ? activeInterviews[0] : null}
            onResume={() => {
              setResumeInterviewId(activeInterviews[0].id);
              setIsModalOpen(true);
            }}
            onStart={() => {
              if (selectedType === "Company-specific" && !companyName.trim()) {
                toast.error("Please enter a Target Company Name to proceed!");
                return;
              }
              if (selectedType === "Company-specific") {
                setIsCompanyConfirmed(true);
              }
              setResumeInterviewId(null);
              setIsModalOpen(true);
            }} 
          />
        </div>
        <div className="lg:col-span-2">
          <InterviewProgress refreshKey={refreshKey} />
        </div>
      </div>

      {/* Middle Row: Interview Types */}
      <div>
        <InterviewTypes activeType={selectedType} setActiveType={setSelectedType} />
        {selectedType === "Company-specific" && (
          <div className="mt-4 flex flex-col gap-3 p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#1c1e24] shadow-sm dark:shadow-xl dark:shadow-black/25">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Target Company Name</label>
            {!isCompanyConfirmed ? (
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  placeholder="e.g. Google, Microsoft, Meta..." 
                  className="flex-1 max-w-md rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#242730] px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-amber-500 dark:focus:border-[#ffd159] focus:outline-none focus:ring-1 focus:ring-amber-500 dark:ring-[#ffd159]"
                />
                <button 
                  onClick={() => {
                    if (companyName.trim()) setIsCompanyConfirmed(true);
                  }}
                  disabled={!companyName.trim()}
                  className="rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] px-5 py-2.5 text-sm font-bold text-slate-950 transition-all hover:brightness-105 active:scale-95 disabled:opacity-50 shadow-md"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between max-w-md rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2.5 text-teal-700 dark:text-[#4ee4cb]">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm font-medium">Company selection completed: <strong className="font-bold">{companyName}</strong></span>
                </div>
                <button 
                  onClick={() => setIsCompanyConfirmed(false)}
                  className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Row: History and Tips */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <InterviewHistory 
            refreshKey={refreshKey} 
            onRowClick={(id) => {
              setResumeInterviewId(id);
              setIsModalOpen(true);
            }}
            onHistoryFetched={(history) => {
              const inProgress = history.filter(h => h.status === 'In Progress');
              setActiveInterviews(inProgress);
            }}
          />
        </div>
        <div className="lg:col-span-2">
          <InterviewTips />
        </div>
      </div>
      
      <InterviewModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setRefreshKey(prev => prev + 1);
        }}
        interviewType={selectedType}
        difficulty="Medium" // Hardcoded for now or add a difficulty selector
        companyName={companyName}
        resumeInterviewId={resumeInterviewId}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1c1e24] p-6 shadow-2xl text-slate-900 dark:text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 dark:text-rose-400">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Pending Interview</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Are you sure you want to cancel and delete your pending interview(s)? This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-[#242730] dark:hover:bg-[#2b2f3a] hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeDeleteInterview}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-500 transition-colors shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
