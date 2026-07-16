import { Trophy, Info } from "lucide-react";
import TopPodium from "../components/leaderboard/TopPodium";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";

export default function Leaderboard() {
  return (
    <div className="flex flex-col gap-6 pb-6 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Leaderboard <Trophy className="h-6 w-6 text-violet-500" />
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          See how you rank among other learners and stay motivated to grow every day.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-white/10 pb-4">
        <button className="text-sm font-bold text-violet-400 relative">
          Overall
          <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-violet-500" />
        </button>
        <button className="text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors">
          This Week
        </button>
        <button className="text-sm font-medium text-gray-500 hover:text-gray-300 transition-colors">
          This Month
        </button>
      </div>

      {/* Podium */}
      <div className="mt-2">
        <TopPodium />
      </div>

      {/* Table */}
      <div className="mt-4">
        <LeaderboardTable />
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <Info className="h-4 w-4 shrink-0" />
        XP points are earned by completing tasks, mock interviews, and daily goals.
      </div>
    </div>
  );
}
