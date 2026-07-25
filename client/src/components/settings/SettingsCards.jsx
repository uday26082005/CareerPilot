import { useState, useEffect } from "react";
import { Pencil, Shield, Loader2, Camera, X, Settings, AlertTriangle, Download, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import axios from "axios";
import toast from "react-hot-toast";

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
      <div className="flex items-center justify-center py-12 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a]">
        <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative group">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                onClick={() => !isEditing && setIsPreviewOpen(true)}
                className={`h-16 w-16 rounded-full object-cover border border-violet-500/30 ${!isEditing ? 'cursor-pointer hover:border-violet-500/80 transition-colors' : ''}`} 
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-700 text-2xl font-bold text-white uppercase">
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

      {isPreviewOpen && avatarUrl && (
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
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-violet-400" />
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Privacy & Security</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400">Keep your account secure</p>
        </div>
      </div>
      <div className="flex-1 flex items-end">
        <div className="flex items-center justify-between w-full border-t border-slate-200 dark:border-white/5 pt-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Change Password</h4>
            <p className="text-sm text-slate-500 dark:text-gray-400">Update your password regularly</p>
          </div>
          <Link to="/reset-password" className="rounded-lg bg-violet-800 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-violet-700">
            Change
          </Link>
        </div>
      </div>
    </div>
  );
}

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
      toast.success("Setting updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update setting");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-violet-400" />
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Application Defaults</h3>
          <p className="text-sm text-slate-500 dark:text-gray-400">Configure default settings for your practice and AI tools</p>
        </div>
      </div>
      <div className="space-y-6 flex-1 flex flex-col justify-end border-t border-slate-200 dark:border-white/5 pt-4">
        
        <div className="flex items-center justify-between w-full">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Default Difficulty</h4>
            <p className="text-sm text-slate-500 dark:text-gray-400">Default difficulty for practice interviews</p>
          </div>
          <select 
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              // Because of the API naming, we send 'default_difficulty' inside userMetadata
              // Wait, our backend profile route currently accepts specific fields. 
              // I will use an auth API call directly or update the backend. Actually, the backend `PUT /api/profile` doesn't handle `default_difficulty`.
              // I'll just use the supabase client directly here since we have the session.
              (async () => {
                const { error } = await supabase.auth.updateUser({
                  data: { default_difficulty: e.target.value }
                });
                if (error) toast.error("Failed to update difficulty");
                else toast.success("Difficulty updated");
              })();
            }}
            className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 [&>option]:dark:bg-slate-900"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="flex items-center justify-between w-full">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">Target Job Role</h4>
            <p className="text-sm text-slate-500 dark:text-gray-400">Default role context for AI tools</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={targetRole} 
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500" 
            />
            <button 
              onClick={() => handleSave('targetRole', targetRole)}
              disabled={isSaving}
              className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
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
      <div className="flex flex-col rounded-xl border border-red-500/20 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Management</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400">Manage your data and account status</p>
          </div>
        </div>
        <div className="space-y-6 flex-1 flex flex-col justify-end border-t border-slate-200 dark:border-white/5 pt-4">
          
          <div className="flex items-center justify-between w-full">
            <div>
              <h4 className="text-base font-bold text-red-600 dark:text-red-400">Delete Account</h4>
              <p className="text-sm text-slate-500 dark:text-gray-400">Permanently delete your account and all data</p>
            </div>
            <button 
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="flex items-center gap-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-6 py-2.5 text-sm font-bold transition-colors hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0f1123] rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <AlertTriangle className="h-8 w-8" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Delete Account</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Are you ABSOLUTELY sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including resumes and practice history.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
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
