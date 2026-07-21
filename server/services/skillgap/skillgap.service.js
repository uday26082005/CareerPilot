const { AppError } = require("../../middleware/error/AppError");
const { getSupabaseAdmin } = require("../../config/supabase");
const { getGeminiClient, geminiModel } = require("../../config/gemini");
const { skillGapAnalysisSchema } = require("../../schemas/skillgap.schema");

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_UNPROCESSABLE_ENTITY = 422;

const extractJson = (text) => {
  let jsonString = text;
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (match) {
    jsonString = match[1];
  }
  
  // Try to remove trailing commas which commonly break JSON.parse
  jsonString = jsonString.replace(/,\s*([\]}])/g, '$1');

  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Raw JSON string that failed to parse:", jsonString);
    throw error;
  }
};

const buildGeminiPrompt = (targetRole, matchedSkills, missingSkills) => `You are an expert AI Career Advisor and Software Engineering Mentor.
I have analyzed a user's skills against their target role of "${targetRole}".

Matched Skills: ${JSON.stringify(matchedSkills)}
Missing Skills: ${JSON.stringify(missingSkills)}

Based on this gap, provide a personalized learning roadmap. 
IMPORTANT: Recommend ONLY 100% FREE resources (e.g. Roadmap.sh, MDN, freeCodeCamp, MIT OpenCourseWare, YouTube, official docs). NEVER recommend paid courses.

Return exactly one valid JSON object. Do not include markdown formatting, trailing commas, or any text outside the JSON object. 
Ensure all quotation marks within string values are properly escaped (\\" instead of ").

Required JSON shape:
{
  "priority_skills": ["Skill1", "Skill2"],
  "recommended_projects": [
    {
      "title": "Project Name",
      "description": "Brief description",
      "difficulty": "Beginner/Intermediate/Advanced"
    }
  ],
  "recommended_resources": [
    {
      "title": "Resource Name",
      "type": "Course/Documentation/Video/Article/Practice",
      "url": "https://..."
    }
  ],
  "learning_order": ["Skill1", "Skill2", "Skill3"],
  "summary": "Brief encouraging summary of their current standing and what they need to focus on.",
  "next_learning_step": "The single most important next step to take today."
}`;

const analyzeWithGemini = async (targetRole, matchedSkills, missingSkills) => {
  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model: geminiModel,
    contents: buildGeminiPrompt(targetRole, matchedSkills, missingSkills),
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const parsedResponse = extractJson(response.text);
  return skillGapAnalysisSchema.parse(parsedResponse);
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
    .select("id, key_skills, strengths, recommended_keywords")
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

  if (existingAnalysis) {
    return existingAnalysis;
  }

  // 5. Calculate Backend Logic
  // Combine all user skills and lowercase them for comparison
  const rawUserSkills = [
    ...(resumeAnalysis.key_skills || []),
    ...(resumeAnalysis.strengths || []),
    ...(resumeAnalysis.recommended_keywords || [])
  ];
  
  const userSkillsSet = new Set(rawUserSkills.map(s => s.toLowerCase().trim()));

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(skill => {
    if (userSkillsSet.has(skill.toLowerCase().trim())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const skillMatchPercentage = requiredSkills.length > 0 
    ? Math.round((matchedSkills.length / requiredSkills.length) * 100) 
    : 0;

  // 6. Call Gemini
  let geminiResult;
  try {
    geminiResult = await analyzeWithGemini(targetRole, matchedSkills, missingSkills);
  } catch (error) {
    console.error("Gemini skill gap analysis failed.", error);
    throw new AppError(`Failed to generate personalized learning plan with AI: ${error.message}`, HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

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
