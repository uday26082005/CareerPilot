import { ClipboardList, Target, TrendingUp, Briefcase, FileText, CheckCircle, Activity, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import StatCard from "../components/dashboard/StatCard";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";
import RoadmapWidget from "../components/dashboard/RoadmapWidget";
import AIRecommendations from "../components/dashboard/AIRecommendations";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Dashboard() {
  const { session } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    if (!session?.access_token) return;
    try {
      const { data: res } = await axios.get(`${API_BASE_URL}/dashboard`, {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      
      const data = res.data;
      if (!data.profile || !data.profile.target_role) {
        console.log("Incomplete profile found, redirecting to onboarding...");
        navigate("/onboarding");
        return;
      }
      
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [session, navigate]);

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center text-slate-500">Loading your AI Dashboard...</div>;
  }

  if (error) {
    return <div className="flex h-[60vh] items-center justify-center text-red-500">{error}</div>;
  }

  if (!dashboardData || !dashboardData.profile?.target_role) {
    return <Navigate to="/onboarding" replace />;
  }

  const { profile, resume, skill_gap, roadmap, interviews, practice, upcoming_tasks } = dashboardData;

  const generateSummary = (tip) => {
    let summary = tip.split(",")[0];
    summary = summary.split(" to ")[0];
    summary = summary.replace(/such as.*/, "").trim();
    return summary;
  };

  const dynamicRecommendations = (resume?.improvement_tips || []).map((tip) => {
    // tip is an object: { title: "...", description: "..." }
    const titleText = tip.title || tip;
    const summary = generateSummary(titleText);
    const formattedSummary = summary.charAt(0).toLowerCase() + summary.slice(1);
    
    return {
      title: titleText,
      question: `How can I ${formattedSummary}?`,
      desc: tip.description || "",
      type: "resume"
    };
  });


  // Map Upcoming Tasks to UpcomingEvents component visually
  let dynamicUpcoming = [...(upcoming_tasks || [])];
  
  if (dynamicUpcoming.length === 0) {
    const today = new Date();
    dynamicUpcoming.push({ 
      title: "Start your journey", 
      subtitle: profile?.target_role || "Target Role", 
      date: today.toISOString(), 
      type: "assessment" 
    });
  }

  // Generate dynamic roadmap from backend summary
  const dynamicRoadmap = [
    { title: "Profile Creation", status: profile?.target_role ? "completed" : "pending" },
    { title: "AI Resume Analysis", status: (resume?.overall_score > 0 || resume?.strong_skills?.length > 0) ? "completed" : "pending" },
    { title: "Skill Gap Check", status: (skill_gap?.skill_match > 0 || skill_gap?.missing_skills > 0) ? "completed" : "pending" },
    { title: "Mock Interviews", status: interviews?.taken > 0 ? "completed" : "pending" },
    { title: "Practice Arena", status: practice?.sessions > 0 ? "completed" : "pending" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-6">
      
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-8 backdrop-blur-md">
        <h1 className="text-3xl font-black mb-2 text-slate-900 dark:text-white">
          Welcome back, <span className="text-violet-400">{profile?.full_name || 'Explorer'}</span>! 👋
        </h1>
        <p className="text-slate-600 dark:text-gray-400 text-lg leading-relaxed text-justify w-full block">
          {resume?.summary || "Ready to land your next dream role? Let's get to work on optimizing your profile."}
        </p>
      </div>
      
      {/* Stats Row 1: Profile & Resume */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Resume Score"
          value={resume?.overall_score || "N/A"}
          subtitle={`ATS: ${resume?.ats_score || "N/A"}/100`}
          subtitleColor={resume?.overall_score > 80 ? "text-emerald-400" : "text-yellow-400"}
          icon={ClipboardList}
          iconBgColor="bg-violet-500/10"
          iconColor="text-violet-400"
          chartData={[]}
          chartColor="#8b5cf6"
        />
        <StatCard 
          title="Skill Match"
          value={`${skill_gap?.skill_match || 0}%`}
          subtitle={`${skill_gap?.missing_skills || 0} Missing Skills`}
          subtitleColor="text-blue-400"
          icon={Target}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-400"
          chartData={[]}
          chartColor="#3b82f6"
        />
        <StatCard 
          title="Target Role"
          value={profile?.target_role || "Not Set"}
          subtitle={`${profile?.years_experience || 0} Yrs Experience`}
          subtitleColor="text-fuchsia-400"
          icon={Briefcase}
          iconBgColor="bg-fuchsia-500/10"
          iconColor="text-fuchsia-400"
          chartData={[]}
          chartColor="#d946ef"
        />
      </div>

      {/* Stats Row 2: Roadmap, Interviews, Practice */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Roadmap Progress"
          value={`${roadmap?.completion || 0}%`}
          subtitle={`${roadmap?.completed_tasks}/${roadmap?.completed_tasks + roadmap?.pending_tasks} Tasks Completed`}
          subtitleColor="text-emerald-400"
          icon={CheckCircle}
          iconBgColor="bg-emerald-500/10"
          iconColor="text-emerald-400"
          chartData={[]}
          chartColor="#10b981"
        />
        <StatCard 
          title="Interviews"
          value={interviews?.taken || 0}
          subtitle={`Avg Score: ${interviews?.average_score || 0} | Best: ${interviews?.best_score || 0}`}
          subtitleColor="text-amber-400"
          icon={FileText}
          iconBgColor="bg-amber-500/10"
          iconColor="text-amber-400"
          chartData={[]}
          chartColor="#f59e0b"
        />
        <StatCard 
          title="Practice Arena"
          value={practice?.sessions || 0}
          subtitle={`Accuracy: ${practice?.accuracy || 0}% | Best: ${practice?.best_category}`}
          subtitleColor="text-cyan-400"
          icon={Activity}
          iconBgColor="bg-cyan-500/10"
          iconColor="text-cyan-400"
          chartData={[]}
          chartColor="#06b6d4"
        />
      </div>

      {/* Events Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <UpcomingEvents events={dynamicUpcoming} onEventCreated={fetchDashboardData} />
        </div>
      </div>

      {/* Roadmap & Recommendations Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RoadmapWidget steps={dynamicRoadmap} />
        </div>
        <div className="lg:col-span-1">
          {dynamicRecommendations.length > 0 ? (
            <AIRecommendations recommendations={dynamicRecommendations} />
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 h-full flex items-center justify-center text-slate-500">
              No AI recommendations available.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
