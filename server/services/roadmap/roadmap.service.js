const { AppError } = require("../../middleware/error/AppError");
const { getSupabaseAdmin } = require("../../config/supabase");
const aiService = require("../ai/groq.service");
const { generateRoadmapSchema } = require("../../schemas/roadmap.schema");

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;

const buildRoadmapPrompt = (profile, skillGap) => {
  return `You are an expert AI Career Advisor and Tech Mentor.
Generate a personalized, structured learning roadmap for a professional software engineer.

User Profile:
- Current Role: ${profile.current_role || "Not specified"}
- Target Role: ${profile.target_role || "Not specified"}
- Years of Experience: ${profile.years_experience || 0}

Analysis Data:
- Missing Skills (needs to learn): ${JSON.stringify(skillGap.missing_skills)}
- Priority Skills (most important): ${JSON.stringify(skillGap.priority_skills)}
- Recommended Learning Order: ${JSON.stringify(skillGap.learning_order)}

TASK:
Organize the learning journey into logical phases based on the missing skills and priority skills.
Do NOT recalculate or introduce new technical skills outside of the provided scope. Just structure them logically.

For each phase:
- Create a title and short description.
- Estimate duration.
- List the skills covered in this phase.
- Break down learning into specific tasks with estimated hours. Recommend ONE 100% FREE learning resource (URL) per task (e.g., Roadmap.sh, MDN, freeCodeCamp, YouTube, docs). NEVER recommend paid courses.
- Suggest ONE practical project per phase (if applicable, else empty array).
- Add a concluding milestone.

Return a JSON object with the following exact structure:
{
  "estimated_duration": "string",
  "summary": "string",
  "phases": [
    {
      "phase_number": 1,
      "title": "string",
      "description": "string",
      "estimated_duration": "string",
      "skills": ["string"],
      "tasks": [
        {
          "title": "string",
          "description": "string",
          "estimated_hours": 10,
          "resource": {
            "title": "string",
            "url": "string",
            "type": "string"
          }
        }
      ],
      "projects": [
        {
          "title": "string",
          "description": "string"
        }
      ],
      "milestone": "string"
    }
  ]
}
Return the response exactly matching this JSON structure.`;
};

const formatRoadmapResponse = (roadmap, tasks) => {
  const jsonOutput = { ...roadmap };
  
  if (tasks && tasks.length > 0) {
    // Reconstruct the phases based on tasks
    const phasesMap = new Map();
    
    // Group tasks by phase
    tasks.forEach(task => {
      const pn = task.phase_number;
      if (!phasesMap.has(pn)) {
        // Find phase from original json
        const origPhase = roadmap.roadmap_json?.phases?.find(p => p.phase_number === pn) || {};
        
        phasesMap.set(pn, {
          phase_number: pn,
          title: origPhase.title || `Phase ${pn}`,
          description: origPhase.description || "",
          estimated_duration: origPhase.estimated_duration || "",
          skills: origPhase.skills || [],
          projects: origPhase.projects || [],
          milestone: origPhase.milestone || "",
          milestone: origPhase.milestone || "",
          tasks: []
        });
      }
      
      phasesMap.get(pn).tasks.push({
        id: task.id,
        title: task.task_title,
        description: task.task_description,
        estimated_hours: task.estimated_hours,
        status: task.status,
        resource: task.resource_title ? {
          title: task.resource_title,
          url: task.resource_url,
          type: task.resource_type
        } : null
      });
    });

    const structuredPhases = Array.from(phasesMap.values()).sort((a, b) => a.phase_number - b.phase_number);
    jsonOutput.phases = structuredPhases;
  } else {
    jsonOutput.phases = roadmap.roadmap_json?.phases || [];
  }
  
  delete jsonOutput.roadmap_json;
  return jsonOutput;
};

