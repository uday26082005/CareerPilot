const { getSupabaseAdmin } = require("../../config/supabase");
const aiService = require("../ai/groq.service");
const profileService = require("../profile/profile.service");
const { AppError } = require("../../middleware/error/AppError");
const { HTTP_STATUS } = require("../../utils/constants/httpStatus");
const { careerInsightsSchema } = require("../../schemas/insights.schema");

const buildInsightsPrompt = (profile, latestResume, latestSkillGap) => {
  const targetRole = profile?.targetRole || profile?.current_role || "Software Engineer";
  const resumeScore = latestResume?.overall_score || "N/A";
  const strengths = latestResume?.strengths?.join(", ") || "None recorded";
  const missingSkills = latestSkillGap?.missing_skills?.join(", ") || "None recorded";
  const currentExp = profile?.years_experience || 0;

  return `You are an elite Career Advisor AI. Based on the user's profile, generate personalized career insights.

User Profile context:
- Target Role: ${targetRole}
- Years Experience: ${currentExp}
- Resume Score: ${resumeScore}
- Known Strengths: ${strengths}
- Missing Skills (Skill Gap): ${missingSkills}

Generate a structured JSON response matching the required schema exactly. Do not omit any fields. Ensure the insights are highly specific to the user's target role.

Required JSON shape (provide 3-4 other_matches, 4-5 top_companies, and 3-4 key_takeaways):
{
  "best_match_role": "Full Stack Developer",
  "match_score": 95,
  "match_reason": "Strong match based on your skills.",
  "other_matches": [
    { "name": "Frontend Developer", "percent": 92, "color": "bg-emerald-500" }
  ],
  "salary_entry": "₹4 - 8 LPA",
  "salary_mid": "₹10 - 18 LPA",
  "salary_senior": "₹25 - 40 LPA",
  "top_companies": [
    { "name": "Google", "domain": "google.com", "demand": "High", "demandColor": "text-emerald-400", "salary": "₹18 - 45 LPA" },
    { "name": "TCS", "domain": "tcs.com", "demand": "High", "demandColor": "text-emerald-400", "salary": "₹3.5 - 12 LPA" }
  ],
  "key_takeaways": [
    { "title": "High demand", "desc": "Market is strong.", "iconName": "Target", "iconColor": "text-violet-400 bg-violet-500/10" }
  ],
  "ai_advice": "Focus on backend skills.",
  "ai_focus_area": "Backend & Cloud",
  "ai_potential_improvement": "8 - 12% match increase"
}

Guidelines for JSON fields:
- best_match_role: Ensure it aligns with their target role (e.g. "Full Stack Developer", "Data Scientist").
- match_score: A realistic match percentage out of 100 based on their resume score and missing skills.
- match_reason: 1-2 sentence explanation of why this is their best match.
- other_matches: Provide 3-4 other roles with percentage matches (70-95%) and colors (use Tailwind colors like "bg-emerald-500", "bg-blue-500", "bg-orange-500", "bg-purple-500").
- salary_entry, salary_mid, salary_senior: Provide realistic salaries in INR (LPA) for the target role in India based on market averages. (e.g., "₹4 - 8 LPA").
- top_companies: List 4-5 top companies hiring for this role. For each company, provide their official website "domain" (e.g., "google.com", "microsoft.com"). Do not provide image URLs or text fallbacks.
- key_takeaways: 3-4 actionable points. For "iconName", use EXACTLY one of these strings: "Target", "ShieldCheck", "Briefcase", "ArrowUpRight", "TrendingUp", "Star". For "iconColor", use Tailwind classes like "text-violet-400 bg-violet-500/10".
- ai_advice: 2-3 sentences of direct advice based on their missing skills and strengths.
- ai_focus_area: A short phrase (e.g., "Backend Development & Cloud").
- ai_potential_improvement: e.g., "8 - 12% match increase".
`;
};

const generateInsights = async (userId) => {
  const supabase = getSupabaseAdmin();
  
  // 1. Fetch user context
  const profile = await profileService.getProfileById(userId);
  
  // Fetch latest resume analysis
  const { data: resumeAnalysis } = await supabase
    .from("resume_analysis")
    .select("overall_score, strengths")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
    
  // Fetch latest skill gap
  const { data: skillGap } = await supabase
    .from("skill_gap_analysis")
    .select("missing_skills")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // 2. Build prompt and call AI
  const prompt = buildInsightsPrompt(profile, resumeAnalysis, skillGap);
  const analysisJson = await aiService.generateStructuredResponse(prompt, careerInsightsSchema);

  // 3. Upsert into database
  const { data, error } = await supabase
    .from("career_insights")
    .upsert({
      user_id: userId,
      best_match_role: analysisJson.best_match_role,
      match_score: analysisJson.match_score,
      match_reason: analysisJson.match_reason,
      other_matches: analysisJson.other_matches,
      salary_entry: analysisJson.salary_entry,
      salary_mid: analysisJson.salary_mid,
      salary_senior: analysisJson.salary_senior,
      top_companies: analysisJson.top_companies,
      key_takeaways: analysisJson.key_takeaways,
      ai_advice: analysisJson.ai_advice,
      ai_focus_area: analysisJson.ai_focus_area,
      ai_potential_improvement: analysisJson.ai_potential_improvement,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error("Supabase upsert error:", error);
    throw new AppError("Failed to save career insights.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  return data;
};

const getInsights = async (userId) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("career_insights")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new AppError("Error fetching career insights.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  // If no insights found, generate them
  if (!data) {
    return await generateInsights(userId);
  }

  return data;
};

module.exports = {
  getInsights,
  generateInsights
};
