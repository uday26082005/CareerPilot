import { useState, useEffect, useRef } from "react";
import { Pencil, Shield, Loader2, Camera, X, Settings, AlertTriangle, Trash2, Sun, Moon, FileText, Upload, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";
import axios from "axios";
import toast from "react-hot-toast";
import ThemedSelect from "../ui/ThemedSelect";
import AvatarPickerModal from "./AvatarPickerModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [pendingUpload, setPendingUpload] = useState(null);

  // Resume states
  const [currentResume, setCurrentResume] = useState(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const resumeInputRef = useRef(null);

  // Fetch profile and active resume from backend
  useEffect(() => {
    const fetchProfileAndResume = async () => {
      if (!session?.access_token) return;
      try {
        const [profileRes, resumeRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/profile`, {
            headers: { Authorization: `Bearer ${session.access_token}` }
          }),
          axios.get(`${API_BASE_URL}/resume/latest`, {
            headers: { Authorization: `Bearer ${session.access_token}` }
          })
        ]);

        if (profileRes.status === "fulfilled") {
          const p = profileRes.value.data?.data;
          if (p) {
            setName(p.fullName || session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || "");
            setTargetRole(p.targetRole || session?.user?.user_metadata?.target_role || "");
            setCurrentRole(p.currentRole || session?.user?.user_metadata?.current_role || "");
            setExperienceLevel(mapExperience(p.yearsExperience || session?.user?.user_metadata?.years_experience));
            setBio(p.bio || session?.user?.user_metadata?.bio || "");
            setSkills(p.skills || session?.user?.user_metadata?.skills || "");
            setAvatarUrl(p.avatarUrl || session?.user?.user_metadata?.avatar_url || "");
          }
        } else {
          // Use auth metadata as fallback
          setName(session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || "");
          setTargetRole(session?.user?.user_metadata?.target_role || "");
          setCurrentRole(session?.user?.user_metadata?.current_role || "");
          setExperienceLevel(mapExperience(session?.user?.user_metadata?.years_experience));
          setBio(session?.user?.user_metadata?.bio || "");
          setSkills(session?.user?.user_metadata?.skills || "");
          setAvatarUrl(session?.user?.user_metadata?.avatar_url || "");
        }

        if (resumeRes.status === "fulfilled" && resumeRes.value.data?.data) {
          setCurrentResume(resumeRes.value.data.data);
        }
      } catch (err) {
        console.error("Failed to load profile or resume data:", err);
      } finally {
        setEmail(session?.user?.email || "");
        setIsLoading(false);
      }
    };
    fetchProfileAndResume();
  }, [session?.access_token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      // Set the local avatar url directly to the original high-resolution uncompressed base64 data url for instant rendering
      const originalBase64 = event.target.result;
      setAvatarUrl(originalBase64);
      setPendingUpload({
        base64Data: originalBase64,
        contentType: file.type
      });
      toast.success("Profile photo loaded (original resolution)!");
    };
    reader.readAsDataURL(file);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Only PDF format is supported for resumes.");
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Resume file size must not exceed 5MB.");
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      return;
    }

    setIsUploadingResume(true);
    const toastId = toast.loading("Uploading and analyzing new resume with AI...");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(`${API_BASE_URL}/resume/analyze`, formData, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      const resData = response.data?.data;
      if (resData) {
        setCurrentResume(resData);
      }

      toast.success(
        "New resume uploaded and analyzed successfully! Dashboard, Skill Gap, and Career Insights have been updated.",
        { id: toastId, duration: 4500 }
      );
    } catch (error) {
      console.error("Resume upload error:", error);
      const msg = error.response?.data?.message || "Failed to analyze resume. Please try again.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsUploadingResume(false);
      if (resumeInputRef.current) {
        resumeInputRef.current.value = "";
      }
    }
  };

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

      // Update Supabase Auth user metadata
      await supabase.auth.updateUser({
        data: {
          avatar_url: finalAvatarUrl
        }
      });

      // Update backend profile record
      await axios.put(`${API_BASE_URL}/profile`, {
        avatarUrl: finalAvatarUrl
      }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      setAvatarUrl(finalAvatarUrl);
      setPendingUpload(null);
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

  const handleSave = async () => {
    if (!session?.access_token) return;
    setIsSaving(true);
    try {
      let finalAvatarUrl = avatarUrl;

      // 1. If there's a pending high-res image upload, upload it to the backend to get a public CDN link
      if (pendingUpload) {
        const uploadRes = await axios.post(`${API_BASE_URL}/profile/avatar`, {
          base64Data: pendingUpload.base64Data,
          contentType: pendingUpload.contentType
        }, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        
        if (uploadRes.data?.success) {
          finalAvatarUrl = uploadRes.data.publicUrl;
        }
      }

      // 2. Update user metadata in Supabase Auth client-side so header and other components reload instantly
      await supabase.auth.updateUser({
        data: {
          full_name: name,
          target_role: targetRole,
          current_role: currentRole,
          years_experience: mapExperienceToYears(experienceLevel),
          bio: bio,
          skills: skills,
          avatar_url: finalAvatarUrl
        }
      });

      // 3. Call backend to update profile table
      await axios.put(`${API_BASE_URL}/profile`, {
        fullName: name,
        targetRole: targetRole,
        currentRole: currentRole,
        yearsExperience: mapExperienceToYears(experienceLevel),
        bio: bio,
        skills: skills,
        avatarUrl: finalAvatarUrl
      }, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      
      setIsEditing(false);
      setPendingUpload(null);
      
      // Reload page after a brief delay so all layouts synchronize avatar state
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error("Failed to save profile changes");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
        <Loader2 className="h-6 w-6 text-amber-500 dark:text-[#ffd159] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button
              type="button"
              onClick={() => setIsAvatarPickerOpen(true)}
              className="relative flex h-16 w-16 rounded-full overflow-hidden cursor-pointer focus:outline-none ring-4 ring-slate-100 dark:ring-[#242730] hover:ring-amber-500/50 dark:hover:ring-[#ffd159]/50 transition-all duration-200"
              title="Click to choose avatar or upload photo"
            >
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Avatar" 
                  className="h-full w-full object-cover border border-slate-200 dark:border-white/10" 
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-400 to-amber-300 dark:from-[#ffd159] dark:to-[#fed656] text-2xl font-bold text-slate-950 uppercase">
                  {(name || "U").charAt(0).toUpperCase()}
                </div>
              )}
              {/* Camera Icon Overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/55 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-[1px]">
                <Camera className="h-5 w-5 text-white drop-shadow-md" />
              </div>
            </button>
            {/* Small camera badge icon on bottom right */}
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
            <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{name || "Set up your profile"}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{email}</p>
          </div>
        </div>
        <button 
          onClick={() => { if (isEditing) { setIsEditing(false); } else { setIsEditing(true); } }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#242730] dark:text-slate-200 dark:hover:bg-[#2b2f3a] dark:hover:text-white"
        >
          <Pencil className="h-3 w-3" /> {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {isEditing && (
        <div className="mt-6 border-t border-slate-200 dark:border-white/[0.08] pt-6 grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-white/[0.08] dark:bg-[#242730] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#ffd159] dark:focus:ring-[#ffd159]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              disabled
              className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm text-slate-400 opacity-60 cursor-not-allowed dark:border-white/[0.04] dark:bg-[#242730]/60 dark:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Target Role</label>
            <input 
              type="text" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Full Stack Developer, Data Scientist"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-white/[0.08] dark:bg-[#242730] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#ffd159] dark:focus:ring-[#ffd159]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Experience Level</label>
            <ThemedSelect
              value={experienceLevel}
              onChange={setExperienceLevel}
              options={[
                { value: "Beginner", label: "Beginner (0-2 years)" },
                { value: "Intermediate", label: "Intermediate (3-5 years)" },
                { value: "Expert", label: "Expert (5+ years)" },
              ]}
              className="w-full"
              align="left"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Skills</label>
            <input 
              type="text" 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, UI/UX Design"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-white/[0.08] dark:bg-[#242730] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#ffd159] dark:focus:ring-[#ffd159]"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Bio</label>
            <textarea 
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio about yourself..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-white/[0.08] dark:bg-[#242730] dark:text-white dark:placeholder:text-slate-500 dark:focus:border-[#ffd159] dark:focus:ring-[#ffd159] resize-none"
            />
          </div>

          {/* Active Resume & Add New Resume Feature */}
          <div className="md:col-span-2 pt-4 border-t border-slate-200 dark:border-white/[0.08]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Resume Attachment
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Upload a new resume to update your ATS score, skill gap, and AI recommendations across the entire platform. If no new resume is attached, your profile setup resume remains active.
                </p>
              </div>
            </div>

            <input 
              type="file" 
              ref={resumeInputRef} 
              onChange={handleResumeUpload} 
              accept="application/pdf,.pdf"
              className="hidden" 
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/80 dark:border-white/[0.08] dark:bg-[#242730]/70">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-[#ffd159]/10 dark:text-[#ffd159] border border-amber-500/20 dark:border-[#ffd159]/20">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                      {currentResume?.resumeFilename || "Resume (Profile Setup)"}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentResume?.createdAt
                      ? `Analyzed ${new Date(currentResume.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • Overall ATS: ${currentResume.atsScore || currentResume.overallScore || 'N/A'}/100`
                      : "Active resume uploaded during profile setup phase"}
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                disabled={isUploadingResume}
                className="flex items-center gap-2 rounded-xl bg-amber-500 dark:bg-[#ffd159] text-slate-950 font-bold px-4 py-2.5 text-xs transition-all hover:brightness-105 active:scale-95 shadow-sm disabled:opacity-50 shrink-0 cursor-pointer"
              >
                {isUploadingResume ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                <span>{isUploadingResume ? "Analyzing Resume..." : "Add New Resume"}</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-2 mt-2">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 dark:from-[#ffd159] dark:to-[#fed656] px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:brightness-105 active:scale-95 shadow-md shadow-amber-500/10 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin text-slate-950" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {!isEditing && (
        <div className="mt-6 border-t border-slate-200 dark:border-white/[0.08] pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <input 
            type="file" 
            ref={resumeInputRef} 
            onChange={handleResumeUpload} 
            accept="application/pdf,.pdf"
            className="hidden" 
          />
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-[#ffd159]/10 dark:text-[#ffd159] border border-amber-500/20 dark:border-[#ffd159]/20">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                  {currentResume?.resumeFilename || "Resume (Profile Setup)"}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Active
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentResume?.overallScore
                  ? `ATS Score: ${currentResume.atsScore || currentResume.overallScore}/100 • Updated ${new Date(currentResume.createdAt).toLocaleDateString()}`
                  : "Active resume from profile setup phase"}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => {
              setIsEditing(true);
              setTimeout(() => resumeInputRef.current?.click(), 100);
            }}
            disabled={isUploadingResume}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#242730] dark:text-slate-200 dark:hover:bg-[#2b2f3a] dark:hover:text-white cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isUploadingResume ? (
              <Loader2 className="h-3 w-3 animate-spin text-amber-500 dark:text-[#ffd159]" />
            ) : (
              <Upload className="h-3 w-3 text-amber-500 dark:text-[#ffd159]" />
            )}
            <span>{isUploadingResume ? "Analyzing..." : "Add New Resume"}</span>
          </button>
        </div>
      )}

      <AvatarPickerModal
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        currentAvatarUrl={avatarUrl}
        userName={name}
        onSaveAvatar={handleSaveAvatar}
      />
    </div>
  );
}

export function SecuritySettings() {
  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600 border border-sky-200 dark:bg-[#72c5ff]/10 dark:text-[#72c5ff] dark:border-[#72c5ff]/20">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Privacy & Security</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Keep your account secure</p>
        </div>
      </div>
      <div className="flex-1 flex items-end">
        <div className="flex items-center justify-between w-full border-t border-slate-200 dark:border-white/[0.08] pt-6">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Update your password regularly</p>
          </div>
          <Link to="/reset-password" className="rounded-xl border border-slate-200 bg-slate-50 px-6 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#242730] dark:text-slate-200 dark:hover:bg-[#2b2f3a] dark:hover:text-white shadow-sm">
            Change
          </Link>
        </div>
      </div>
    </div>
  );
}

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Development Engineer",
  "Data Scientist",
  "Data Engineer",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "System Reliability Engineer",
  "Cloud Architect",
  "Database Administrator",
  "Cybersecurity Analyst",
  "Game Developer",
  "Robotics Engineer",
  "Mobile App Developer",
  "Data Analyst",
  "Quality Assurance Engineer",
  "UI/UX Designer",
  "Product Manager",
  "Business Analyst"
];

export function ApplicationDefaults() {
  const { session } = useAuth();
  const { theme, setTheme } = useTheme();
  const [difficulty, setDifficulty] = useState("easy");
  const [targetRole, setTargetRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (session?.user?.user_metadata) {
      setDifficulty(session.user.user_metadata.default_difficulty || "easy");
      setTargetRole(session.user.user_metadata.target_role || "");
    }
  }, [session]);

  const handleSave = async (field, value) => {
    try {
      setIsSaving(true);
      await axios.put(`${API_BASE_URL}/profile`, {
        [field]: value
      }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      
      // Instantly sync the new target_role across all pages via auth metadata
      if (field === 'targetRole') {
        await supabase.auth.updateUser({
          data: { target_role: value }
        });
      }
      
      toast.success("Setting updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update setting");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200 dark:bg-[#ffd159]/10 dark:text-[#ffd159] dark:border-[#ffd159]/20">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Application Defaults</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Configure default settings for your practice and AI tools</p>
        </div>
      </div>
      <div className="space-y-6 flex-1 flex flex-col justify-end border-t border-slate-200 dark:border-white/[0.08] pt-6">
        
        {/* Theme Preference */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Theme Preference</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Choose between Light Mode and Dark Mode</p>
          </div>
          <ThemedSelect 
            value={theme}
            onChange={(val) => setTheme(val)}
            options={[
              { value: "dark", label: "Dark Mode" },
              { value: "light", label: "Light Mode" },
            ]}
            className="w-36"
            align="right"
          />
        </div>

        {/* Default Difficulty */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Default Difficulty</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Default difficulty for practice interviews</p>
          </div>
          <ThemedSelect 
            value={difficulty}
            onChange={(val) => {
              setDifficulty(val);
              (async () => {
                const { error } = await supabase.auth.updateUser({
                  data: { default_difficulty: val }
                });
                if (error) toast.error("Failed to update difficulty");
                else toast.success("Difficulty updated");
              })();
            }}
            options={[
              { value: "easy", label: "Easy" },
              { value: "medium", label: "Medium" },
              { value: "hard", label: "Hard" },
            ]}
            className="w-36"
            align="right"
          />
        </div>

        {/* Target Job Role */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Target Job Role</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">Default role context for AI tools</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemedSelect 
              value={targetRole} 
              onChange={setTargetRole}
              options={ROLES}
              placeholder="Select your target role"
              className="w-[200px] sm:w-[250px]"
              align="right"
            />
            <button 
              onClick={() => handleSave('targetRole', targetRole)}
              disabled={isSaving || !targetRole}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 dark:from-[#ffd159] dark:to-[#fed656] px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:brightness-105 active:scale-95 shadow-md shadow-amber-500/10 disabled:opacity-50 cursor-pointer"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountManagement() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`${API_BASE_URL}/profile/account`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      toast.success("Account deleted successfully");
      await supabase.auth.signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete account");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="flex flex-col rounded-3xl border border-red-500/20 bg-white dark:bg-[#1c1e24] p-6 sm:p-8 shadow-sm dark:shadow-xl dark:shadow-black/25">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Management</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Manage your data and account status</p>
          </div>
        </div>
        <div className="space-y-6 flex-1 flex flex-col justify-end border-t border-slate-200 dark:border-white/[0.08] pt-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div>
              <h4 className="text-base font-bold text-red-600 dark:text-red-400">Delete Account</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">Permanently delete your account and all data</p>
            </div>
            <button 
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-6 py-2.5 text-sm font-bold transition-all hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1c1e24] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-500 dark:text-red-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Account</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
              Are you ABSOLUTELY sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including resumes and practice history.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 dark:bg-[#242730] dark:hover:bg-[#2b2f3a] dark:hover:text-white border border-slate-200 dark:border-white/[0.08] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 dark:bg-red-500 text-white text-sm font-bold hover:bg-red-700 dark:hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Yes, Delete My Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
