import { User, Mail, Briefcase, Globe, X, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

const SKILL_COLORS = [
  "bg-[#4ee4cb]/10 text-[#4ee4cb] border-[#4ee4cb]/20",
  "bg-[#ffd159]/10 text-[#ffd159] border-[#ffd159]/20",
  "bg-[#e29aff]/10 text-[#e29aff] border-[#e29aff]/20",
  "bg-[#ffb48a]/10 text-[#ffb48a] border-[#ffb48a]/20",
  "bg-[#72c5ff]/10 text-[#72c5ff] border-[#72c5ff]/20",
  "bg-[#ff94aa]/10 text-[#ff94aa] border-[#ff94aa]/20",
];

export default function ProfileSummary() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#ffd159]" />
        <p className="text-sm text-slate-400">Loading your profile...</p>
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
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Profile Summary
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            A comprehensive overview of your professional profile and career preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Basic Info & Bio */}
        <div className="md:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 sm:p-8 shadow-xl shadow-black/25">
            <div className="flex items-center gap-5 mb-6">
              {profileData.avatarUrl ? (
                <img 
                  src={profileData.avatarUrl} 
                  alt="Avatar" 
                  onClick={() => setIsPreviewOpen(true)}
                  className="h-20 w-20 rounded-full object-cover border border-white/10 ring-4 ring-[#242730] shadow-lg cursor-pointer hover:border-[#ffd159]/80 transition-colors" 
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd159] to-[#fed656] text-3xl font-bold text-slate-950 ring-4 ring-[#242730] shadow-lg uppercase">
                  {profileData.fullName.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-white capitalize">{profileData.fullName}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                  <Mail className="h-4 w-4 text-slate-500" /> {profileData.email}
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/[0.08]">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">About Me</h3>
                <p className="text-sm leading-relaxed text-slate-300">
                  {profileData.bio}
                </p>
              </div>
              
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Key Skills</h3>
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
                    <p className="text-sm text-slate-500">Upload a resume or add skills in Settings to see your key skills here.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Card */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 sm:p-8 shadow-xl shadow-black/25">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#72c5ff]/10 text-[#72c5ff] border border-[#72c5ff]/20">
                <User className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Connected Accounts</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {profileData.githubUrl && (
                <div className="rounded-2xl border border-white/[0.06] bg-[#242730] p-4 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">GitHub</span>
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" /> 
                    <a href={profileData.githubUrl} target="_blank" rel="noreferrer" className="text-[#ffd159] hover:underline truncate">
                      {profileData.githubUrl.replace('https://github.com/', '')}
                    </a>
                  </p>
                </div>
              )}
              {profileData.linkedinUrl && (
                <div className="rounded-2xl border border-white/[0.06] bg-[#242730] p-4 space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">LinkedIn</span>
                  <p className="text-sm font-semibold text-white flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" /> 
                    <a href={profileData.linkedinUrl} target="_blank" rel="noreferrer" className="text-[#ffd159] hover:underline truncate">
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
          <div className="rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 sm:p-8 shadow-xl shadow-black/25">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffd159]/10 text-[#ffd159] border border-[#ffd159]/20">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Career Goals</h3>
            </div>
            
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/[0.06] bg-[#242730] p-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Role</span>
                <p className="text-sm font-bold text-white capitalize">{profileData.targetRole}</p>
              </div>
              
              <div className="rounded-2xl border border-white/[0.06] bg-[#242730] p-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Role</span>
                <p className="text-sm font-bold text-white capitalize">{profileData.currentRole}</p>
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-[#242730] p-4 space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Experience Level</span>
                <p className="text-sm font-bold text-white">{profileData.experience}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {isPreviewOpen && profileData.avatarUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative max-w-xl w-full flex flex-col items-center">
            <button 
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors animate-pulse"
              onClick={() => setIsPreviewOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={profileData.avatarUrl?.replace(/=s\d+-c/i, '=s1000-c')} 
              alt="Avatar Full Preview" 
              className="max-h-[70vh] max-w-full rounded-3xl object-contain border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
