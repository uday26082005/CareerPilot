import { User, Mail, Briefcase, Globe, X, Loader2, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import AvatarPickerModal from "../components/settings/AvatarPickerModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SKILL_COLORS = [
  "bg-teal-50 text-teal-700 border-teal-200 dark:bg-[#4ee4cb]/10 dark:text-[#4ee4cb] dark:border-[#4ee4cb]/20",
  "bg-amber-50 text-amber-700 border-amber-200 dark:bg-[#ffd159]/10 dark:text-[#ffd159] dark:border-[#ffd159]/20",
  "bg-purple-50 text-purple-700 border-purple-200 dark:bg-[#e29aff]/10 dark:text-[#e29aff] dark:border-[#e29aff]/20",
  "bg-orange-50 text-orange-700 border-orange-200 dark:bg-[#ffb48a]/10 dark:text-[#ffb48a] dark:border-[#ffb48a]/20",
  "bg-sky-50 text-sky-700 border-sky-200 dark:bg-[#72c5ff]/10 dark:text-[#72c5ff] dark:border-[#72c5ff]/20",
  "bg-rose-50 text-rose-700 border-rose-200 dark:bg-[#ff94aa]/10 dark:text-[#ff94aa] dark:border-[#ff94aa]/20",
];

export default function ProfileSummary() {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const { data: pData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (pData) setProfile(pData);
        
        const { data: rData } = await supabase.from('resumes').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single();
        if (rData) setResume(rData);
      } catch (err) {
        console.error("Error fetching profile summary data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSaveAvatar = async (selectedUrl, uploadData) => {
    if (!session?.access_token) return;
    try {
      let finalAvatarUrl = selectedUrl;

      if (uploadData) {
        const uploadRes = await axios.post(`${API_BASE_URL}/profile/avatar`, {
          base64Data: uploadData.base64Data,
          contentType: uploadData.contentType
        }, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });

        if (uploadRes.data?.success) {
          finalAvatarUrl = uploadRes.data.publicUrl;
        }
      }

      await supabase.auth.updateUser({
        data: { avatar_url: finalAvatarUrl }
      });

      await axios.put(`${API_BASE_URL}/profile`, {
        avatarUrl: finalAvatarUrl
      }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      setProfile(prev => ({ ...prev, avatar_url: finalAvatarUrl }));
      toast.success("Profile photo updated successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Failed to update avatar:", err);
      toast.error("Failed to update profile photo");
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500 dark:text-[#ffd159]" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Loading your profile...</p>
      </div>
    );
  }

  const profileData = {
    fullName: profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || "Set up your profile",
    email: user?.email || "",
    currentRole: profile?.job_role || profile?.current_role || user?.user_metadata?.current_role || "Not Specified",
    experience: (() => {
      const years = profile?.years_experience ?? user?.user_metadata?.years_experience;
      if (years === undefined || years === null) return "Not Specified";
      if (years < 2) return "Beginner";
      if (years <= 5) return "Intermediate";
      return "Expert";
    })(),
    bio: resume?.summary || profile?.bio || user?.user_metadata?.bio || "Complete your profile or upload a resume to generate your professional bio.",
    skills: resume?.strong_skills || (profile?.skills ? profile.skills.split(",").map(s => s.trim()).filter(Boolean) : (user?.user_metadata?.skills ? user.user_metadata.skills.split(",").map(s => s.trim()).filter(Boolean) : [])),
    targetRole: profile?.target_role || user?.user_metadata?.target_role || "Not Specified",
    githubUrl: profile?.github_url || user?.user_metadata?.github_url || null,
    linkedinUrl: profile?.linkedin_url || user?.user_metadata?.linkedin_url || null,
    avatarUrl: profile?.avatar_url || user?.user_metadata?.avatar_url || ""
  };

  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Profile Summary
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            A comprehensive overview of your professional profile and career preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Basic Info & Bio */}
        <div className="md:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
            <div className="flex items-center gap-5 mb-6">
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(true)}
                  className="relative flex h-20 w-20 rounded-full overflow-hidden cursor-pointer focus:outline-none ring-4 ring-slate-100 dark:ring-[#242730] shadow-md hover:ring-amber-500/50 dark:hover:ring-[#ffd159]/50 transition-all duration-200"
                  title="Click to choose avatar or upload photo"
                >
                  {profileData.avatarUrl ? (
                    <img 
                      src={profileData.avatarUrl} 
                      alt="Avatar" 
                      className="h-full w-full object-cover border border-slate-200 dark:border-white/10" 
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ffd159] to-[#fed656] text-3xl font-bold text-slate-950 uppercase">
                      {profileData.fullName.charAt(0)}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/55 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[1px]">
                    <Camera className="h-6 w-6 text-white drop-shadow-md" />
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAvatarPickerOpen(true)}
                  className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 dark:bg-[#ffd159] text-slate-950 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                  title="Change avatar"
                >
                  <Camera className="h-3 w-3 stroke-[2.5]" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{profileData.fullName}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
                  <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500" /> {profileData.email}
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-white/[0.08]">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">About Me</h3>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {profileData.bio}
                </p>
              </div>
              
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold border ${SKILL_COLORS[idx % SKILL_COLORS.length]}`}
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-500">Upload a resume or add skills in Settings to see your key skills here.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-200 dark:bg-[#72c5ff]/10 dark:text-[#72c5ff] dark:border-[#72c5ff]/20">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connected Accounts</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {profileData.githubUrl && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1 dark:border-white/[0.06] dark:bg-[#242730]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">GitHub</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400 dark:text-slate-400" /> 
                    <a href={profileData.githubUrl} target="_blank" rel="noreferrer" className="text-amber-600 hover:text-amber-700 dark:text-[#ffd159] hover:underline truncate">
                      {profileData.githubUrl.replace('https://github.com/', '')}
                    </a>
                  </p>
                </div>
              )}
              {profileData.linkedinUrl && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1 dark:border-white/[0.06] dark:bg-[#242730]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">LinkedIn</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400 dark:text-slate-400" /> 
                    <a href={profileData.linkedinUrl} target="_blank" rel="noreferrer" className="text-amber-600 hover:text-amber-700 dark:text-[#ffd159] hover:underline truncate">
                      {profileData.linkedinUrl.replace('https://linkedin.com/in/', '')}
                    </a>
                  </p>
                </div>
              )}
              {!profileData.githubUrl && !profileData.linkedinUrl && (
                <p className="text-sm text-slate-500">No accounts connected yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Target Role & Preferences */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 dark:bg-[#ffd159]/10 dark:text-[#ffd159] dark:border-[#ffd159]/20">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Career Goals</h3>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1 dark:border-white/[0.06] dark:bg-[#242730]">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Target Role</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{profileData.targetRole}</p>
              </div>
              
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1 dark:border-white/[0.06] dark:bg-[#242730]">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Role</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">{profileData.currentRole}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1 dark:border-white/[0.06] dark:bg-[#242730]">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Experience Level</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{profileData.experience}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <AvatarPickerModal
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        currentAvatarUrl={profileData.avatarUrl}
        userName={profileData.fullName}
        onSaveAvatar={handleSaveAvatar}
      />
    </div>
  );
}
