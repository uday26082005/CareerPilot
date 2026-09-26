const { z } = require("zod");
const aiService = require("../ai/groq.service");

const marketSkillsSchema = z.object({
  role_name: z.string().trim().optional().default(""),
  required_skills: z.array(z.string().trim()).min(6).max(20),
  market_demand_summary: z.string().trim().optional().default(""),
  trending_technologies: z.array(z.string().trim()).max(10).optional().default([]),
});

/**
 * Dynamically extracts up-to-date industry required skills for a role
 * based on current tech hiring trends and live scraped job postings.
 *
 * @param {string} targetRole - The job role name (e.g. "Full Stack Developer")
 * @param {object} supabase - Supabase admin client
 * @returns {Promise<{ required_skills: string[], market_demand_summary: string, trending_technologies: string[], is_live_market: boolean }>}
 */
const getDynamicMarketSkills = async (targetRole, supabase) => {
  const currentYear = new Date().getFullYear();
  let liveJobsContext = [];

  // 1. Pull recent live scraped jobs for this role to ground the analysis in actual postings
  try {
    const { data: scrapedJobs } = await supabase
      .from("scraped_jobs")
      .select("job_title, company, location, salary_min, salary_max")
      .ilike("role_name", `%${targetRole.split(" ")[0]}%`)
      .order("created_at", { ascending: false })
      .limit(6);

    if (scrapedJobs && scrapedJobs.length > 0) {
      liveJobsContext = scrapedJobs.map(
        (j) => `${j.job_title} at ${j.company} (${j.location})`
      );
    }
  } catch (err) {
    console.warn("[MarketSkills] Could not fetch scraped_jobs context:", err.message);
  }

  // 2. Query AI with Industry Market Extraction prompt
  const jobsText = liveJobsContext.length > 0 
    ? `\nRecent Live Market Postings: \n- ${liveJobsContext.join("\n- ")}` 
    : "";

  const prompt = `You are a Senior Technical Labor Market Analyst and Tech Recruiting Lead in ${currentYear}.
Role to Analyze: "${targetRole}"${jobsText}

Analyze current global tech industry hiring requirements, actual employer postings, and production engineering stacks in ${currentYear}.
Extract 12 to 15 essential, non-negotiable technical skills, modern frameworks, databases, cloud tools, and architectural competencies that companies actively mandate in candidate resumes right now.

STRICT GUIDELINES:
1. "required_skills": List only concise technical skills/tools (e.g., "React", "TypeScript", "Node.js", "Docker", "PostgreSQL", "REST APIs", "AWS Cloud", "GraphQL", "CI/CD").
2. No non-technical soft skills (no 'communication', 'team player', 'problem solving').
3. "market_demand_summary": A 2-sentence synopsis of what employers prioritize most for this role in ${currentYear}.
4. "trending_technologies": 4-6 modern tools or technologies rapidly growing in demand for this role.

Return JSON conforming to the schema.`;

  try {
    console.log(`[MarketSkills] Dynamically extracting market skills for "${targetRole}"...`);
    const marketResult = await aiService.generateStructuredResponse(prompt, marketSkillsSchema);

    const requiredSkills = marketResult.required_skills && marketResult.required_skills.length >= 8
      ? marketResult.required_skills
      : null;

    if (requiredSkills) {
      // 3. Upsert into role_skill_templates to keep the database continually updated with fresh market intelligence
      try {
        await supabase
          .from("role_skill_templates")
          .upsert(
            {
              role_name: targetRole,
              required_skills: requiredSkills,
              updated_at: new Date().toISOString()
            },
            { onConflict: "role_name" }
          );
        console.log(`[MarketSkills] Successfully updated role_skill_templates for "${targetRole}" with ${requiredSkills.length} dynamic market skills.`);
      } catch (dbErr) {
        console.warn("[MarketSkills] Database sync warning:", dbErr.message);
      }

      return {
        required_skills: requiredSkills,
        market_demand_summary: marketResult.market_demand_summary || `Current ${currentYear} industry requirements for ${targetRole}.`,
        trending_technologies: marketResult.trending_technologies || [],
        is_live_market: true,
        extracted_at: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error(`[MarketSkills] Live market skill extraction failed for "${targetRole}":`, error.message);
  }

  // 4. Fallback: Retrieve existing database template if live extraction failed
  console.log(`[MarketSkills] Falling back to database template for "${targetRole}"...`);
  try {
    const { data: fallbackTemplate } = await supabase
      .from("role_skill_templates")
      .select("required_skills")
      .ilike("role_name", `%${targetRole.split(" ")[0]}%`)
      .limit(1)
      .maybeSingle();

    if (fallbackTemplate?.required_skills?.length > 0) {
      return {
        required_skills: fallbackTemplate.required_skills,
        market_demand_summary: `Standard industry baseline skills for ${targetRole}.`,
        trending_technologies: [],
        is_live_market: false,
        extracted_at: new Date().toISOString()
      };
    }
  } catch (err) {
    console.error("[MarketSkills] Fallback query failed:", err.message);
  }

  // Ultimate safety fallback
  return {
    required_skills: [
      "JavaScript", "TypeScript", "React", "Node.js", "SQL", "Git", "Docker", "REST APIs", "Cloud Services"
    ],
    market_demand_summary: `Industry baseline skills for ${targetRole}.`,
    trending_technologies: [],
    is_live_market: false,
    extracted_at: new Date().toISOString()
  };
};

module.exports = {
  getDynamicMarketSkills
};
