import { Star } from "lucide-react";

export default function TopPodium() {
  const PODIUM_DATA = [
    {
      id: 2,
      rank: 2,
      name: "Priya Sharma",
      level: 18,
      xp: "4520 XP",
      avatar: "https://ui-avatars.com/api/?name=Priya+Sharma&background=2563eb&color=fff",
      theme: "border-blue-500/20 bg-gradient-to-b from-[#0f172a] to-[#0a0c1a]",
      badgeColor: "bg-slate-300 text-slate-700 shadow-[0_0_15px_rgba(203,213,225,0.4)] border-2 border-white",
      starColor: "text-blue-400 fill-blue-400",
      height: "h-64",
      scale: "scale-100",
      glow: "shadow-[0_0_30px_rgba(59,130,246,0.1)]",
      textColor: "text-blue-400"
    },
    {
      id: 1,
      rank: 1,
      name: "Rohan Verma",
      level: 22,
      xp: "6300 XP",
      avatar: "https://ui-avatars.com/api/?name=Rohan+Verma&background=7c3aed&color=fff",
      theme: "border-violet-500/30 bg-gradient-to-b from-[#1e103c] to-[#0a0c1a]",
      badgeColor: "bg-amber-400 text-amber-900 shadow-[0_0_20px_rgba(251,191,36,0.5)] border-2 border-white",
      starColor: "text-amber-400 fill-amber-400",
      height: "h-72",
      scale: "scale-105 z-10",
      glow: "shadow-[0_0_40px_rgba(139,92,246,0.15)]",
      textColor: "text-violet-300"
    },
    {
      id: 3,
      rank: 3,
      name: "Arjun Mehta",
      level: 17,
      xp: "3880 XP",
      avatar: "https://ui-avatars.com/api/?name=Arjun+Mehta&background=ea580c&color=fff",
      theme: "border-orange-500/20 bg-gradient-to-b from-[#1f1209] to-[#0a0c1a]",
      badgeColor: "bg-orange-400 text-orange-950 shadow-[0_0_15px_rgba(251,146,60,0.4)] border-2 border-white",
      starColor: "text-orange-500 fill-orange-500",
      height: "h-64",
      scale: "scale-100",
      glow: "shadow-[0_0_30px_rgba(234,88,12,0.1)]",
      textColor: "text-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-6 items-end mt-10 mb-8 max-w-5xl mx-auto px-4">
      {PODIUM_DATA.map((user) => (
        <div 
          key={user.id} 
          className={`relative flex flex-col items-center justify-center rounded-2xl border ${user.theme} ${user.height} ${user.scale} ${user.glow} transition-transform duration-300 hover:-translate-y-2`}
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-20 pointer-events-none flex items-center justify-center">
             <div className="w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          </div>

          {/* Rank Badge */}
          <div className={`absolute -top-5 flex h-10 w-10 items-center justify-center rounded-full text-lg font-black ${user.badgeColor}`}>
            {user.rank}
          </div>

          {/* Sparkles for Rank 1 */}
          {user.rank === 1 && (
            <div className="absolute -top-8 flex gap-4 pointer-events-none">
              <Star className="h-3 w-3 text-amber-300 fill-amber-300 opacity-70 animate-pulse" />
              <Star className="h-4 w-4 text-amber-300 fill-amber-300 opacity-90 animate-pulse delay-75 mb-4" />
              <Star className="h-3 w-3 text-amber-300 fill-amber-300 opacity-70 animate-pulse delay-150" />
            </div>
          )}

          {/* Avatar */}
          <img 
            src={user.avatar} 
            alt={user.name} 
            className={`h-20 w-20 rounded-full object-cover border-4 border-[#0a0c1a] shadow-xl mb-4 relative z-10 ${
              user.rank === 1 ? 'ring-2 ring-violet-500/50' : ''
            }`}
          />

          {/* Info */}
          <h3 className="text-base font-bold text-white relative z-10">{user.name}</h3>
          <p className="text-xs text-gray-400 mt-1 mb-4 relative z-10">Level {user.level}</p>
          
          {/* XP */}
          <div className="flex items-center gap-1.5 relative z-10">
            <Star className={`h-4 w-4 ${user.starColor}`} />
            <span className={`text-sm font-black ${user.textColor}`}>{user.xp}</span>
          </div>

        </div>
      ))}
    </div>
  );
}
