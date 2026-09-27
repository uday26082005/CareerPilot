const axios = require("axios");
const { z } = require("zod");
const aiService = require("../ai/groq.service");

// The 15 standard supported roles (roles are fixed/hardcoded, but all skills are extracted dynamically)
const SUPPORTED_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer",
  "DevOps Engineer",
  "Mobile App Developer",
  "Data Analyst",
  "Machine Learning Engineer",
  "Cybersecurity Analyst",
  "Cloud Architect",
  "Quality Assurance Engineer",
  "Business Analyst",
  "Systems Administrator"
];

// Mapping roles to web search/api tags for live market posting ingestion
const ROLE_WEB_TAG_MAP = {
  "Frontend Developer": "frontend",
  "Backend Developer": "backend",
  "Full Stack Developer": "fullstack",
  "Data Scientist": "data",
  "Product Manager": "product",
  "UI/UX Designer": "design",
  "DevOps Engineer": "devops",
  "Mobile App Developer": "mobile",
  "Data Analyst": "data",
  "Machine Learning Engineer": "ai",
  "Cybersecurity Analyst": "security",
  "Cloud Architect": "cloud",
  "Quality Assurance Engineer": "qa",
  "Business Analyst": "analyst",
  "Systems Administrator": "sysadmin"
};

// Zod Schema for dynamically extracted market skills - approx 25 skills (20 to 30)
const marketSkillsSchema = z.object({
  role_name: z.string().trim().optional().default(""),
  required_skills: z.array(z.string().trim()).min(18).max(30),
  market_demand_summary: z.string().trim().min(1),
  trending_technologies: z.array(z.string().trim()).optional().default([])
});

/**
 * Fetches live web postings and active skill tags for the target role from public job APIs.
 */
