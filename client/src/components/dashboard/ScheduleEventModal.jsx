import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Clock, Type, FileText } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ScheduleEventModal({ isOpen, onClose, onEventCreated }) {
  const { session } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    type: "interview",
    date: "",
    time: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Combine date and time into ISO string
      const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      await axios.post(
        `${API_BASE_URL}/dashboard/events`,
        {
          title: formData.title,
          type: formData.type,
          scheduled_at: scheduledAt
        },
        { 
          headers: { Authorization: `Bearer ${session.access_token}` }
        }
      );

      // Reset form
      setFormData({ title: "", type: "interview", date: "", time: "" });
      
      // Notify parent to refresh data
      onEventCreated();
      onClose();
    } catch (err) {
      console.error(err);
      let errMsg = "Failed to schedule event.";
      if (err.response?.data) {
        if (err.response.data.errors) {
          errMsg = err.response.data.errors.map(e => e.message).join(", ");
        } else if (err.response.data.message) {
          errMsg = err.response.data.message;
        }
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 dark:bg-[#060816]/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white dark:bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Schedule Custom Event
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full bg-slate-100 dark:bg-white/10 p-2 text-slate-600 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Event Title</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Google Mock Interview"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Event Type</label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select 
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 appearance-none [&>option]:dark:bg-slate-900"
              >
                <option value="interview" className="dark:bg-slate-900">Mock Interview</option>
                <option value="task" className="dark:bg-slate-900">General Task</option>
                <option value="review" className="dark:bg-slate-900">Resume Review</option>
                <option value="assessment" className="dark:bg-slate-900">Skill Assessment</option>
                <option value="practice" className="dark:bg-slate-900">Practice Session</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:[color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:[color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-violet-700 disabled:opacity-50"
          >
            {loading ? "Scheduling..." : "Schedule Event"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
