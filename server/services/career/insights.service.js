const { getSupabaseAdmin } = require("../../config/supabase");
const aiService = require("../ai/groq.service");
const profileService = require("../profile/profile.service");
const liveHiringService = require("./liveHiring.service");
const companyLogos = require("../../data/companyLogos.json");
const salaryRanges = require("../../data/salaryRanges.json");
const { AppError } = require("../../middleware/error/AppError");
const { HTTP_STATUS } = require("../../utils/constants/httpStatus");
const { careerInsightsSchema } = require("../../schemas/insights.schema");

// Helper to normalize salary strings according to Rule A (Range), Rule B (Single Value), Rule C (Unavailable)
const normalizeSalaryBand = (rawVal) => {
  if (!rawVal || typeof rawVal !== "string") return "Salary data unavailable";
  const trimmed = rawVal.trim();
  if (trimmed.toLowerCase().includes("unavailable") || trimmed === "N/A") {
    return "Salary data unavailable";
  }

  // Extract numeric components
  const nums = trimmed.match(/[\d.]+/g);
  if (!nums || nums.length === 0) return "Salary data unavailable";

  if (nums.length >= 2) {
    const min = parseFloat(nums[0]);
    const max = parseFloat(nums[1]);
    if (isNaN(min) && isNaN(max)) return "Salary data unavailable";
    if (!isNaN(min) && isNaN(max)) return `₹${min} LPA`;
    if (isNaN(min) && !isNaN(max)) return `₹${max} LPA`;

    // Rule B: Exactly identical values must NOT be duplicated as a fake range
    if (min === max) {
      return `₹${min} LPA`;
    }

    // Rule A: Genuine range
    const lower = Math.min(min, max);
    const upper = Math.max(min, max);
    return `₹${lower} LPA – ₹${upper} LPA`;
  } else {
    // Rule B: Single reliable value
    const val = parseFloat(nums[0]);
    return !isNaN(val) ? `₹${val} LPA` : "Salary data unavailable";
  }
};

const buildInsightsPrompt = (profile, latestResume, latestSkillGap) => {
  const targetRole = profile?.targetRole || profile?.current_role || "Software Engineer";
  const resumeScore = latestResume?.overall_score || "N/A";
  const roleFitScore = latestResume?.analysis_json?.role_fit?.score ?? latestSkillGap?.skill_match_percentage ?? "N/A";
  const strengths = latestResume?.strengths || [];
  const strengthsStr = strengths.join(", ") || "None recorded";
  const matchedSkills = latestSkillGap?.matched_skills || [];
  const matchedStr = matchedSkills.slice(0, 10).join(", ") || "Foundational skills";
  const missingSkills = latestSkillGap?.missing_skills || [];
  const missingStr = missingSkills.slice(0, 10).join(", ") || "None recorded";
  const currentExp = profile?.years_experience || 0;
  const randomSeed = Math.floor(Math.random() * 1000000);

  return `You are a senior Career Coach specializing in the Indian tech job market. Analyze this candidate's profile and generate hyper-personalized career insights.

CANDIDATE PROFILE:
- Target Role: ${targetRole}
- Years of Experience: ${currentExp}
- Resume Score: ${resumeScore}/100
- Target Role Fit Match: ${roleFitScore !== "N/A" ? `${roleFitScore}%` : "In Progress"}
- Key Profile Strengths: ${strengthsStr}
- Matched Competencies: ${matchedStr}
- Missing Skills (to bridge): ${missingStr}
- Session ID: ${randomSeed}

CRITICAL RULES FOR PERSONALIZATION:
1. match_reason MUST be a concise 3-4 sentence summary (approximately 45-65 words) following this exact structure:
   - Sentence 1: Why the target role aligns with their background and acknowledge their top matching skills (${strengthsStr}).
   - Sentence 2: The most important 1-2 missing skill gaps (${missingStr}) currently affecting their match score.
   - Sentence 3: The single most useful next step (e.g. building a specific hands-on project or practicing core concepts).
   - Sentence 4: How taking this step will elevate their job readiness for the role.
   STYLE REFERENCE: "Your ${strengths[0] || 'core technical'} fundamentals provide a good starting point for a ${targetRole} role. Strengthening your ${missingSkills[0] || 'specialized'} and ${missingSkills[1] || 'domain'} skills would improve your readiness. Focus on building a hands-on project and practising core concepts. These steps can help you demonstrate stronger role-specific capabilities."
   Keep it crisp, professional, and easy to scan. Do NOT write a lengthy paragraph or wall of text.

2. key_takeaways MUST contain between 3 and 4 short, punchy, actionable directives (max 8-12 words each):
   - Each item's title MUST be a short, direct action item. NEVER write long explanations or multi-sentence paragraphs.
   - EXAMPLES:
     - "Build a PostgreSQL project with query indexing"
     - "Learn Apache Kafka for real-time event streaming"
     - "Practise binary tree and graph algorithms"
     - "Create an end-to-end ML pipeline with Scikit-Learn"
   - Always leave "desc" completely empty: "".
   - Set iconName to one of: "Target", "Code", "Database", "Cpu", "Layers", "BookOpen", "TrendingUp".

3. ai_advice MUST be a concise 3-4 sentence advice mentioning their specific missing skills (${missingStr}) by name and guiding their next learning priority.
4. ai_focus_area MUST be a specific learning path derived from their top missing skills (e.g. "Schema Design & Event Streaming").
5. ai_potential_improvement MUST be a realistic match increase range (e.g. "12 - 18% match increase").

Generate a JSON response matching this schema:
{
  "best_match_role": "${targetRole}",
  "match_score": ${typeof roleFitScore === "number" ? roleFitScore : 85},
  "match_reason": "Concise 3-4 sentence summary...",
  "other_matches": [
    { "name": "Alternative Role 1", "percent": 80, "color": "bg-emerald-500" },
    { "name": "Alternative Role 2", "percent": 75, "color": "bg-blue-500" }
  ],
  "salary_entry": "₹4 LPA – ₹8 LPA",
  "salary_mid": "₹10 LPA – ₹18 LPA",
  "salary_senior": "₹25 LPA – ₹40 LPA",
  "top_companies": [],
  "key_takeaways": [
    { "title": "Build a PostgreSQL project with query indexing", "desc": "", "iconName": "Database", "iconColor": "text-teal-400 bg-teal-500/10" },
    { "title": "Learn Apache Kafka for real-time event streaming", "desc": "", "iconName": "Cpu", "iconColor": "text-amber-400 bg-amber-500/10" },
    { "title": "Practise binary tree and graph algorithms", "desc": "", "iconName": "Target", "iconColor": "text-purple-400 bg-purple-500/10" }
  ],
  "ai_advice": "Concise 3-4 sentence advice...",
  "ai_focus_area": "Specific learning path",
  "ai_potential_improvement": "12 - 18% match increase"
}
`;
};

