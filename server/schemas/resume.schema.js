const { z } = require("zod");

const emptyRequestParts = {
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({}).default({}),
};

const analyzeResumeSchema = z.object(emptyRequestParts);

const listResumeHistorySchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    limit: z.coerce.number().int().min(1).max(50).default(10),
    offset: z.coerce.number().int().min(0).default(0),
  }).default({}),
});

const reanalyzeResumeSchema = z.object(emptyRequestParts);

const sectionScoreSchema = z.object({
  score: z.number().finite().min(0).max(100),
  feedback: z.string().trim(),
});

const keySuggestionSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  priority: z.string().trim(),
});

const roleFitSchema = z.object({
  target_role: z.string().trim(),
  score: z.number().finite().min(0).max(100),
  summary: z.string().trim(),
  strengths: z.array(z.string().trim()).max(20),
  weaknesses: z.array(z.string().trim()).max(20),
});

const resumeAnalysisSchema = z.object({
  overall_score: z.number().finite().min(0).max(100),
  overall_summary: z.string().trim(),
  ats_score: z.number().finite().min(0).max(100),
  ats_status: z.string().trim(),
  ats_tips: z.array(z.string().trim()).max(20),
  section_scores: z.object({
    summary: sectionScoreSchema.optional(),
    experience: sectionScoreSchema.optional(),
    skills: sectionScoreSchema.optional(),
    projects: sectionScoreSchema.optional(),
    education: sectionScoreSchema.optional(),
    certifications: sectionScoreSchema.optional(),
  }),
  strengths: z.array(z.string().trim()).max(20),
  key_suggestions: z.array(keySuggestionSchema).max(20),
  recommended_keywords: z.array(z.string().trim()).max(50),
  role_fit: roleFitSchema,
});

module.exports = {
  analyzeResumeSchema,
  listResumeHistorySchema,
  resumeAnalysisSchema,
  reanalyzeResumeSchema,
};
