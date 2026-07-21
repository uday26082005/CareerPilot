const { z } = require("zod");

const startInterviewSchema = z.object({
  body: z.object({
    interviewType: z.string().trim(),
    difficulty: z.string().trim(),
    companyName: z.string().trim().optional(),
  }),
});

const answerQuestionSchema = z.object({
  body: z.object({
    answer: z.string().trim(),
  }),
});

// Used by Groq for generating a question
const generateQuestionSchema = z.object({
  question: z.string().trim(),
  category: z.string().trim(),
  difficulty: z.string().trim(),
  expected_answer: z.string().trim(),
});

// Used by Groq for evaluating an answer
const evaluateAnswerSchema = z.object({
  score: z.number().min(0).max(10),
  strengths: z.array(z.string().trim()),
  improvements: z.array(z.string().trim()),
  ideal_answer: z.string().trim(),
  next_focus: z.string().trim(),
});

// Used by Groq for final report
const generateReportSchema = z.object({
  overall_score: z.number().min(0).max(100),
  communication_score: z.number().min(0).max(100),
  technical_score: z.number().min(0).max(100),
  confidence_score: z.number().min(0).max(100),
  strengths: z.array(z.string().trim()),
  weaknesses: z.array(z.string().trim()),
  recommended_practice: z.array(z.string().trim()),
  summary: z.string().trim(),
});

module.exports = {
  startInterviewSchema,
  answerQuestionSchema,
  generateQuestionSchema,
  evaluateAnswerSchema,
  generateReportSchema,
};
