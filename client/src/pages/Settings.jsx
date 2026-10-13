import { 
  ProfileSection, 
  SecuritySettings,
  ApplicationDefaults,
  AccountManagement
} from "../components/settings/SettingsCards";

export default function Settings() {
  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight mb-1">Settings</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <ProfileSection />

        <ApplicationDefaults />

        <SecuritySettings />

        <AccountManagement />
      </div>

    </div>
  );
}
