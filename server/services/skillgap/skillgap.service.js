const { AppError } = require("../../middleware/error/AppError");
const { getSupabaseAdmin } = require("../../config/supabase");
const aiService = require("../ai/groq.service");
const { skillGapAnalysisSchema } = require("../../schemas/skillgap.schema");

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;

const buildGroqPrompt = (targetRole, matchedSkills, missingSkills) => `You are an expert AI Career Advisor and Software Engineering Mentor.
I have a user targeting the role of "${targetRole}".

Here are the skills they currently have (calculated by our NLP engine):
${JSON.stringify(matchedSkills)}

Here are the skills they are MISSING for this role:
${JSON.stringify(missingSkills)}

Task: Based on the missing skills, provide a personalized learning roadmap. 
IMPORTANT: Recommend ONLY 100% FREE resources (e.g. Roadmap.sh, MDN, freeCodeCamp, MIT OpenCourseWare, YouTube, official docs). NEVER recommend paid courses.

You MUST provide EXACTLY 2 recommended_courses, EXACTLY 2 recommended_projects, and EXACTLY 2 practice_questions.
For practice_questions, provide a related topic_id. The ONLY valid topic_ids are: "dsa", "frontend", "backend", "system_design", "databases", "devops". You MUST choose one of these 6 strings for the topic_id based on what the question relates to most.
Each practice question must target a distinct missing or priority skill. Its title should be a short, accurate practice focus for that topic (not a fixed coding-problem name), because the Practice Arena generates the actual question dynamically when the user opens it.

Return the data as a JSON object precisely following this exact JSON structure. Do NOT add any extra keys, and do not use markdown outside of the JSON block:
{
  "priority_skills": ["skill3"],
  "recommended_projects": [{ "title": "string", "description": "string", "difficulty": "string" }],
  "recommended_resources": [{ "title": "string", "type": "string", "url": "string" }],
  "practice_questions": [{ "title": "string", "platform": "string", "url": "string", "topic_id": "string" }],
  "learning_order": ["step 1", "step 2"],
  "summary": "string",
  "next_learning_step": "string"
}
`;

const { matchSkills } = require("../../utils/nlp");

const analyzeWithGroq = async (targetRole, matchedSkills, missingSkills) => {
  const prompt = buildGroqPrompt(targetRole, matchedSkills, missingSkills);
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

  // Normalize search for common roles (like fullstack -> full stack)
  let normalizedRole = targetRole.toLowerCase().replace(/fullstack/g, 'full stack');
  let searchPattern = `%${normalizedRole.split(/\s+/).join('%')}%`;

  // 3. Fetch Role Template
  let { data: roleTemplate, error: templateError } = await supabase
    .from("role_skill_templates")
    .select("required_skills")
    .ilike("role_name", searchPattern)
    .single();

  if (templateError || !roleTemplate) {
    // Second fallback: try just the first word
    const firstWord = normalizedRole.split(' ')[0];
    const { data: fallback1 } = await supabase
      .from("role_skill_templates")
      .select("required_skills")
      .ilike("role_name", `%${firstWord}%`)
      .limit(1)
      .single();
    
    roleTemplate = fallback1;
  }

  if (!roleTemplate) {
    // Final Fallback if the exact role is not found
    const { data: fallbackTemplate } = await supabase
      .from("role_skill_templates")
      .select("required_skills")
      .eq("role_name", "Software Engineer")
      .single();
    
    roleTemplate = fallbackTemplate || { required_skills: [] };
  }

  const requiredSkills = roleTemplate.required_skills || [];

  // 4. Custom NLP Skill Matching Algorithm (Jaccard Similarity)
  const nlpResult = matchSkills(resumeAnalysis.resume_text, requiredSkills);
  const matchedSkills = nlpResult.matchedSkills;
  const missingSkills = nlpResult.missingSkills;
  const skillMatchPercentage = nlpResult.matchPercentage;

  // 5. Generate a fresh set of targeted practice recommendations using AI
  let groqResult;
  try {
    groqResult = await analyzeWithGroq(targetRole, matchedSkills, missingSkills);
  } catch (error) {
    console.error("Groq skill gap analysis failed.", error);
    throw new AppError(`Failed to generate personalized learning plan with AI: ${error.message}`, HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  // 6. Save Analysis
  const payload = {
    user_id: userId,
    resume_analysis_id: resumeAnalysis.id,
    role_name: targetRole,
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    priority_skills: groqResult.priority_skills || [],
    recommended_projects: groqResult.recommended_projects || [],
    recommended_resources: groqResult.recommended_resources || [],
    learning_order: groqResult.learning_order || [],
    skill_match_percentage: skillMatchPercentage,
    next_learning_step: groqResult.next_learning_step || "",
    summary: groqResult.summary || "",
    analysis_json: groqResult
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
