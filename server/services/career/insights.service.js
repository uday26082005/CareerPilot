const { getSupabaseAdmin } = require("../../config/supabase");
const aiService = require("../ai/groq.service");
const profileService = require("../profile/profile.service");
const companyLogos = require("../../data/companyLogos.json");
const salaryRanges = require("../../data/salaryRanges.json");
const { AppError } = require("../../middleware/error/AppError");
const { HTTP_STATUS } = require("../../utils/constants/httpStatus");
const { careerInsightsSchema } = require("../../schemas/insights.schema");

const buildInsightsPrompt = (profile, latestResume, latestSkillGap) => {
  const targetRole = profile?.targetRole || profile?.current_role || "Software Engineer";
  const resumeScore = latestResume?.overall_score || "N/A";
  const strengths = latestResume?.strengths || [];
  const strengthsStr = strengths.join(", ") || "None recorded";
  const missingSkills = latestSkillGap?.missing_skills || [];
  const missingStr = missingSkills.join(", ") || "None recorded";
  const currentExp = profile?.years_experience || 0;
  const randomSeed = Math.floor(Math.random() * 1000000);

  return `You are a senior Career Coach specializing in the Indian tech job market. Analyze this candidate's profile and generate hyper-personalized career insights.

CANDIDATE PROFILE:
- Target Role: ${targetRole}
- Years of Experience: ${currentExp}
- Resume Score: ${resumeScore}/100
- Current Strengths: ${strengthsStr}
- Skill Gaps (missing): ${missingStr}
- Session ID: ${randomSeed}

CRITICAL RULES FOR PERSONALIZATION:
1. ai_advice MUST reference the candidate's SPECIFIC missing skills by name (${missingStr}) and explain exactly how to learn each one. Do NOT give generic advice like "practice coding challenges". Instead say things like "Start with ${missingSkills[0] || 'the first missing skill'} by building a project that uses it alongside your existing ${strengths[0] || 'strengths'}."
2. ai_focus_area MUST be a specific learning path derived from their top 2-3 missing skills, NOT a generic phrase.
3. ai_potential_improvement MUST be calculated based on: each missing skill closed = roughly ${missingSkills.length > 0 ? Math.round(30 / missingSkills.length) : 5}% improvement. Show realistic range.
4. match_reason MUST mention their actual strengths (${strengthsStr}) and what's holding them back (${missingStr}).
5. key_takeaways MUST be actionable steps specific to their skill gaps, not generic career advice.
6. other_matches should be roles that genuinely align with their CURRENT skills (${strengthsStr}).

Generate a JSON response matching this exact schema. Every field must feel like it was written by a human mentor who reviewed their resume:

{
  "best_match_role": "${targetRole}",
  "match_score": 85,
  "match_reason": "Your strengths in X and Y position you well for ${targetRole}, but gaps in A and B are limiting your match.",
  "other_matches": [
    { "name": "Related Role", "percent": 80, "color": "bg-emerald-500" }
  ],
  "salary_entry": "₹4 - 8 LPA",
  "salary_mid": "₹10 - 18 LPA",
  "salary_senior": "₹25 - 40 LPA",
  "top_companies": [
    { "name": "Google", "domain": "google.com", "demand": "High", "demandColor": "text-emerald-400", "salary": "₹18 - 45 LPA" }
  ],
  "key_takeaways": [
    { "title": "Specific actionable step", "desc": "Details about what to do", "iconName": "Target", "iconColor": "text-violet-400 bg-violet-500/10" }
  ],
  "ai_advice": "Detailed 3-4 sentence advice mentioning their specific skills by name...",
  "ai_focus_area": "Specific Learning Path (e.g. 'Git workflows & REST API design')",
  "ai_potential_improvement": "12 - 18% match increase"
}

For iconName use ONLY: "Target", "ShieldCheck", "Briefcase", "ArrowUpRight", "TrendingUp", "Star".
For colors use Tailwind classes like "bg-emerald-500", "bg-blue-500", "bg-orange-500", "bg-purple-500".
Provide EXACTLY 2 other_matches, EXACTLY 2 top_companies, and EXACTLY 2 key_takeaways. Keep descriptions concise to avoid token limits.
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

  // Force best_match_role to the user's actual target role
  const roleKey = profile?.targetRole || profile?.current_role || "Software Engineer";
  analysisJson.best_match_role = roleKey;

  // Case-insensitive fuzzy lookup helper
  const findKey = (obj, key) => {
    const lower = key.toLowerCase();
    const exactMatch = Object.keys(obj).find(k => k.toLowerCase() === lower);
    if (exactMatch) return exactMatch;
    // Partial match: find a key that contains or is contained in the search term
    return Object.keys(obj).find(k => lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)) || null;
  };

  // Fetch real-time scraped jobs for this role
  const { data: scrapedJobs } = await supabase
    .from('scraped_jobs')
    .select('company, salary_min, salary_max')
    .ilike('role_name', `%${roleKey}%`);

  if (scrapedJobs && scrapedJobs.length > 0) {
    // Calculate dynamic salary percentiles
    const allSalaries = [];
    scrapedJobs.forEach(job => {
      if (job.salary_min) allSalaries.push(job.salary_min);
      if (job.salary_max) allSalaries.push(job.salary_max);
    });
    
    allSalaries.sort((a, b) => a - b);
    
    if (allSalaries.length >= 3) {
      const getPercentile = (p) => allSalaries[Math.floor((allSalaries.length - 1) * p)];
      const formatLPA = (val) => `₹${(val / 100000).toFixed(1)} LPA`;
      
      analysisJson.salary_entry = `${formatLPA(getPercentile(0.1))} - ${formatLPA(getPercentile(0.3))}`;
      analysisJson.salary_mid = `${formatLPA(getPercentile(0.4))} - ${formatLPA(getPercentile(0.6))}`;
      analysisJson.salary_senior = `${formatLPA(getPercentile(0.7))} - ${formatLPA(getPercentile(0.9))}`;
    }

    // Determine top hiring companies dynamically
    const companyCounts = {};
    scrapedJobs.forEach(job => {
      companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
    });
    
    const sortedCompanies = Object.entries(companyCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    
    if (sortedCompanies.length > 0) {
      analysisJson.top_companies = sortedCompanies.map(([comp, count]) => ({
        name: comp,
        domain: `${comp.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        demand: count > 2 ? "Very High" : "High",
        demandColor: "text-emerald-400",
        salary: analysisJson.salary_mid
      }));
    }
  } else {
    // Fallback to static JSON if no scraped data yet
    const companyKey = findKey(companyLogos, roleKey);
    if (companyKey) {
      analysisJson.top_companies = companyLogos[companyKey];
    }
    const salaryKey = findKey(salaryRanges, roleKey);
    if (salaryKey) {
      analysisJson.salary_entry = salaryRanges[salaryKey].entry;
      analysisJson.salary_mid = salaryRanges[salaryKey].mid;
      analysisJson.salary_senior = salaryRanges[salaryKey].senior;
    }
  }

  // Compute relevance match score based on strengths vs missing skills
  const strengthsCount = (resumeAnalysis?.strengths?.length) || 0;
  const missingCount = (skillGap?.missing_skills?.length) || 0;
  const total = strengthsCount + missingCount;
  const computedMatchScore = total > 0 ? Math.round((strengthsCount / total) * 100) : analysisJson.match_score || 0;
  analysisJson.match_score = computedMatchScore;

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

  // If no insights found, or data is stale (older than 24 hours), regenerate
  if (!data) {
    return await generateInsights(userId);
  }

  const updatedAt = new Date(data.updated_at || data.created_at);
  const hoursSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60);
  if (hoursSinceUpdate > 24) {
    return await generateInsights(userId);
  }

  return data;
};

module.exports = {
  getInsights,
  generateInsights
};
