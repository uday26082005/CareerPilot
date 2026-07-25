const { z } = require("zod");

const otherMatchSchema = z.object({
  name: z.string(),
  percent: z.number(),
  color: z.string() // e.g., "bg-emerald-500", "bg-blue-500", "bg-orange-500", "bg-purple-500"
});

const companySchema = z.object({
  name: z.string(),
  domain: z.string().optional().nullable(),
  demand: z.string(), // e.g., "High", "Medium"
  demandColor: z.string(), // e.g., "text-emerald-400", "text-orange-400"
  salary: z.string(), // e.g., "₹18 - 45 LPA"
  isText: z.boolean().optional().nullable(),
  textFallback: z.string().optional().nullable(),
  textColor: z.string().optional().nullable(),
  invertDark: z.boolean().optional().nullable()
});

const takeawaySchema = z.object({
  title: z.string(),
  desc: z.string(),
  iconName: z.string(), // e.g., "Target", "ShieldCheck", "Briefcase", "ArrowUpRight"
  iconColor: z.string() // e.g., "text-violet-400 bg-violet-500/10"
});

const careerInsightsSchema = z.object({
  best_match_role: z.string(),
  match_score: z.number().min(0).max(100),
  match_reason: z.string(),
  other_matches: z.array(otherMatchSchema),
  salary_entry: z.string(),
  salary_mid: z.string(),
  salary_senior: z.string(),
  top_companies: z.array(companySchema),
  key_takeaways: z.array(takeawaySchema),
  ai_advice: z.string(),
  ai_focus_area: z.string(),
  ai_potential_improvement: z.string()
});

module.exports = {
  careerInsightsSchema
};
