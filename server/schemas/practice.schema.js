const { z } = require("zod");

const PRACTICE_CATEGORIES = [
  "Data Structures & Algorithms",
  "SQL",
  "DBMS",
  "Operating Systems",
  "Computer Networks",
  "Object Oriented Programming",
  "Java",
  "Python",
  "JavaScript",
  "React",
  "Node.js",
  "System Design",
  "Aptitude",
  "Behavioral Practice",
  // Compatibility category for the pre-existing Practice Arena card.
  "DevOps & Cloud",
];

const PRACTICE_DIFFICULTIES = ["Easy", "Medium", "Hard"];
const QUESTION_TYPES = [
  "Multiple Choice",
  "Coding Challenge",
  "Short Answer",
  "True / False",
  "Scenario Based",
  "Fill in the Blank",
];

const startPracticeSchema = z.object({
  body: z.object({
    category: z.enum(PRACTICE_CATEGORIES),
    difficulty: z.enum(PRACTICE_DIFFICULTIES).default("Medium"),
    totalQuestions: z.number().int().min(1).max(20).default(10),
  }),
});

const answerPracticeSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ answer: z.string().trim().min(1).max(12000) }),
});

const practiceIdSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const practiceHistorySchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(50).default(10),
  }),
});

// The AI must return only this question payload. Correctness, progress, and
// aggregate statistics are calculated by the backend, not the model.
const generatePracticeQuestionSchema = z.object({
  question: z.string().trim().min(1),
  question_type: z.enum(QUESTION_TYPES),
  difficulty: z.enum(PRACTICE_DIFFICULTIES),
  options: z.array(z.string().trim()).max(6).default([]),
  correct_answer: z.string().trim().min(1),
  hint: z.string().trim().default(""),
  explanation: z.string().trim().default(""),
});

const evaluatePracticeAnswerSchema = z.object({
  score: z.number().int().min(0).max(10),
  correct: z.boolean(),
  feedback: z.string().trim(),
  explanation: z.string().trim(),
  next_focus: z.string().trim(),
});

const generatePracticeReportNarrativeSchema = z.object({
  strengths: z.array(z.string().trim()).max(5).default([]),
  weaknesses: z.array(z.string().trim()).max(5).default([]),
  recommended_topics: z.array(z.string().trim()).max(5).default([]),
  summary: z.string().trim(),
});

module.exports = {
  PRACTICE_CATEGORIES,
  PRACTICE_DIFFICULTIES,
  QUESTION_TYPES,
  startPracticeSchema,
  answerPracticeSchema,
  practiceIdSchema,
  practiceHistorySchema,
  generatePracticeQuestionSchema,
  evaluatePracticeAnswerSchema,
  generatePracticeReportNarrativeSchema,
};
