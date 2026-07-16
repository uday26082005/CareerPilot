import { ClipboardList, Target, TrendingUp, Briefcase } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import ProgressChart from "../components/dashboard/ProgressChart";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";
import RoadmapWidget from "../components/dashboard/RoadmapWidget";
import AIRecommendations from "../components/dashboard/AIRecommendations";

const MOCK_DATA = {
  progressData: [
    { day: 'May 12', value: 10 },
    { day: 'May 13', value: 25 },
    { day: 'May 14', value: 38 },
    { day: 'May 15', value: 48 },
    { day: 'May 16', value: 55 },
    { day: 'May 17', value: 75 },
    { day: 'May 18', value: 87 },
  ],
  sparkline1: [{ value: 30 }, { value: 40 }, { value: 35 }, { value: 50 }, { value: 65 }, { value: 60 }, { value: 87 }],
  sparkline2: [{ value: 40 }, { value: 30 }, { value: 55 }, { value: 45 }, { value: 70 }, { value: 65 }, { value: 76 }],
  sparkline3: [{ value: 1 }, { value: 2 }, { value: 2 }, { value: 3 }, { value: 2 }, { value: 3 }, { value: 4 }],
  sparkline4: [{ value: 2 }, { value: 2 }, { value: 3 }, { value: 4 }, { value: 5 }, { value: 5 }, { value: 6 }],
  upcoming: [
    { title: "Mock Interview", subtitle: "Frontend Developer", date: "May 20, 2025", time: "10:00 AM", type: "interview" },
    { title: "Resume Review", subtitle: "By AI Coach", date: "May 21, 2025", time: "09:30 AM", type: "review" },
    { title: "Skill Assessment", subtitle: "Data Structures & Algorithms", date: "May 22, 2025", time: "02:00 PM", type: "assessment" },
  ],
  roadmapSteps: [
    { title: "Resume Optimization", status: "completed" },
    { title: "Skills Gap Analysis", status: "completed" },
    { title: "Mock Interviews", status: "in_progress" },
    { title: "Apply to Jobs", status: "pending" },
    { title: "Track & Improve", status: "pending" },
  ],
  recommendations: [
    { title: "Improve Your Resume", desc: "Add metrics and quantify your achievements to stand out.", type: "resume" },
    { title: "Focus on Key Skills", desc: "Strengthen Data Structures, System Design, and SQL.", type: "skills" },
    { title: "Practice Mock Interviews", desc: "Regular practice will boost your confidence and performance.", type: "interview" },
    { title: "Explore New Opportunities", desc: "Based on your profile, these roles could be a great fit.", type: "jobs" },
  ]
};

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      
      {/* Stats Row */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Resume Score"
          value="87"
          subtitle="/100 Excellent"
          subtitleColor="text-emerald-400"
          icon={ClipboardList}
          iconBgColor="bg-violet-500/10"
          iconColor="text-violet-400"
          chartData={MOCK_DATA.sparkline1}
          chartColor="#8b5cf6"
        />
        <StatCard 
          title="Skills Matched"
          value="76%"
          subtitle="Strong Match"
          subtitleColor="text-blue-400"
          icon={Target}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-400"
          chartData={MOCK_DATA.sparkline2}
          chartColor="#3b82f6"
        />
        <StatCard 
          title="Mock Interviews"
          value="4"
          subtitle="+2 this week"
          subtitleColor="text-emerald-400"
          icon={TrendingUp}
          iconBgColor="bg-emerald-500/10"
          iconColor="text-emerald-400"
          chartData={MOCK_DATA.sparkline3}
          chartColor="#10b981"
        />
        <StatCard 
          title="Applications"
          value="6"
          subtitle="2 in review"
          subtitleColor="text-orange-400"
          icon={Briefcase}
          iconBgColor="bg-orange-500/10"
          iconColor="text-orange-400"
          chartData={MOCK_DATA.sparkline4}
          chartColor="#f97316"
        />
      </div>

      {/* Charts & Events Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressChart data={MOCK_DATA.progressData} />
        </div>
        <div className="lg:col-span-1">
          <UpcomingEvents events={MOCK_DATA.upcoming} />
        </div>
      </div>

      {/* Roadmap & Recommendations Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RoadmapWidget steps={MOCK_DATA.roadmapSteps} />
        </div>
        <div className="lg:col-span-1">
          <AIRecommendations recommendations={MOCK_DATA.recommendations} />
        </div>
      </div>

    </div>
  );
}
