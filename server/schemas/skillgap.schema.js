const { z } = require("zod");

const recommendedProjectSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  difficulty: z.string().trim(),
});

const recommendedResourceSchema = z.object({
  title: z.string().trim(),
  type: z.string().trim(),
  url: z.string().trim(),
});

const skillGapAnalysisSchema = z.object({
  priority_skills: z.array(z.string().trim()).max(20),
  recommended_projects: z.array(recommendedProjectSchema).max(10),
  recommended_resources: z.array(recommendedResourceSchema).max(20),
  learning_order: z.array(z.string().trim()).max(30),
  summary: z.string().trim(),
  next_learning_step: z.string().trim(),
});

module.exports = {
  skillGapAnalysisSchema,
};
