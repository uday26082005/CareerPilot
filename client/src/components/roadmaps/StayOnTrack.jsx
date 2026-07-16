import { Target } from "lucide-react";

export default function StayOnTrack() {
  return (
    <div className="flex flex-col rounded-2xl border border-violet-500/20 bg-gradient-to-br from-indigo-950 to-[#0a0c1a] p-6 shadow-xl relative overflow-hidden">
      
      {/* Background glow element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-600/20 rounded-full blur-[50px] pointer-events-none" />

      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white shrink-0 shadow-lg">
          <Target className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white mb-1">Stay on Track!</h3>
          <p className="text-[10px] text-gray-300">Consistency is the key to success.</p>
        </div>
      </div>

      <button className="w-full mt-2 rounded-lg bg-violet-600 py-3 text-[11px] font-bold text-white transition-colors hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.4)] relative z-10">
        Mark Today's Progress
      </button>

    </div>
  );
}
