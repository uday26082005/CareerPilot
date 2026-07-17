import HeroBanner from "../components/interviews/HeroBanner";
import InterviewProgress from "../components/interviews/InterviewProgress";
import InterviewTypes from "../components/interviews/InterviewTypes";
import InterviewHistory from "../components/interviews/InterviewHistory";
import InterviewTips from "../components/interviews/InterviewTips";

export default function MockInterviews() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mock Interviews</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Practice real interview scenarios, get AI feedback and improve your confidence.
        </p>
      </div>

      {/* Top Row: Hero and Progress */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <HeroBanner />
        </div>
        <div className="lg:col-span-2">
          <InterviewProgress />
        </div>
      </div>

      {/* Middle Row: Interview Types */}
      <div>
        <InterviewTypes />
      </div>

      {/* Bottom Row: History and Tips */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <InterviewHistory />
        </div>
        <div className="lg:col-span-2">
          <InterviewTips />
        </div>
      </div>
    </div>
  );
}
