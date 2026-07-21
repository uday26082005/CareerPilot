import HeroBanner from "../components/interviews/HeroBanner";
import InterviewProgress from "../components/interviews/InterviewProgress";
import InterviewTypes from "../components/interviews/InterviewTypes";
import InterviewHistory from "../components/interviews/InterviewHistory";
import InterviewTips from "../components/interviews/InterviewTips";
import InterviewModal from "../components/interviews/InterviewModal";
import { useState } from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import axios from "axios";
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
  // Assuming a generic trigger to refresh data when modal closes
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCancelInterview = async () => {
    if (!window.confirm("Are you sure you want to cancel and delete your pending interview(s)?")) return;
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

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mock Interviews</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Practice real interview scenarios, get AI feedback and improve your confidence.
        </p>
      </div>

      {activeInterviews.length > 0 && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 text-orange-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">You have {activeInterviews.length} pending interview(s) in progress.</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <button 
              onClick={handleCancelInterview}
              className="flex items-center gap-1 text-sm font-medium hover:text-orange-400 transition-colors"
            >
              <Trash2 className="h-4 w-4" /> Cancel
            </button>
            <button 
              onClick={() => {
                setResumeInterviewId(activeInterviews[0].id);
                setIsModalOpen(true);
              }}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 transition-colors"
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
          <div className="mt-4 flex flex-col gap-3 p-5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02]">
            <label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Target Company Name</label>
            {!isCompanyConfirmed ? (
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  placeholder="e.g. Google, Microsoft, Meta..." 
                  className="flex-1 max-w-md rounded-lg border border-slate-200 dark:border-white/10 bg-transparent px-4 py-2 text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none"
                />
                <button 
                  onClick={() => {
                    if (companyName.trim()) setIsCompanyConfirmed(true);
                  }}
                  disabled={!companyName.trim()}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
                >
                  Confirm
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between max-w-md rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-sm font-medium">Company selection completed: <strong>{companyName}</strong></span>
                </div>
                <button 
                  onClick={() => setIsCompanyConfirmed(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-gray-300 underline"
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
    </div>
  );
}