const generateInsights = async (userId) => {
  const supabase = getSupabaseAdmin();
  
  // 1. Fetch user context
  const profile = await profileService.getProfileById(userId);
  
  // Fetch latest resume analysis
  const { data: resumeAnalysis } = await supabase
    .from("resume_analysis")
    .select("overall_score, strengths, analysis_json")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
    
  // Fetch latest skill gap
  const { data: skillGap } = await supabase
    .from("skill_gap_analysis")
    .select("skill_match_percentage, matched_skills, missing_skills, analysis_json")
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
    if (!obj || !key) return null;
    const lower = key.toLowerCase();
    const exactMatch = Object.keys(obj).find(k => k.toLowerCase() === lower);
    if (exactMatch) return exactMatch;
    return Object.keys(obj).find(k => lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)) || null;
  };

  // 3. Dynamically fetch top 5 live hiring companies using verified live hiring service
  const matchedSkills = skillGap?.matched_skills || resumeAnalysis?.strengths || [];
  try {
    const liveCompanies = await liveHiringService.getLiveTopCompanies(roleKey, matchedSkills);
    if (liveCompanies && liveCompanies.length > 0) {
      analysisJson.top_companies = liveCompanies;
    } else {
      analysisJson.top_companies = [];
    }
  } catch (err) {
    console.warn("[Insights] Live hiring fetch failed:", err.message);
    analysisJson.top_companies = [];
  }

  // 4. Calculate accurate, non-duplicated Salary Insights for India (Rules A, B, C)
  const { data: scrapedJobs } = await supabase
    .from("scraped_jobs")
    .select("salary_min, salary_max")
    .ilike("role_name", `%${roleKey}%`);

  const validInrSalaries = [];
  if (scrapedJobs && scrapedJobs.length > 0) {
    scrapedJobs.forEach(job => {
      if (job.salary_min && job.salary_min >= 150000 && job.salary_min <= 20000000) validInrSalaries.push(job.salary_min);
      if (job.salary_max && job.salary_max >= 150000 && job.salary_max <= 20000000) validInrSalaries.push(job.salary_max);
    });
  }

  validInrSalaries.sort((a, b) => a - b);

  if (validInrSalaries.length >= 6) {
    const getPercentile = (p) => validInrSalaries[Math.floor((validInrSalaries.length - 1) * p)];
    const toLpa = (val) => Number((val / 100000).toFixed(1));

    analysisJson.salary_entry = normalizeSalaryBand(`${toLpa(getPercentile(0.1))} - ${toLpa(getPercentile(0.35))}`);
    analysisJson.salary_mid = normalizeSalaryBand(`${toLpa(getPercentile(0.35))} - ${toLpa(getPercentile(0.70))}`);
    analysisJson.salary_senior = normalizeSalaryBand(`${toLpa(getPercentile(0.70))} - ${toLpa(getPercentile(0.95))}`);
    analysisJson.salary_source = "Live Job Postings Dataset (India)";
    analysisJson.salary_updated = "Oct 2026";
  } else {
    // Ground in verified India Tech Market Salary benchmark database
    const salaryKey = findKey(salaryRanges, roleKey);
    if (salaryKey && salaryRanges[salaryKey]) {
      analysisJson.salary_entry = normalizeSalaryBand(salaryRanges[salaryKey].entry);
      analysisJson.salary_mid = normalizeSalaryBand(salaryRanges[salaryKey].mid);
      analysisJson.salary_senior = normalizeSalaryBand(salaryRanges[salaryKey].senior);
      analysisJson.salary_source = "India Tech Compensation Index (AmbitionBox & Glassdoor benchmarks)";
      analysisJson.salary_updated = "Oct 2026";
    } else {
      analysisJson.salary_entry = "Salary data unavailable";
      analysisJson.salary_mid = "Salary data unavailable";
      analysisJson.salary_senior = "Salary data unavailable";
      analysisJson.salary_source = null;
      analysisJson.salary_updated = null;
    }
  }

  // 5. Derive match score consistently from Resume Role Fit or Skill Gap Analysis
  const resumeRoleFitScore = resumeAnalysis?.analysis_json?.role_fit?.score;
  const skillGapScore = skillGap?.analysis_json?.role_skills_coverage ?? skillGap?.skill_match_percentage;

  let resolvedMatchScore = analysisJson.match_score;
  if (typeof resumeRoleFitScore === "number" && !isNaN(resumeRoleFitScore) && resumeRoleFitScore > 0) {
    resolvedMatchScore = Math.round(resumeRoleFitScore);
  } else if (typeof skillGapScore === "number" && !isNaN(skillGapScore) && skillGapScore > 0) {
    resolvedMatchScore = Math.round(skillGapScore);
  } else if (skillGap?.matched_skills?.length || skillGap?.missing_skills?.length) {
    const matchedCount = skillGap.matched_skills?.length || 0;
    const totalSkills = matchedCount + (skillGap.missing_skills?.length || 0);
    if (totalSkills > 0) {
      resolvedMatchScore = Math.round((matchedCount / totalSkills) * 100);
    }
  }

  analysisJson.match_score = Math.min(100, Math.max(0, resolvedMatchScore || 0));

  // Sanitize key_takeaways to be bite-sized single-line directives
  if (Array.isArray(analysisJson.key_takeaways)) {
    analysisJson.key_takeaways = analysisJson.key_takeaways.slice(0, 4).map((item) => {
      let title = (item.title || "").trim();
      if (title.includes(".")) {
        const firstClause = title.split(".")[0].trim();
        if (firstClause.length >= 10) title = firstClause;
      }
      return {
        title,
        desc: "",
        iconName: item.iconName || "Target",
        iconColor: item.iconColor || "text-teal-400 bg-teal-500/10"
      };
    });
  }

  // 6. Upsert into database
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
    }, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    console.error("Supabase upsert error:", error);
    throw new AppError("Failed to save career insights.", HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }

  return {
    ...data,
    salary_source: analysisJson.salary_source || "India Tech Compensation Index (AmbitionBox & Glassdoor benchmarks)",
    salary_updated: analysisJson.salary_updated || "Oct 2026"
  };
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

  const profile = await profileService.getProfileById(userId);
  const currentRole = profile?.targetRole || profile?.current_role || "Software Engineer";

  // If no insights found, or target role changed, regenerate
  if (!data || data.best_match_role !== currentRole) {
    return await generateInsights(userId);
  }

  // Detect stale data older than 24h, or old corrupted duplicate format like '₹25.0 LPA - ₹25.0 LPA', or legacy 1-company data
  const hasDuplicateSalary = data.salary_entry?.includes("-") && data.salary_entry?.split("-")[0]?.trim() === data.salary_entry?.split("-")[1]?.trim();
  const hasFewCompanies = Array.isArray(data.top_companies) && data.top_companies.length <= 1;
  const hoursSinceUpdate = (Date.now() - new Date(data.updated_at || data.created_at).getTime()) / (1000 * 60 * 60);

  if (hoursSinceUpdate > 24 || hasDuplicateSalary || hasFewCompanies) {
    return await generateInsights(userId);
  }

  // Ensure returned takeaways don't have legacy long paragraphs
  const cleanedTakeaways = Array.isArray(data.key_takeaways)
    ? data.key_takeaways.slice(0, 4).map((item) => {
        let title = (item.title || "").trim();
        if (title.includes(".")) {
          const firstClause = title.split(".")[0].trim();
          if (firstClause.length >= 10) title = firstClause;
        }
        return { ...item, title, desc: "" };
      })
    : [];

  return {
    ...data,
    key_takeaways: cleanedTakeaways,
    salary_source: "India Tech Compensation Index (AmbitionBox & Glassdoor benchmarks)",
    salary_updated: "Oct 2026"
  };
};

module.exports = {
  getInsights,
  generateInsights
};
