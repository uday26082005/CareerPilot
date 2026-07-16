import { Pencil, Palette, Bell, Globe, Shield, Database, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

export function ProfileSection() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-700 text-2xl font-bold text-slate-900 dark:text-white">
          U
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Uday Kumar</h2>
          <p className="text-sm text-slate-500 dark:text-gray-400">abc@gmail.com</p>
        </div>
      </div>
      <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-4 py-2 text-xs font-bold text-slate-900 dark:text-white transition-colors hover:bg-slate-200 dark:hover:bg-white/10">
        <Pencil className="h-3 w-3" /> Edit Profile
      </button>
    </div>
  );
}

export function AppearanceSettings() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Palette className="h-5 w-5 text-violet-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Appearance</h3>
          <p className="text-[11px] text-slate-500 dark:text-gray-400">Customize how the application looks</p>
        </div>
      </div>
      <div className="flex-1 flex items-end">
        <div className="flex items-center justify-between w-full border-t border-slate-200 dark:border-white/5 pt-4">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400">Enable dark theme</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              isDark ? "bg-violet-600" : "bg-slate-300 dark:bg-white/20"
            }`}
          >
            <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${isDark ? "translate-x-5" : "translate-x-1"}`} />
          </button>
        </div>
      </div>
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

export function PreferencesSettings() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="h-5 w-5 text-violet-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Preferences</h3>
          <p className="text-[11px] text-slate-500 dark:text-gray-400">Language and regional preferences</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-end space-y-4 border-t border-slate-200 dark:border-white/5 pt-4">
        
        <div className="flex items-center justify-between w-full">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Language</h4>
          <select className="w-40 bg-white dark:bg-[#0a0c1a] border border-slate-200 dark:border-white/10 rounded-md px-3 py-1.5 text-xs text-slate-600 dark:text-gray-300 focus:outline-none focus:border-violet-500">
            <option>English</option>
          </select>
        </div>

        <div className="flex items-center justify-between w-full">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Time Zone</h4>
          <select className="w-40 bg-white dark:bg-[#0a0c1a] border border-slate-200 dark:border-white/10 rounded-md px-3 py-1.5 text-xs text-slate-600 dark:text-gray-300 focus:outline-none focus:border-violet-500">
            <option>(GMT+05:30) India</option>
          </select>
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

export function DataPrivacySettings() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Database className="h-5 w-5 text-violet-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Data & Privacy</h3>
          <p className="text-[11px] text-slate-500 dark:text-gray-400">Manage your data and privacy</p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full border-t border-slate-200 dark:border-white/5 pt-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Download My Data</h4>
          <p className="text-[10px] text-slate-500 dark:text-gray-400">Download your account data and reports</p>
        </div>
        <button className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-6 py-2 text-xs font-bold text-violet-300 transition-colors hover:bg-violet-500/20">
          Download
        </button>
      </div>
    </div>
  );
}

export function AccountSettings() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-[#0a0c1a] p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <LogOut className="h-5 w-5 text-violet-400" />
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Account</h3>
          <p className="text-[11px] text-slate-500 dark:text-gray-400">Manage your account</p>
        </div>
      </div>
      <div className="flex items-center justify-between w-full border-t border-slate-200 dark:border-white/5 pt-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Logout</h4>
          <p className="text-[10px] text-slate-500 dark:text-gray-400">Sign out from AskAI</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-transparent px-6 py-2 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/10">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );
}
