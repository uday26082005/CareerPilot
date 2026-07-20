import { ClipboardList, Target, TrendingUp, Briefcase, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import StatCard from "../components/dashboard/StatCard";
import ProgressChart from "../components/dashboard/ProgressChart";
import UpcomingEvents from "../components/dashboard/UpcomingEvents";
import RoadmapWidget from "../components/dashboard/RoadmapWidget";
import AIRecommendations from "../components/dashboard/AIRecommendations";

// MOCK_DATA removed as we will generate everything dynamically!

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [resume, setResume] = useState(null);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const { data: pData, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        
        // If there's an error finding the profile, or if the profile is missing crucial onboarding data
        if (error || !pData || !pData.target_role) {
          console.log("Incomplete profile found, redirecting to onboarding...");
          navigate("/onboarding");
          return;
        }
        
        setProfile(pData);
        
        const { data: rData } = await supabase.from('resumes').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
        if (rData && rData.length > 0) {
          setAllResumes(rData);
          setResume(rData[rData.length - 1]);
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center text-slate-500">Loading your AI Dashboard...</div>;
  }

  if (!profile || !profile.target_role) {
    return <Navigate to="/onboarding" replace />;
  }

  const generateSummary = (tip) => {
    let summary = tip.split(",")[0];
    summary = summary.split(" to ")[0];
    summary = summary.replace(/such as.*/, "").trim();
    return summary;
  };

  const dynamicRecommendations = resume?.improvement_tips?.map((tip) => {
    const summary = generateSummary(tip);
    const formattedSummary = summary.charAt(0).toLowerCase() + summary.slice(1);
    
    return {
      title: tip,
      question: `How can I ${formattedSummary}?`,
      desc: "",
      type: "resume"
    };
  }) || [];

  // Generate dynamic progress chart data using actual historical resumes
  const dynamicProgressData = allResumes.map(r => {
    const d = new Date(r.created_at);
    return {
      day: `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`,
      value: r.score || 0
    };
  });
  
  // If there's only one point, add a baseline dot so a line can be drawn
  if (dynamicProgressData.length === 1) {
    const d = new Date(allResumes[0].created_at);
    d.setDate(d.getDate() - 1);
    dynamicProgressData.unshift({
      day: `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`,
      value: 0
    });
  }

  const score = resume?.score || 0;
  const numSkills = resume?.strong_skills?.length || 0;

  // Generate actual historical sparklines based on all user resumes
  const historicalScores = allResumes.map(r => ({ value: r.score || 0 }));
  const dynamicSparkline1 = historicalScores.length > 1 ? historicalScores : [{ value: score }, { value: score }];

  const historicalSkills = allResumes.map(r => ({ value: r.strong_skills?.length || 0 }));
  const dynamicSparkline2 = historicalSkills.length > 1 ? historicalSkills : [{ value: numSkills }, { value: numSkills }];
  
  // Target Role doesn't have a numerical progression, so we remove the sparkline
  const dynamicSparkline3 = [];

  // Generate dynamic upcoming events based on missing skills
  const missingSkills = resume?.missing_skills || [];
  const dynamicUpcoming = missingSkills.slice(0, 3).map((skill, idx) => {
    const dates = ["Tomorrow", "In 3 Days", "Next Week"];
    const times = ["10:00 AM", "02:00 PM", "04:30 PM"];
    return {
      title: `Learn ${skill}`,
      subtitle: `Skill Gap Identified`,
      date: dates[idx] || "Soon",
      time: times[idx] || "Anytime",
      type: idx === 0 ? "review" : idx === 1 ? "assessment" : "interview"
    };
  });
  if (dynamicUpcoming.length === 0) {
    dynamicUpcoming.push({ title: "Apply to Jobs", subtitle: profile?.target_role || "Target Role", date: "Tomorrow", time: "Morning", type: "assessment" });
  }

  // Generate dynamic roadmap
  const dynamicRoadmap = [
    { title: "Profile Creation", status: "completed" },
    { title: "AI Resume Analysis", status: "completed" },
    { title: missingSkills.length > 0 ? `Master ${missingSkills[0]}` : "Mock Interviews", status: "in_progress" },
    { title: `Apply for ${profile?.target_role || "Roles"}`, status: "pending" },
    { title: "Land the Job!", status: "pending" },
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
      
      {/* Stats Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard 
          title="Resume AI Score"
          value={resume?.score || "N/A"}
          subtitle="/100 Overall Strength"
          subtitleColor={resume?.score > 80 ? "text-emerald-400" : "text-yellow-400"}
          icon={ClipboardList}
          iconBgColor="bg-violet-500/10"
          iconColor="text-violet-400"
          chartData={dynamicSparkline1}
          chartColor="#8b5cf6"
        />
        <StatCard 
          title="Strong Skills"
          value={resume?.strong_skills?.length || 0}
          subtitle="Identified by AI"
          subtitleColor="text-blue-400"
          icon={Target}
          iconBgColor="bg-blue-500/10"
          iconColor="text-blue-400"
          chartData={dynamicSparkline2}
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
          chartData={dynamicSparkline3}
          chartColor="#d946ef"
        />
      </div>

      {/* Charts & Events Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProgressChart data={dynamicProgressData} />
        </div>
        <div className="lg:col-span-1">
          <UpcomingEvents events={dynamicUpcoming} />
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
