import { 
  ProfileSection, 
  NotificationSettings, 
  SecuritySettings 
} from "../components/settings/SettingsCards";

export default function Settings() {
  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <ProfileSection />

        <div className="grid md:grid-cols-2 gap-6">
          <NotificationSettings />
        </div>

        <SecuritySettings />
      </div>

    </div>
  );
}
