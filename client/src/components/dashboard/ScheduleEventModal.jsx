import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Clock, Type, FileText } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import ThemedSelect from "../ui/ThemedSelect";

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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md overflow-visible rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1c1e24] p-6 shadow-2xl text-slate-900 dark:text-white">
        <div className="flex items-center justify-between mb-6 shrink-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Schedule Custom Event
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full bg-slate-100 dark:bg-[#242730] p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2b2f3a] hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/30 p-3 text-sm text-red-600 dark:text-red-400 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Event Title</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Google Mock Interview"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#242730] py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 dark:focus:border-[#ffd159] focus:outline-none focus:ring-1 focus:ring-amber-500 dark:ring-[#ffd159]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Event Type</label>
            <ThemedSelect
              value={formData.type}
              onChange={(val) => setFormData((prev) => ({ ...prev, type: val }))}
              options={[
                { value: "interview", label: "Mock Interview" },
                { value: "task", label: "General Task" },
                { value: "review", label: "Resume Review" },
                { value: "assessment", label: "Skill Assessment" },
                { value: "practice", label: "Practice Session" },
              ]}
              icon={Type}
              className="w-full"
              align="left"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#242730] py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-amber-500 dark:focus:border-[#ffd159] focus:outline-none focus:ring-1 focus:ring-amber-500 dark:ring-[#ffd159] dark:[color-scheme:dark] [color-scheme:light]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Time</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#242730] py-2.5 pl-10 pr-4 text-sm text-slate-900 dark:text-white focus:border-amber-500 dark:focus:border-[#ffd159] focus:outline-none focus:ring-1 focus:ring-amber-500 dark:ring-[#ffd159] dark:[color-scheme:dark] [color-scheme:light]"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] px-4 py-3 text-sm font-bold text-slate-950 shadow-md transition-all hover:brightness-105 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Scheduling..." : "Schedule Event"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
