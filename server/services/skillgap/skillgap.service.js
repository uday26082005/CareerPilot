const { AppError } = require("../../middleware/error/AppError");
const { getSupabaseAdmin } = require("../../config/supabase");
const aiService = require("../ai/groq.service");
const { skillGapAnalysisSchema } = require("../../schemas/skillgap.schema");
const marketDemandService = require("./marketDemand.service");
const { evaluateRoleAndMarketSkills } = require("./semanticMatcher");

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;

const buildGroqPrompt = (targetRole, matchedSkills, missingSkills, marketFocus = []) => {
  const topMissing = Array.isArray(missingSkills) && missingSkills.length > 35 
    ? missingSkills.slice(0, 35) 
    : missingSkills;

  const marketFocusText = marketFocus.length > 0 
    ? `\nCRITICAL - Market Focus / Trending Technologies in High Demand: ${JSON.stringify(marketFocus)}.\nNOTE: Missing skills that align with these Market Focus skills MUST be prioritized first in "priority_skills" and placed at the beginning of "learning_order".` 
    : "";

  return `You are an expert AI Career Advisor and Software Engineering Mentor.
I have a user targeting the role of "${targetRole}".

Here are the skills they currently have (calculated by our NLP & semantic engine):
${JSON.stringify(matchedSkills)}

Here are the skills they are MISSING or NOT YET DETECTED for this role (prioritizing current market demand):
${JSON.stringify(topMissing)}
${marketFocusText}

Task: Based on the missing skills, provide a personalized learning roadmap. 
IMPORTANT: Recommend ONLY 100% FREE resources (e.g. Roadmap.sh, MDN, freeCodeCamp, MIT OpenCourseWare, YouTube, official docs). NEVER recommend paid courses.

You MUST provide EXACTLY 2 recommended_resources, EXACTLY 2 recommended_projects, and EXACTLY 2 practice_questions.
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
};

const analyzeWithGroq = async (targetRole, matchedSkills, missingSkills, marketFocus = []) => {
  const prompt = buildGroqPrompt(targetRole, matchedSkills, missingSkills, marketFocus);
  return await aiService.generateStructuredResponse(prompt, skillGapAnalysisSchema, { max_tokens: 2200 });
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
    .select("id, resume_text, recommended_keywords, analysis_json")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (resumeError || !resumeAnalysis) {
    throw new AppError("No resume analysis found. Please analyze your resume first.", HTTP_STATUS_NOT_FOUND);
  }

  // 3. Dynamic Market Skill Extraction (Real-Time 2026 Industry & Job Postings Intelligence)
  const marketData = await marketDemandService.getDynamicMarketSkills(targetRole, supabase);

  // 4. Semantic Role Relevance & Broader Taxonomy Evaluation
  // Evaluates candidate's skills against 50-80+ role skill universe,
  // separates the ~25 live market demand skills layer,
  // classifies detected skills across 4 relevance tiers (0.80-1.00 Highly Relevant, 0.60-0.79 Relevant, 0.40-0.59 Somewhat Relevant, 0.00-0.39 Low Relevance),
  // identifies additional role skills outside the top 25, and labels missing skills as "Not Detected".
  const candidateKeywords = [
    ...(resumeAnalysis.recommended_keywords || []),
    ...(resumeAnalysis.analysis_json?.role_fit?.strengths || [])
  ];

  const evaluation = evaluateRoleAndMarketSkills(
    targetRole,
    resumeAnalysis.resume_text,
    candidateKeywords,
    marketData
  );

  const matchedSkills = evaluation.matchedRoleSkills;
  const missingSkills = evaluation.prioritizedMissingSkills;
  const skillMatchPercentage = evaluation.roleSkillCoverage;

  // 5. Generate targeted practice recommendations using AI
  let groqResult;
  try {
    groqResult = await analyzeWithGroq(
      targetRole, 
      matchedSkills, 
      missingSkills, 
      marketData.trending_technologies || []
    );
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
    analysis_json: {
      ...groqResult,
      // Role Universe (e.g. 45 role-relevant skills)
      total_role_skills_count: evaluation.totalRoleSkillsCount,
      role_detected_count: evaluation.roleDetectedCount,
      role_gaps_count: evaluation.roleGapsCount,

      // Core & Important Competency Coverage
      role_skills_coverage: evaluation.roleSkillCoverage,
      role_coverage_details: evaluation.roleCoverageDetails,

      // Market Demand Universe (Exact 25 current-demand skills)
      total_market_skills_count: evaluation.totalMarketSkillsCount,
      market_detected_count: evaluation.marketDetectedCount,
      market_gaps_count: evaluation.marketGapsCount,
      market_demand_alignment: evaluation.marketDemandAlignment,
      market_demand_details: evaluation.marketDemandDetails,

      // Canonical Lists
      role_universe_skills: evaluation.roleUniverseSkills,
      role_skills_detected: evaluation.roleSkillsDetected,
      role_skills_gaps: evaluation.roleSkillsGaps,
      market_demand_layer: evaluation.marketDemandLayer,
      additional_role_skills: evaluation.additionalRoleSkills,
      categorized_gaps: evaluation.categorizedGaps,
      radar_data: evaluation.radarData,

      market_intelligence: {
        is_live_market: marketData.is_live_market,
        market_demand_summary: marketData.market_demand_summary,
        trending_technologies: marketData.trending_technologies || [],
        extracted_at: marketData.extracted_at,
        source: marketData.is_live_market ? "Live 2026 Industry Demand Engine" : "Industry Baseline"
      }
    }
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
