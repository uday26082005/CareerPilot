import { useState } from "react";
import { Pencil, Palette, Bell, Globe, Shield, Database, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

export function ProfileSection() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Uday Kumar");
  const [email, setEmail] = useState("abc@gmail.com");
  const [skills, setSkills] = useState("React, Node.js, Python");
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Intermediate");
  const [bio, setBio] = useState("Passionate developer looking for new opportunities.");

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-700 text-2xl font-bold text-slate-900 dark:text-white">
            {name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{name}</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">{email}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
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
              onChange={(e) => setEmail(e.target.value)}
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
              onClick={() => setIsEditing(false)}
              className="rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-violet-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}



export function NotificationSettings() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="h-5 w-5 text-violet-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
          <p className="text-[11px] text-slate-500 dark:text-gray-400">Manage your notifications</p>
        </div>
      </div>
      <div className="flex-1 flex items-end">
        <div className="flex items-center justify-between w-full border-t border-slate-200 dark:border-white/5 pt-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Email Notifications</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400">Receive important updates and reminders</p>
          </div>
          <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-violet-600">
            <span className="inline-block h-3 w-3 translate-x-5 transform rounded-full bg-white transition" />
          </div>
        </div>
      </div>
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
          <Link to="/reset-password" className="rounded-lg bg-violet-800 px-6 py-2 text-xs font-bold text-slate-900 dark:text-white transition-colors hover:bg-violet-700">
            Change
          </Link>
        </div>
      </div>
    </div>
  );
}


