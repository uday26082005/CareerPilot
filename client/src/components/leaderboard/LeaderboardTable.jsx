import { Shield, ShieldAlert, ShieldCheck, Flame } from "lucide-react";

export default function LeaderboardTable() {
  const TABLE_DATA = [
    { rank: 4, name: "Sneha Iyer", level: 16, xp: "3200 XP", streak: 12, badges: [1, 2, 3], avatar: "https://ui-avatars.com/api/?name=Sneha+Iyer&background=8b5cf6&color=fff" },
    { rank: 5, name: "Karan Singh", level: 15, xp: "2890 XP", streak: 9, badges: [1, 4, 1], avatar: "https://ui-avatars.com/api/?name=Karan+Singh&background=3b82f6&color=fff" },
    { rank: 6, name: "Neha Patel", level: 14, xp: "2700 XP", streak: 7, badges: [1, 3], avatar: "https://ui-avatars.com/api/?name=Neha+Patel&background=ec4899&color=fff" },
    { rank: 7, name: "Vivek Nair", level: 13, xp: "2400 XP", streak: 6, badges: [2, 4], avatar: "https://ui-avatars.com/api/?name=Vivek+Nair&background=10b981&color=fff" },
    { rank: 8, name: "Ananya Das", level: 12, xp: "2100 XP", streak: 5, badges: [1], avatar: "https://ui-avatars.com/api/?name=Ananya+Das&background=f59e0b&color=fff" },
    { rank: 9, name: "Aditya Rao", level: 11, xp: "1850 XP", streak: 4, badges: [2], avatar: "https://ui-avatars.com/api/?name=Aditya+Rao&background=6366f1&color=fff" },
    { rank: 10, name: "Rahul Gupta", level: 10, xp: "1500 XP", streak: 3, badges: [1, 4], avatar: "https://ui-avatars.com/api/?name=Rahul+Gupta&background=ef4444&color=fff" },
  ];

  // Helper to render random-ish badges based on ID
  const renderBadge = (id, idx) => {
    switch (id) {
      case 1: return <Shield key={idx} className="h-4 w-4 text-violet-400" />;
      case 2: return <ShieldCheck key={idx} className="h-4 w-4 text-emerald-400" />;
      case 3: return <div key={idx} className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 text-[9px] font-bold text-blue-400 border border-blue-500/50">5</div>;
      case 4: return <ShieldAlert key={idx} className="h-4 w-4 text-orange-400" />;
      default: return null;
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="border-b border-white/5 bg-white/[0.01] text-xs text-gray-500">
            <tr>
              <th className="px-6 py-4 font-medium">Rank</th>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Level</th>
              <th className="px-6 py-4 font-medium">XP Points</th>
              <th className="px-6 py-4 font-medium">Badges</th>
              <th className="px-6 py-4 font-medium">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {TABLE_DATA.map((row) => (
              <tr key={row.rank} className="transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4">
                  <span className="font-bold text-white">{row.rank}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={row.avatar} alt={row.name} className="h-8 w-8 rounded-full border border-white/10" />
                    <span className="font-medium text-white">{row.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  Level {row.level}
                </td>
                <td className="px-6 py-4 font-bold text-gray-200">
                  {row.xp}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {row.badges.map((b, i) => renderBadge(b, i))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
                    <span className="font-bold text-white">{row.streak} days</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
