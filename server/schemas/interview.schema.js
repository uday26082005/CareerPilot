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

const stringOrArrayToString = z.preprocess((val) => {
  if (Array.isArray(val)) {
    return val.join("\n");
  }
  return typeof val === "string" ? val : String(val || "");
}, z.string().trim());

const arrayOrStringToArray = z.preprocess((val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") return [val];
  return [];
}, z.array(z.string().trim()));

// Used by Groq for generating a question
const generateQuestionSchema = z.object({
  question: stringOrArrayToString,
  category: z.string().trim(),
  difficulty: z.string().trim(),
  expected_answer: stringOrArrayToString,
});

// Used by Groq for evaluating an answer
const evaluateAnswerSchema = z.object({
  score: z.preprocess((val) => Number(val) || 0, z.number().min(0).max(10)),
  strengths: arrayOrStringToArray,
  improvements: arrayOrStringToArray,
  ideal_answer: stringOrArrayToString,
  next_focus: stringOrArrayToString,
});

// Used by Groq for final report
const generateReportSchema = z.object({
  overall_score: z.preprocess((val) => Number(val) || 0, z.number().min(0).max(100)),
  communication_score: z.preprocess((val) => Number(val) || 0, z.number().min(0).max(100)),
  technical_score: z.preprocess((val) => Number(val) || 0, z.number().min(0).max(100)),
  confidence_score: z.preprocess((val) => Number(val) || 0, z.number().min(0).max(100)),
  strengths: arrayOrStringToArray,
  weaknesses: arrayOrStringToArray,
  recommended_practice: arrayOrStringToArray.optional().default([]),
  summary: stringOrArrayToString,
});

module.exports = {
  startInterviewSchema,
  answerQuestionSchema,
  generateQuestionSchema,
  evaluateAnswerSchema,
  generateReportSchema,
};
