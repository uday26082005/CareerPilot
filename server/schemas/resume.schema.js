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

const resumeAnalysisSchema = z.object({
  ats_score: z.number().finite().min(0).max(100),
  overall_score: z.number().finite().min(0).max(100),
  role_fit: z.string().trim().min(1).max(500),
  key_skills: z.array(z.string().trim().min(1).max(120)).max(30),
  missing_skills: z.array(z.string().trim().min(1).max(120)).max(30),
  strengths: z.array(z.string().trim().min(1).max(500)).max(20),
  improvement_areas: z.array(z.string().trim().min(1).max(500)).max(20),
  recommended_keywords: z.array(z.string().trim().min(1).max(120)).max(30),
});

module.exports = {
  analyzeResumeSchema,
  listResumeHistorySchema,
  resumeAnalysisSchema,
};
