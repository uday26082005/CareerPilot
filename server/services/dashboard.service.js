const { getSupabaseAdmin } = require("../config/supabase");
const supabase = getSupabaseAdmin();
const { AppError } = require("../middleware/error/AppError");

const fetchProfileSummary = async (userId) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  
  if (error && error.code !== "PGRST116") {
    throw new AppError(`Error fetching profile: ${error.message}`, 500);
  }
  return data || {};
};

const fetchResumeSummary = async (userId) => {
  const { data: allData, error } = await supabase
    .from("resume_analysis")
    .select("overall_score, ats_score, strengths, key_suggestions, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error && error.code !== "PGRST116") {
    throw new AppError(`Error fetching resume analysis: ${error.message}`, 500);
  }

  if (!allData || allData.length === 0) {
    // Attempt fallback to resumes table if resume_analysis is empty
    const { data: fallbackData } = await supabase
      .from("resumes")
      .select("score, strong_skills, missing_skills, improvement_tips, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
      
    if (fallbackData && fallbackData.length > 0) {
      const latest = fallbackData[fallbackData.length - 1];
      return {
        overall_score: latest.score || 0,
        ats_score: latest.score || 0,
        strong_skills: latest.strong_skills || [],
        missing_skills: latest.missing_skills || [],
        improvement_tips: latest.improvement_tips || [],
        history: fallbackData.map(r => ({ date: r.created_at, score: r.score || 0 }))
      };
    }
    return { overall_score: 0, ats_score: 0, strong_skills: [], missing_skills: [], improvement_tips: [], history: [] };
  }

  const latest = allData[allData.length - 1];
  return {
    overall_score: latest.overall_score || 0,
    ats_score: latest.ats_score || 0,
    strong_skills: latest.strengths || [],
    missing_skills: [],
    improvement_tips: latest.key_suggestions || [],
    history: allData.map(r => ({ date: r.created_at, score: r.overall_score || 0 }))
  };
};

const fetchSkillGapSummary = async (userId) => {
  const { data, error } = await supabase
    .from("skill_gap_analysis")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new AppError(`Error fetching skill gap: ${error.message}`, 500);
  }

  return {
    skill_match: data ? (data.skill_match_percentage || 0) : 0,
    missing_skills: data && data.missing_skills ? data.missing_skills.length : 0
  };
};

const fetchRoadmapSummary = async (userId) => {
  const { data: roadmap, error } = await supabase
    .from("roadmaps")
    .select("id, current_phase")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new AppError(`Error fetching roadmap: ${error.message}`, 500);
  }

  if (!roadmap) {
    return { current_phase: 0, completed_tasks: 0, pending_tasks: 0, completion: 0 };
  }

  const { data: tasks, error: tasksError } = await supabase
    .from("roadmap_tasks")
    .select("status")
    .eq("roadmap_id", roadmap.id);

  if (tasksError) {
    throw new AppError(`Error fetching roadmap tasks: ${tasksError.message}`, 500);
  }

  const completed = tasks.filter(t => t.status === "completed").length;
  const pending = tasks.filter(t => t.status !== "completed").length;
  const total = completed + pending;
  const completion = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    current_phase: roadmap.current_phase || 1,
    completed_tasks: completed,
    pending_tasks: pending,
    completion
  };
};

const fetchInterviewSummary = async (userId) => {
  // Count total interviews
  const { count, error: countError } = await supabase
    .from("interviews")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", userId);

  if (countError) {
    throw new AppError(`Error fetching interviews: ${countError.message}`, 500);
  }

  // Get stats
  const { data: stats, error: statsError } = await supabase
    .from("interview_statistics")
    .select("average_score, best_score")
    .eq("user_id", userId)
    .single();

  if (statsError && statsError.code !== "PGRST116") {
    throw new AppError(`Error fetching interview stats: ${statsError.message}`, 500);
  }

  return {
    taken: count || 0,
    average_score: stats ? Math.round(stats.average_score) : 0,
    best_score: stats ? Math.round(stats.best_score) : 0
  };
};

