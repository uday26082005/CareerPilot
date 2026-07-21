const { AppError } = require("../../middleware/error/AppError");
const { getSupabaseAdmin } = require("../../config/supabase");
const aiService = require("../ai/gemini.service");
const { skillGapAnalysisSchema } = require("../../schemas/skillgap.schema");

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;

const buildGeminiPrompt = (targetRole, resumeText, requiredSkills) => `You are an expert AI Career Advisor and Software Engineering Mentor.
I have a user targeting the role of "${targetRole}".

Here is the raw text extracted from their resume:
"""
${resumeText}
"""

Required skills for the target role:
${JSON.stringify(requiredSkills)}

Task 1: Analyze the resume text carefully. Match the user's actual experience and skills against the required skills. Use intelligent semantic matching (e.g., if they have "MySQL" or "PostgreSQL", that matches "SQL". If they have "GitHub" or "GitLab", that matches "Git"). Be generous in your interpretation if the semantic overlap is strong.
Return two arrays: "matched_skills" (which required skills they have) and "missing_skills" (which required skills they lack). Both arrays MUST contain the names of the *required skills* exactly as provided.

Task 2: Based on the missing skills, provide a personalized learning roadmap. 
IMPORTANT: Recommend ONLY 100% FREE resources (e.g. Roadmap.sh, MDN, freeCodeCamp, MIT OpenCourseWare, YouTube, official docs). NEVER recommend paid courses.

You MUST provide AT LEAST 3 to 4 recommended_courses, AT LEAST 3 to 4 recommended_projects, and AT LEAST 3 to 4 practice_questions.
For practice_questions, provide a related topic_id. The ONLY valid topic_ids are: "dsa", "frontend", "backend", "system_design", "databases", "devops". You MUST choose one of these 6 strings for the topic_id based on what the question relates to most.

Return the data precisely following the schema.`;

const analyzeWithGemini = async (targetRole, resumeText, requiredSkills) => {
  const prompt = buildGeminiPrompt(targetRole, resumeText, requiredSkills);
  return await aiService.generateStructuredResponse(prompt, skillGapAnalysisSchema);
};

const analyzeSkillGap = async (userId) => {
  const supabase = getSupabaseAdmin();

  // 1. Fetch Profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("target_role")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    throw new AppError("Profile not found.", HTTP_STATUS_NOT_FOUND);
  }

  const targetRole = profile.target_role?.trim();
  if (!targetRole) {
    throw new AppError("Target role is not set in your profile. Please set it first.", HTTP_STATUS_UNPROCESSABLE_ENTITY);
  }

  // 2. Fetch Latest Resume Analysis
  const { data: resumeAnalysis, error: resumeError } = await supabase
    .from("resume_analysis")
    .select("id, resume_text")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (resumeError || !resumeAnalysis) {
    throw new AppError("No resume analysis found. Please analyze your resume first.", HTTP_STATUS_NOT_FOUND);
  }

  // 3. Fetch Role Template
  let { data: roleTemplate, error: templateError } = await supabase
    .from("role_skill_templates")
    .select("required_skills")
    .ilike("role_name", targetRole)
    .single();

  if (templateError || !roleTemplate) {
    // Fallback if the exact role is not found
    const { data: fallbackTemplate } = await supabase
      .from("role_skill_templates")
      .select("required_skills")
      .eq("role_name", "Software Engineer")
      .single();
    
    roleTemplate = fallbackTemplate || { required_skills: [] };
  }

  const requiredSkills = roleTemplate.required_skills || [];

  // 4. Check Cache
  const { data: existingAnalysis } = await supabase
    .from("skill_gap_analysis")
    .select("*")
    .eq("user_id", userId)
    .eq("resume_analysis_id", resumeAnalysis.id)
    .eq("role_name", targetRole)
    .single();

  if (existingAnalysis && existingAnalysis.analysis_json?.practice_questions?.[0]?.topic_id) {
    return existingAnalysis;
  }

  // 5. Backend Logic bypassed - passing full resume text to Gemini
  // 6. Call Gemini to semantically match skills directly from the resume text and generate the roadmap
  let geminiResult;
  try {
    geminiResult = await analyzeWithGemini(targetRole, resumeAnalysis.resume_text, requiredSkills);
  } catch (error) {
    console.error("Gemini skill gap analysis failed.", error);
    throw new AppError(`Failed to generate personalized learning plan with AI: ${error.message}`, HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  const matchedSkills = geminiResult.matched_skills || [];
  const missingSkills = geminiResult.missing_skills || [];
  
  const skillMatchPercentage = requiredSkills.length > 0 
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100) 
    : 0;

  // 7. Save Analysis
  const payload = {
    user_id: userId,
    resume_analysis_id: resumeAnalysis.id,
    role_name: targetRole,
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    priority_skills: geminiResult.priority_skills || [],
    recommended_projects: geminiResult.recommended_projects || [],
    recommended_resources: geminiResult.recommended_resources || [],
    learning_order: geminiResult.learning_order || [],
    skill_match_percentage: skillMatchPercentage,
    next_learning_step: geminiResult.next_learning_step || "",
    summary: geminiResult.summary || "",
    analysis_json: geminiResult
  };

  const { data: savedAnalysis, error: saveError } = await supabase
    .from("skill_gap_analysis")
    .insert(payload)
    .select()
    .single();

  if (saveError) {
    console.error("Failed to save skill gap analysis.", saveError);
    throw new AppError("Failed to save skill gap analysis.", HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  return savedAnalysis;
};

const getLatestAnalysis = async (userId) => {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("skill_gap_analysis")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is not found
    throw new AppError("Failed to fetch latest skill gap analysis.", HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  return data || null;
};

module.exports = {
  analyzeSkillGap,
  getLatestAnalysis
};