const fetchLiveWebPostings = async (targetRole) => {
  const roleTag = ROLE_WEB_TAG_MAP[targetRole] || encodeURIComponent(targetRole.split(" ")[0].toLowerCase());
  try {
    const res = await axios.get(`https://remoteok.com/api?tag=${roleTag}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      timeout: 6000
    });
    if (Array.isArray(res.data) && res.data.length > 1) {
      const jobs = res.data.slice(1, 10);
      const tags = [];
      const titles = [];
      jobs.forEach((j) => {
        if (j.position) titles.push(j.position);
        if (Array.isArray(j.tags)) tags.push(...j.tags);
      });
      const uniqueTags = Array.from(new Set(tags));
      return {
        jobTitles: titles.slice(0, 5),
        webTags: uniqueTags.slice(0, 30)
      };
    }
  } catch (err) {
    console.warn(`[MarketSkills] Live web API fetch notice for ${targetRole}:`, err.message);
  }
  return { jobTitles: [], webTags: [] };
};

/**
 * Fetches recent scraped jobs stored in Supabase for additional grounding.
 */
const fetchScrapedJobsContext = async (targetRole, supabase) => {
  try {
    const searchPrefix = targetRole.split(" ")[0];
    const { data: scrapedJobs } = await supabase
      .from("scraped_jobs")
      .select("job_title, company, location")
      .ilike("role_name", `%${searchPrefix}%`)
      .order("created_at", { ascending: false })
      .limit(6);

    if (scrapedJobs && scrapedJobs.length > 0) {
      return scrapedJobs.map((j) => `${j.job_title} at ${j.company} (${j.location})`);
    }
  } catch (err) {
    console.warn("[MarketSkills] Could not fetch scraped_jobs context:", err.message);
  }
  return [];
};

/**
 * Dynamically extracts up-to-date industry required skills for a role
 * based on current tech hiring trends and live web job postings.
 *
 * Caching & Refresh Strategy:
 * - Checks role_skill_templates.updated_at against today's date (YYYY-MM-DD).
 * - Only uses cache if updated today AND contains an approx 25-skill list (20 to 32 skills)
 *   AND has the genuine AI explanation text.
 * - Otherwise, re-extracts fresh skills from live web postings, updates
 *   the database with today's date and real market explanation, and returns the list.
 *
 * @param {string} targetRole - The job role name (e.g. "Product Manager")
 * @param {object} supabase - Supabase admin client
 * @returns {Promise<{ required_skills: string[], market_demand_summary: string, trending_technologies: string[], is_live_market: boolean, extracted_at: string }>}
 */
const getDynamicMarketSkills = async (targetRole, supabase) => {
  const currentYear = new Date().getFullYear();
  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // 1. Date check: Has this role already been dynamically updated today with ~25 skills & summary?
  try {
    const { data: existingTemplate } = await supabase
      .from("role_skill_templates")
      .select("role_name, required_skills, recommended_projects, updated_at")
      .ilike("role_name", targetRole)
      .limit(1)
      .maybeSingle();

    if (
      existingTemplate &&
      Array.isArray(existingTemplate.required_skills) &&
      existingTemplate.required_skills.length >= 20 &&
      existingTemplate.required_skills.length <= 32 &&
      existingTemplate.updated_at
    ) {
      const templateDateStr = new Date(existingTemplate.updated_at).toISOString().split("T")[0];
      const meta = existingTemplate.recommended_projects || {};
      const hasRealSummary = typeof meta.market_demand_summary === "string" && meta.market_demand_summary.trim().length > 25;

      if (templateDateStr === todayStr && hasRealSummary) {
        console.log(`[MarketSkills] Using today's (${todayStr}) fresh ~25 market skills for "${targetRole}" (${existingTemplate.required_skills.length} skills).`);
        return {
          required_skills: existingTemplate.required_skills,
          market_demand_summary: meta.market_demand_summary,
          trending_technologies: meta.trending_technologies || existingTemplate.required_skills.slice(0, 6),
          is_live_market: true,
          extracted_at: existingTemplate.updated_at,
          cached_today: true
        };
      } else {
        console.log(`[MarketSkills] Stored skills for "${targetRole}" need refresh (date: ${templateDateStr}, count: ${existingTemplate.required_skills.length}). Re-extracting dynamically from web for today (${todayStr})...`);
      }
    }
  } catch (checkErr) {
    console.warn("[MarketSkills] Could not inspect existing template date:", checkErr.message);
  }

  // 2. Fetch live web signals & active market postings
  const [webData, dbJobs] = await Promise.all([
    fetchLiveWebPostings(targetRole),
    fetchScrapedJobsContext(targetRole, supabase)
  ]);

  let marketSignalsText = "";
  if (webData.webTags.length > 0) {
    marketSignalsText += `\nLive Web Postings Tags: ${webData.webTags.join(", ")}`;
  }
  if (webData.jobTitles.length > 0) {
    marketSignalsText += `\nActive Job Titles on Market: ${webData.jobTitles.join(", ")}`;
  }
  if (dbJobs.length > 0) {
    marketSignalsText += `\nRecent Employer Listings: \n- ${dbJobs.join("\n- ")}`;
  }

  // 3. AI Extraction Prompt - Approx 25 skills relevant to market and role
  const prompt = `You are a Senior Technical Labor Market Analyst and Executive Tech Recruiter in ${currentYear}.
Role to Analyze: "${targetRole}"
${marketSignalsText}

Analyze current global tech industry hiring requirements, actual employer job descriptions, engineering job boards, and production tech stacks in ${currentYear}.

CRITICAL TASK:
1. "required_skills": Extract approximately 25 essential, modern, and in-demand technical skills, frameworks, tools, databases, and architectures for "${targetRole}" in ${currentYear}.
Target between 22 to 28 highly relevant, non-negotiable skills (approx 25 skills) that accurately represent the core modern requirements for this role.
2. ONLY TECHNICAL & DOMAIN SKILLS: Do NOT include generic soft skills (no 'communication', 'team player', 'problem solving', 'leadership'). Every skill must be a concrete technical skill, tool, methodology, or engineering concept.
3. "market_demand_summary": A detailed, insightful 2 to 3-sentence explanation of what employers in ${currentYear} are prioritizing most for "${targetRole}", key industry expectations, stack trends, and why these skills matter in the modern job market.
4. "trending_technologies": 4 to 6 modern tools, cutting-edge frameworks, or technologies rapidly surging in demand for this role in ${currentYear} (Market Focus).

Return a JSON object conforming strictly to this format:
{
  "role_name": "${targetRole}",
  "required_skills": ["Skill 1", "Skill 2", ...],
  "market_demand_summary": "Detailed explanation of current ${currentYear} market expectations and employer priorities...",
  "trending_technologies": ["Trending Tech 1", "Trending Tech 2", "Trending Tech 3", "Trending Tech 4"]
}`;

  try {
    console.log(`[MarketSkills] Dynamically extracting ~25 market skills from web for "${targetRole}"...`);
    const marketResult = await aiService.generateStructuredResponse(prompt, marketSkillsSchema, { max_tokens: 2200 });

    const requiredSkills = marketResult.required_skills && marketResult.required_skills.length >= 18
      ? marketResult.required_skills
      : null;

    if (requiredSkills) {
      const nowIso = new Date().toISOString();
      const meta = {
        market_demand_summary: marketResult.market_demand_summary,
        trending_technologies: marketResult.trending_technologies || []
      };

      // 4. Update the database template with today's date, the newly extracted skills, and the explanation metadata
      try {
        await supabase
          .from("role_skill_templates")
          .upsert(
            {
              role_name: targetRole,
              required_skills: requiredSkills,
              recommended_projects: meta,
              updated_at: nowIso
            },
            { onConflict: "role_name" }
          );
        console.log(`[MarketSkills] Successfully updated role_skill_templates for "${targetRole}" with ${requiredSkills.length} dynamic market skills as of ${todayStr}.`);
      } catch (dbErr) {
        console.warn("[MarketSkills] Database sync warning:", dbErr.message);
      }

      return {
        required_skills: requiredSkills,
        market_demand_summary: marketResult.market_demand_summary,
        trending_technologies: marketResult.trending_technologies || [],
        is_live_market: true,
        extracted_at: nowIso
      };
    }
  } catch (error) {
    console.error(`[MarketSkills] Live web market skill extraction failed for "${targetRole}":`, error.message);
  }

  // 5. Fallback: Retrieve existing database template if live extraction failed
  console.log(`[MarketSkills] Falling back to database template for "${targetRole}"...`);
  try {
    const { data: fallbackTemplate } = await supabase
      .from("role_skill_templates")
      .select("required_skills, recommended_projects, updated_at")
      .ilike("role_name", targetRole)
      .limit(1)
      .maybeSingle();

    if (fallbackTemplate?.required_skills?.length > 0) {
      const fallbackMeta = fallbackTemplate.recommended_projects || {};
      return {
        required_skills: fallbackTemplate.required_skills,
        market_demand_summary: fallbackMeta.market_demand_summary || `Current industry requirements for ${targetRole}.`,
        trending_technologies: fallbackMeta.trending_technologies || fallbackTemplate.required_skills.slice(0, 5),
        is_live_market: false,
        extracted_at: fallbackTemplate.updated_at || new Date().toISOString()
      };
    }
  } catch (err) {
    console.error("[MarketSkills] Fallback query failed:", err.message);
  }

  // Ultimate safety fallback (~25 skills)
  return {
    required_skills: [
      "JavaScript", "TypeScript", "React", "Node.js", "Express.js", "PostgreSQL",
      "MongoDB", "REST APIs", "GraphQL", "Docker", "Kubernetes", "AWS Cloud",
      "Git", "CI/CD Pipelines", "Redis", "Microservices", "Jest Testing",
      "System Design", "HTML5", "CSS3", "Tailwind CSS", "Linux", "Web Security", "State Management"
    ],
    market_demand_summary: `Industry baseline skills for ${targetRole}.`,
    trending_technologies: ["Next.js", "Docker", "AWS", "TypeScript"],
    is_live_market: false,
    extracted_at: new Date().toISOString()
  };
};

module.exports = {
  SUPPORTED_ROLES,
  getDynamicMarketSkills
};
