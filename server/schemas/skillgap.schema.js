const { z } = require("zod");

const recommendedProjectSchema = z.object({
  title: z.string().trim().default("Practical Hands-on Project"),
  description: z.string().trim().default("Build a project covering key missing competencies."),
  difficulty: z.string().trim().default("Intermediate"),
});

const recommendedResourceSchema = z.object({
  title: z.string().trim().default("Official Documentation & Guides"),
  type: z.string().trim().default("Documentation"),
  url: z.string().trim().default("https://roadmap.sh"),
});

const practiceQuestionSchema = z.object({
  title: z.string().trim().default("Core Concept Implementation"),
  platform: z.string().trim().default("CareerPilot Practice Arena"),
  url: z.string().trim().default("#"),
  topic_id: z.string().trim().optional().default("backend"),
});

const baseSkillGapSchema = z.object({
  priority_skills: z.array(z.string().trim()).max(20).optional().default([]),
  recommended_projects: z.array(recommendedProjectSchema).max(10).optional().default([]),
  recommended_resources: z.array(recommendedResourceSchema).max(20).optional().default([]),
  practice_questions: z.array(practiceQuestionSchema).max(20).optional().default([]),
  learning_order: z.array(z.string().trim()).max(30).optional().default([]),
  summary: z.string().trim().optional().default("Skill gap analysis completed based on role taxonomy and market demand."),
  next_learning_step: z.string().trim().optional().default("Focus on foundational core gaps and recommended hands-on projects."),
});

const skillGapAnalysisSchema = z.preprocess((val) => {
  if (!val || typeof val !== "object") return val;
  const obj = { ...val };
  if (!obj.recommended_resources && obj.recommended_courses) {
    obj.recommended_resources = obj.recommended_courses;
  }
  if (!obj.learning_order && obj.learning_path) {
    obj.learning_order = obj.learning_path;
  }
  if (!obj.summary && obj.overview) {
    obj.summary = obj.overview;
  }
  if (!obj.next_learning_step && obj.next_step) {
    obj.next_learning_step = obj.next_step;
  }
  return obj;
}, baseSkillGapSchema);

module.exports = {
  skillGapAnalysisSchema,
};
