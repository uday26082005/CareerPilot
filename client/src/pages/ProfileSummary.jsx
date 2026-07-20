import { User, Mail, GraduationCap, BookOpen, Calendar, Briefcase, Building, MapPin, Sparkles, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function ProfileSummary() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <div className="flex h-[60vh] items-center justify-center text-slate-500">Loading your Profile...</div>;
  }

  const profileData = {
    fullName: profile?.full_name || "Set up your profile",
    email: user?.email || "",
    currentRole: profile?.job_role || "Not Specified",
    experience: profile?.years_experience ? `${profile.years_experience} Years` : "Not Specified",
    bio: resume?.summary || "Upload a resume to automatically generate your professional bio.",
    skills: resume?.strong_skills || [],
    targetRole: profile?.target_role || "Not Specified",
    githubUrl: profile?.github_url || null,
    linkedinUrl: profile?.linkedin_url || null
  };

  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Profile Summary
          </h1>
          <p className="mt-1 text-base text-slate-500 dark:text-gray-400">
            A comprehensive overview of your professional profile and career preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Basic Info & Bio */}
        <div className="md:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
            <div className="flex items-center gap-5 mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-700 text-3xl font-bold text-white shadow-lg shadow-violet-500/20">
                {profileData.fullName.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{profileData.fullName}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 mt-1">
                  <Mail className="h-4 w-4" /> {profileData.email}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/5">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">About Me</h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-gray-400">
                  {profileData.bio}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400" /> Key Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-md bg-violet-50 dark:bg-violet-500/10 px-2.5 py-1 text-xs font-medium text-violet-600 dark:text-violet-300 border border-violet-200 dark:border-violet-500/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links Card */}
          <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-violet-400" /> Connected Accounts
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {profileData.githubUrl && (
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500 dark:text-gray-400">GitHub</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" /> 
                    <a href={profileData.githubUrl} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline truncate">
                      {profileData.githubUrl.replace('https://github.com/', '')}
                    </a>
                  </p>
                </div>
              )}
              {profileData.linkedinUrl && (
                <div className="space-y-1">
                  <span className="text-xs font-medium text-slate-500 dark:text-gray-400">LinkedIn</span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="h-4 w-4 text-slate-400" /> 
                    <a href={profileData.linkedinUrl} target="_blank" rel="noreferrer" className="text-violet-400 hover:underline truncate">
                      {profileData.linkedinUrl.replace('https://linkedin.com/in/', '')}
                    </a>
                  </p>
                </div>
              )}
              {!profileData.githubUrl && !profileData.linkedinUrl && (
                <p className="text-sm text-slate-500 dark:text-gray-400">No accounts connected yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Target Role & Preferences */}
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-violet-400" /> Career Goals
            </h3>
            
            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Target Role</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{profileData.targetRole}</p>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Current Role</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{profileData.currentRole}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-medium text-slate-500 dark:text-gray-400">Experience Level</span>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{profileData.experience}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