const _generateAndSaveRoadmap = async (userId, profile, resumeAnalysis, skillGapAnalysis, supabase) => {
  // Call AI Orchestrator
  const prompt = buildRoadmapPrompt(profile, skillGapAnalysis);
  
  let aiRoadmap;
  try {
    aiRoadmap = await aiService.generateStructuredResponse(prompt, generateRoadmapSchema);
  } catch (error) {
    console.error("Groq roadmap generation failed.", error);
    throw new AppError(`Failed to generate roadmap: ${error.message}`, HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  // 1. Save Roadmap
  const roadmapPayload = {
    user_id: userId,
    resume_analysis_id: resumeAnalysis.id,
    skill_gap_analysis_id: skillGapAnalysis.id,
    current_position: profile.current_role || "Unknown",
    target_role: profile.target_role || "Unknown",
    years_experience: profile.years_experience || 0,
    estimated_duration: aiRoadmap.estimated_duration || "",
    summary: aiRoadmap.summary || "",
    roadmap_json: aiRoadmap,
    completion_percentage: 0,
    current_phase: 1
  };

  const { data: savedRoadmap, error: roadmapError } = await supabase
    .from("roadmaps")
    .insert(roadmapPayload)
    .select()
    .single();

  if (roadmapError) {
    throw new AppError("Failed to save roadmap.", HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  // 2. Extract and Save Tasks
  const tasksToInsert = [];
  let orderCounter = 1;

  aiRoadmap.phases.forEach((phase) => {
    if (phase.tasks && phase.tasks.length > 0) {
      phase.tasks.forEach((task) => {
        tasksToInsert.push({
          roadmap_id: savedRoadmap.id,
          phase_number: phase.phase_number,
          task_title: task.title,
          task_description: task.description,
          estimated_hours: task.estimated_hours,
          resource_title: task.resource?.title || null,
          resource_url: task.resource?.url || null,
          resource_type: task.resource?.type || null,
          status: 'Pending',
          order_index: orderCounter++
        });
      });
    }
  });

  let savedTasks = [];
  if (tasksToInsert.length > 0) {
    const { data: insertedTasks, error: tasksError } = await supabase
      .from("roadmap_tasks")
      .insert(tasksToInsert)
      .select();

    if (tasksError) {
      throw new AppError("Failed to save roadmap tasks.", HTTP_STATUS_INTERNAL_SERVER_ERROR);
    }
    savedTasks = insertedTasks;
  }

  return formatRoadmapResponse(savedRoadmap, savedTasks);
};

const generateRoadmap = async (userId) => {
  const supabase = getSupabaseAdmin();

  // 1. Fetch Profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    throw new AppError("Profile not found.", HTTP_STATUS_NOT_FOUND);
  }

  // 2. Fetch Latest Resume Analysis
  const { data: resumeAnalysis, error: resumeError } = await supabase
    .from("resume_analysis")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (resumeError || !resumeAnalysis) {
    throw new AppError("No resume analysis found.", HTTP_STATUS_NOT_FOUND);
  }

  // 3. Fetch Latest Skill Gap Analysis
  const { data: skillGapAnalysis, error: skillGapError } = await supabase
    .from("skill_gap_analysis")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (skillGapError || !skillGapAnalysis) {
    throw new AppError("No skill gap analysis found.", HTTP_STATUS_NOT_FOUND);
  }

  // 4. Check for existing roadmap to avoid unnecessary regeneration
  const { data: existingRoadmap } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("user_id", userId)
    .eq("resume_analysis_id", resumeAnalysis.id)
    .eq("skill_gap_analysis_id", skillGapAnalysis.id)
    .eq("target_role", profile.target_role || "")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (existingRoadmap) {
    // If it exists and matches current context, just return it
    const { data: tasks } = await supabase
      .from("roadmap_tasks")
      .select("*")
      .eq("roadmap_id", existingRoadmap.id)
      .order("order_index", { ascending: true });
      
    return formatRoadmapResponse(existingRoadmap, tasks || []);
  }

  return await _generateAndSaveRoadmap(userId, profile, resumeAnalysis, skillGapAnalysis, supabase);
};

const getLatestRoadmap = async (userId) => {
  const supabase = getSupabaseAdmin();

  const { data: roadmap, error: roadmapError } = await supabase
    .from("roadmaps")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (roadmapError && roadmapError.code !== 'PGRST116') {
    throw new AppError("Failed to fetch latest roadmap.", HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  if (!roadmap) return null;

  const { data: tasks } = await supabase
    .from("roadmap_tasks")
    .select("*")
    .eq("roadmap_id", roadmap.id)
    .order("order_index", { ascending: true });

  return formatRoadmapResponse(roadmap, tasks || []);
};

const getRoadmapHistory = async (userId, { limit = 10, offset = 0 }) => {
  const supabase = getSupabaseAdmin();
  const { data, error, count } = await supabase
    .from("roadmaps")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new AppError("Failed to fetch roadmap history.", HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  return {
    items: data, // Could format if tasks are needed for list view, but usually not
    pagination: { limit, offset, total: count || 0 },
  };
};

const updateTaskStatus = async (userId, taskId, newStatus) => {
  const supabase = getSupabaseAdmin();

  // Validate the task belongs to the user
  const { data: task, error: taskError } = await supabase
    .from("roadmap_tasks")
    .select("*, roadmaps!inner(id, user_id)")
    .eq("id", taskId)
    .single();

  if (taskError || !task || task.roadmaps.user_id !== userId) {
    throw new AppError("Task not found or unauthorized.", HTTP_STATUS_NOT_FOUND);
  }

  const completedAt = newStatus === 'Completed' ? new Date().toISOString() : null;

  const { error: updateError } = await supabase
    .from("roadmap_tasks")
    .update({ status: newStatus, completed_at: completedAt })
    .eq("id", taskId);

  if (updateError) {
    throw new AppError("Failed to update task status.", HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  // Recalculate completion percentage
  const { data: allTasks } = await supabase
    .from("roadmap_tasks")
    .select("status, phase_number")
    .eq("roadmap_id", task.roadmap_id);

  if (allTasks && allTasks.length > 0) {
    const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
    const completionPercentage = Math.round((completedTasks / allTasks.length) * 100);
    
    // Determine current phase (first phase that has pending/in-progress tasks, or max phase if all completed)
    let currentPhase = 1;
    const maxPhase = Math.max(...allTasks.map(t => t.phase_number));
    
    for (let p = 1; p <= maxPhase; p++) {
      const phaseTasks = allTasks.filter(t => t.phase_number === p);
      if (phaseTasks.length > 0 && phaseTasks.some(t => t.status !== 'Completed')) {
        currentPhase = p;
        break;
      }
      currentPhase = p; // if loop finishes without break, it will be maxPhase
    }

    await supabase
      .from("roadmaps")
      .update({ 
        completion_percentage: completionPercentage,
        current_phase: currentPhase
      })
      .eq("id", task.roadmap_id);
  }

  return { success: true, taskId, newStatus };
};

const regenerateRoadmap = async (userId) => {
  const supabase = getSupabaseAdmin();

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();
  const { data: resumeAnalysis } = await supabase.from("resume_analysis").select("id").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).single();
  const { data: skillGapAnalysis } = await supabase.from("skill_gap_analysis").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).single();

  if (!profile || !resumeAnalysis || !skillGapAnalysis) {
    throw new AppError("Missing required profile, resume, or skill gap data to regenerate roadmap.", HTTP_STATUS_UNPROCESSABLE_ENTITY);
  }

  // Bypass cache check and force new AI generation
  return await _generateAndSaveRoadmap(userId, profile, resumeAnalysis, skillGapAnalysis, supabase);
};

module.exports = {
  generateRoadmap,
  getLatestRoadmap,
  getRoadmapHistory,
  updateTaskStatus,
  regenerateRoadmap
};
