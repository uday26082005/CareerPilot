import { useState, useEffect } from "react";
import { Pencil, Shield, Loader2, Camera, X, Settings, AlertTriangle, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import axios from "axios";
import toast from "react-hot-toast";
import ThemedSelect from "../ui/ThemedSelect";

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
  const [pendingUpload, setPendingUpload] = useState(null);

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
          setAvatarUrl(p.avatarUrl || session?.user?.user_metadata?.avatar_url || "");
        }
      } catch {
        // Use auth metadata as fallback
        setName(session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || "");
        setTargetRole(session?.user?.user_metadata?.target_role || "");
        setCurrentRole(session?.user?.user_metadata?.current_role || "");
        setExperienceLevel(mapExperience(session?.user?.user_metadata?.years_experience));
        setBio(session?.user?.user_metadata?.bio || "");
        setSkills(session?.user?.user_metadata?.skills || "");
        setAvatarUrl(session?.user?.user_metadata?.avatar_url || "");
      }
      setEmail(session?.user?.email || "");
      setIsLoading(false);
    };
    fetchProfile();
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
      <div className="flex items-center justify-center py-12 rounded-3xl border border-white/[0.08] bg-[#1c1e24] shadow-xl shadow-black/25">
        <Loader2 className="h-6 w-6 text-[#ffd159] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 sm:p-8 shadow-xl shadow-black/25">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                onClick={() => !isEditing && setIsPreviewOpen(true)}
                className={`h-16 w-16 rounded-full object-cover border border-white/10 ring-4 ring-[#242730] ${!isEditing ? 'cursor-pointer hover:border-[#ffd159]/80 transition-colors' : ''}`} 
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ffd159] to-[#fed656] text-2xl font-bold text-slate-950 uppercase ring-4 ring-[#242730]">
                {(name || "U").charAt(0).toUpperCase()}
              </div>
            )}
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 text-white" />
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white capitalize">{name || "Set up your profile"}</h2>
            <p className="text-sm text-slate-400">{email}</p>
          </div>
        </div>
        <button 
          onClick={() => { if (isEditing) { setIsEditing(false); } else { setIsEditing(true); } }}
          className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#242730] px-4 py-2 text-xs font-bold text-slate-200 transition-colors hover:bg-[#2b2f3a] hover:text-white"
        >
          <Pencil className="h-3 w-3" /> {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {isEditing && (
        <div className="mt-6 border-t border-white/[0.08] pt-6 grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-[#242730] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#ffd159] focus:outline-none focus:ring-1 focus:ring-[#ffd159]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              disabled
              className="w-full rounded-xl border border-white/[0.04] bg-[#242730]/60 px-4 py-2.5 text-sm text-slate-500 opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Experience Level</label>
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Skills</label>
            <input 
              type="text" 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, Node.js, UI/UX Design"
              className="w-full rounded-xl border border-white/[0.08] bg-[#242730] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#ffd159] focus:outline-none focus:ring-1 focus:ring-[#ffd159]"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Bio</label>
            <textarea 
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="A short bio about yourself..."
              className="w-full rounded-xl border border-white/[0.08] bg-[#242730] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#ffd159] focus:outline-none focus:ring-1 focus:ring-[#ffd159] resize-none"
            />
          </div>

          <div className="md:col-span-2 mt-2">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:brightness-105 active:scale-95 shadow-md shadow-amber-500/10 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin text-slate-950" />}
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {isPreviewOpen && avatarUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative max-w-xl w-full flex flex-col items-center">
            <button 
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              onClick={() => setIsPreviewOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <img 
              src={avatarUrl?.replace(/=s\d+-c/i, '=s1000-c')} 
              alt="Avatar Full Preview" 
              className="max-h-[70vh] max-w-full rounded-2xl object-contain border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}




export function SecuritySettings() {
  return (
    <div className="flex flex-col rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 sm:p-8 shadow-xl shadow-black/25">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#72c5ff]/10 text-[#72c5ff] border border-[#72c5ff]/20">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Privacy & Security</h3>
          <p className="text-sm text-slate-400">Keep your account secure</p>
        </div>
      </div>
      <div className="flex-1 flex items-end">
        <div className="flex items-center justify-between w-full border-t border-white/[0.08] pt-6">
          <div>
            <h4 className="text-base font-bold text-white">Change Password</h4>
            <p className="text-sm text-slate-400">Update your password regularly</p>
          </div>
          <Link to="/reset-password" className="rounded-xl border border-white/[0.08] bg-[#242730] px-6 py-2.5 text-sm font-bold text-slate-200 transition-colors hover:bg-[#2b2f3a] hover:text-white">
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
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "Mobile App Developer",
  "Data Analyst",
  "Machine Learning Engineer",
  "Cybersecurity Analyst",
  "Cloud Architect",
  "Quality Assurance Engineer",
  "Business Analyst",
  "Systems Administrator"
];

export function ApplicationDefaults() {
  const { session } = useAuth();
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
    <div className="flex flex-col rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 sm:p-8 shadow-xl shadow-black/25">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffd159]/10 text-[#ffd159] border border-[#ffd159]/20">
          <Settings className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Application Defaults</h3>
          <p className="text-sm text-slate-400">Configure default settings for your practice and AI tools</p>
        </div>
      </div>
      <div className="space-y-6 flex-1 flex flex-col justify-end border-t border-white/[0.08] pt-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <h4 className="text-base font-bold text-white">Default Difficulty</h4>
            <p className="text-sm text-slate-400">Default difficulty for practice interviews</p>
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div>
            <h4 className="text-base font-bold text-white">Target Job Role</h4>
            <p className="text-sm text-slate-400">Default role context for AI tools</p>
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
              className="rounded-xl bg-gradient-to-r from-[#ffd159] to-[#fed656] px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:brightness-105 active:scale-95 shadow-md shadow-amber-500/10 disabled:opacity-50 cursor-pointer"
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
      <div className="flex flex-col rounded-3xl border border-red-500/20 bg-[#1c1e24] p-6 sm:p-8 shadow-xl shadow-black/25">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Account Management</h3>
            <p className="text-sm text-slate-400">Manage your data and account status</p>
          </div>
        </div>
        <div className="space-y-6 flex-1 flex flex-col justify-end border-t border-white/[0.08] pt-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <div>
              <h4 className="text-base font-bold text-red-400">Delete Account</h4>
              <p className="text-sm text-slate-400">Permanently delete your account and all data</p>
            </div>
            <button 
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 px-6 py-2.5 text-sm font-bold transition-all hover:bg-red-500 hover:text-white active:scale-95 disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#1c1e24] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete Account</h3>
            </div>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Are you ABSOLUTELY sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including resumes and practice history.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 bg-[#242730] hover:bg-[#2b2f3a] hover:text-white border border-white/[0.08] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50"
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