const fetchPracticeSummary = async (userId) => {
  const { count, error: countError } = await supabase
    .from("practice_sessions")
    .select("*", { count: 'exact', head: true })
    .eq("user_id", userId);

  if (countError) {
    throw new AppError(`Error fetching practice sessions: ${countError.message}`, 500);
  }

  const { data: stats, error: statsError } = await supabase
    .from("practice_statistics")
    .select("questions_attempted, overall_accuracy, best_category, weakest_category")
    .eq("user_id", userId)
    .single();

  if (statsError && statsError.code !== "PGRST116") {
    throw new AppError(`Error fetching practice stats: ${statsError.message}`, 500);
  }

  return {
    sessions: count || 0,
    questions_attempted: stats?.questions_attempted || 0,
    accuracy: stats ? Math.round(stats.overall_accuracy) : 0,
    best_category: stats?.best_category || "N/A",
    weakest_category: stats?.weakest_category || "N/A"
  };
};

const fetchRecentActivity = async (userId) => {
  const activities = [];

  // Fetch recent resume analysis
  const { data: resume } = await supabase
    .from("resume_analysis")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (resume) activities.push({ type: "resume_analysis", timestamp: resume.created_at, title: "Resume Analyzed" });

  // Fetch recent roadmap
  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (roadmap) activities.push({ type: "roadmap", timestamp: roadmap.created_at, title: "Career Roadmap Generated" });

  // Fetch recent interview
  const { data: interview } = await supabase
    .from("interviews")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (interview) activities.push({ type: "interview", timestamp: interview.created_at, title: "Mock Interview Completed" });

  // Fetch recent practice
  const { data: practice } = await supabase
    .from("practice_sessions")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (practice) activities.push({ type: "practice", timestamp: practice.created_at, title: "Practice Session Completed" });

  // Sort descending by timestamp
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return activities;
};

const fetchUpcomingTasks = async (userId) => {
  // Fetch pending roadmap tasks
  let roadmapTasks = [];
  const { data: roadmap } = await supabase
    .from("roadmaps")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (roadmap) {
    const { data: tasks } = await supabase
      .from("roadmap_tasks")
      .select("*")
      .eq("roadmap_id", roadmap.id)
      .neq("status", "Completed")
      .order("order_index", { ascending: true })
      .limit(5);
    
    if (tasks) {
      roadmapTasks = tasks.map((task, idx) => {
        // Assign estimated future dates for the tasks so they show up on the calendar
        const d = new Date();
        d.setDate(d.getDate() + idx + 1);
        return {
          title: task.task_title,
          subtitle: `Phase ${task.phase_number} • ${task.estimated_hours}h estimated`,
          date: d.toISOString(),
          type: "assessment"
        };
      });
    }
  }

  // Fetch custom scheduled events (future events)
  const now = new Date().toISOString();
  let scheduledEvents = [];
  const { data: events } = await supabase
    .from("user_scheduled_events")
    .select("*")
    .eq("user_id", userId)
    .gte("scheduled_at", now)
    .order("scheduled_at", { ascending: true })
    .limit(5);

  if (events) {
    scheduledEvents = events.map(ev => ({
      title: ev.title,
      subtitle: "SCHEDULED EVENT",
      date: ev.scheduled_at,
      type: ev.type
    }));
  }

  // Combine and sort by date
  const allUpcoming = [...roadmapTasks, ...scheduledEvents];
  allUpcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

  return allUpcoming.slice(0, 50);
};

const createScheduledEvent = async (userId, eventData) => {
  const payload = {
    user_id: userId,
    title: eventData.title,
    type: eventData.type,
    scheduled_at: eventData.scheduled_at
  };

  const { data, error } = await supabase
    .from("user_scheduled_events")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new AppError(error.message || "Failed to create scheduled event.", 500);
  }

  return data;
};

const fetchCompleteDashboard = async (userId) => {
  // Execute all queries in parallel
  const [
    profile,
    resume,
    skill_gap,
    roadmap,
    interviews,
    practice,
    recent_activity,
    upcoming_tasks
  ] = await Promise.all([
    fetchProfileSummary(userId),
    fetchResumeSummary(userId),
    fetchSkillGapSummary(userId),
    fetchRoadmapSummary(userId),
    fetchInterviewSummary(userId),
    fetchPracticeSummary(userId),
    fetchRecentActivity(userId),
    fetchUpcomingTasks(userId)
  ]);

  return {
    profile,
    resume,
    skill_gap,
    roadmap,
    interviews,
    practice,
    recent_activity,
    upcoming_tasks
  };
};

module.exports = {
  fetchProfileSummary,
  fetchResumeSummary,
  fetchSkillGapSummary,
  fetchRoadmapSummary,
  fetchInterviewSummary,
  fetchPracticeSummary,
  fetchRecentActivity,
  fetchUpcomingTasks,
  createScheduledEvent,
  fetchCompleteDashboard
};
