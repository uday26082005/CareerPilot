import { useState, useEffect } from "react";
import { Pencil, Bell, Shield, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function ProfileSection() {
  const { session } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [bio, setBio] = useState("");

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.access_token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        const p = res.data?.data;
        if (p) {
          setName(p.fullName || session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || "");
          setTargetRole(p.targetRole || session?.user?.user_metadata?.target_role || "");
          setCurrentRole(p.currentRole || session?.user?.user_metadata?.current_role || "");
          setExperienceLevel(mapExperience(p.yearsExperience || session?.user?.user_metadata?.years_experience));
          setBio(p.bio || session?.user?.user_metadata?.bio || "");
          setSkills(p.skills || session?.user?.user_metadata?.skills || "");
        }
      } catch {
        // Use auth metadata as fallback
        setName(session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || "");
        setTargetRole(session?.user?.user_metadata?.target_role || "");
        setCurrentRole(session?.user?.user_metadata?.current_role || "");
        setExperienceLevel(mapExperience(session?.user?.user_metadata?.years_experience));
        setBio(session?.user?.user_metadata?.bio || "");
        setSkills(session?.user?.user_metadata?.skills || "");
      }
      setEmail(session?.user?.email || "");
      setIsLoading(false);
    };
    fetchProfile();
  }, [session?.access_token]);

  const mapExperience = (years) => {
    if (!years || years < 2) return "Beginner";
    if (years <= 5) return "Intermediate";
    return "Expert";
  };

  const mapExperienceToYears = (level) => {
    if (level === "Beginner") return 1;
    if (level === "Intermediate") return 3;
    return 6;
  };

  const handleSave = async () => {
    if (!session?.access_token) return;
    setIsSaving(true);
    try {
      // 1. Update user metadata in Supabase Auth client-side so header and other components reload instantly
      await supabase.auth.updateUser({
        data: {
          full_name: name,
          target_role: targetRole,
          current_role: currentRole,
          years_experience: mapExperienceToYears(experienceLevel),
          bio: bio,
          skills: skills
        }
      });

      // 2. Call backend to update profile table
      await axios.put(`${API_BASE_URL}/profile`, {
        fullName: name,
        targetRole: targetRole,
        currentRole: currentRole,
        yearsExperience: mapExperienceToYears(experienceLevel),
        bio: bio,
        skills: skills
      }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a]">
        <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-700 text-2xl font-bold text-white">
            {(name || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{name || "Set up your profile"}</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">{email}</p>
          </div>
        </div>
        <button 
          onClick={() => { if (isEditing) { setIsEditing(false); } else { setIsEditing(true); } }}
          className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-2 text-xs font-bold text-slate-900 dark:text-white transition-colors hover:bg-slate-200 dark:hover:bg-white/10"
        >
          <Pencil className="h-3 w-3" /> {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {isEditing && (
        <div className="mt-6 border-t border-slate-200 dark:border-white/5 pt-6 grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              disabled
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">Current Role</label>
            <input 
              type="text" 
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              placeholder="e.g. Student, Fresher, Developer"
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">Target Role</label>
            <input 
              type="text" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 [&>option]:dark:bg-slate-900"
            >
              <option value="Beginner">Beginner (0-2 years)</option>
              <option value="Intermediate">Intermediate (3-5 years)</option>
              <option value="Expert">Expert (5+ years)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">Skills</label>
            <input 
              type="text" 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, UI/UX Design"
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-900 dark:text-white mb-2">Bio</label>
            <textarea 
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio about yourself..."
              className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
            />
          </div>

          <div className="md:col-span-2 mt-2">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



export function NotificationSettings() {
  const { session } = useAuth();
  const [prefs, setPrefs] = useState({
    email_notifications: false,
    resume_notifications: true,
    roadmap_notifications: true,
    practice_notifications: true,
    interview_notifications: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrefs = async () => {
      if (!session?.access_token) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/notifications/preferences`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        if (res.data?.data) {
          setPrefs(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch notification preferences:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrefs();
  }, [session?.access_token]);

  const togglePref = async (key) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    try {
      await axios.put(`${API_BASE_URL}/notifications/preferences`, updated, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
    } catch (err) {
      console.error("Failed to update preference:", err);
      // Revert on failure
      setPrefs(prefs);
    }
  };

  const Toggle = ({ label, description, prefKey }) => (
    <div className="flex items-center justify-between w-full border-t border-slate-200 dark:border-white/5 pt-4">
      <div>
        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{label}</h4>
        <p className="text-[10px] text-slate-500 dark:text-gray-400">{description}</p>
      </div>
      <button 
        onClick={() => togglePref(prefKey)}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${prefs[prefKey] ? 'bg-violet-600' : 'bg-slate-300 dark:bg-white/10'}`}
      >
        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${prefs[prefKey] ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Bell className="h-5 w-5 text-violet-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
          <p className="text-[11px] text-slate-500 dark:text-gray-400">Manage your notifications</p>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 text-violet-500 animate-spin" /></div>
      ) : (
        <div className="space-y-3">
          <Toggle label="Email Notifications" description="Receive important updates via email" prefKey="email_notifications" />
          <Toggle label="Resume Reminders" description="Get notified to upload or update your resume" prefKey="resume_notifications" />
          <Toggle label="Practice Reminders" description="Stay on track with practice session alerts" prefKey="practice_notifications" />
          <Toggle label="Interview Reminders" description="Mock interview scheduling reminders" prefKey="interview_notifications" />
          <Toggle label="Roadmap Updates" description="Progress updates on your learning roadmap" prefKey="roadmap_notifications" />
        </div>
      )}
    </div>
  );
}

export function SecuritySettings() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-5 w-5 text-violet-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Privacy & Security</h3>
          <p className="text-[11px] text-slate-500 dark:text-gray-400">Keep your account secure</p>
        </div>
      </div>
      <div className="flex-1 flex items-end">
        <div className="flex items-center justify-between w-full border-t border-slate-200 dark:border-white/5 pt-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Change Password</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400">Update your password regularly</p>
          </div>
          <Link to="/reset-password" className="rounded-lg bg-violet-800 px-6 py-2 text-xs font-bold text-white transition-colors hover:bg-violet-700">
            Change
          </Link>
        </div>
      </div>
    </div>
  );
}
