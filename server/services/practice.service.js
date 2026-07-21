const { AppError } = require("../middleware/error/AppError");
const { getSupabaseAdmin } = require("../config/supabase");
const aiService = require("./ai/groq.service");
const {
  PRACTICE_DIFFICULTIES,
  QUESTION_TYPES,
  generatePracticeQuestionSchema,
  evaluatePracticeAnswerSchema,
  generatePracticeReportNarrativeSchema,
} = require("../schemas/practice.schema");

const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const UNPROCESSABLE_ENTITY = 422;
const INTERNAL_SERVER_ERROR = 500;

const QUESTION_TYPE_PLANS = {
  "Data Structures & Algorithms": ["Multiple Choice", "Coding Challenge", "Short Answer", "Fill in the Blank", "True / False"],
  "Behavioral Practice": ["Scenario Based", "Short Answer", "Fill in the Blank", "Multiple Choice", "True / False"],
  Aptitude: ["Multiple Choice", "Fill in the Blank", "Short Answer", "True / False", "Scenario Based"],
  default: ["Multiple Choice", "Short Answer", "Scenario Based", "True / False", "Fill in the Blank", "Coding Challenge"],
};

const asArray = (value) => (Array.isArray(value) ? value : []);
const round = (value) => Math.round(Number(value) || 0);
const createDatabaseError = (message, error) => new AppError(
  message + (error && error.message ? " " + error.message : ""),
  INTERNAL_SERVER_ERROR
);

const getLatestForUser = async (supabase, table, userId) => {
  const result = await supabase
    .from(table)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (result.error) throw createDatabaseError("Failed to load " + table + ".", result.error);
  return result.data && result.data[0] ? result.data[0] : null;
};

const getPracticeSignals = async (supabase, userId) => {
  const sessionsResult = await supabase
    .from("practice_sessions")
    .select("id, category, completed_at")
    .eq("user_id", userId)
    .eq("status", "Completed")
    .order("completed_at", { ascending: false })
    .limit(10);

  if (sessionsResult.error) throw createDatabaseError("Failed to load previous practice sessions.", sessionsResult.error);
  const sessions = sessionsResult.data || [];
  if (!sessions.length) return { strongTopics: [], weakTopics: [], previousSessions: [] };

  const questionsResult = await supabase
    .from("practice_questions")
    .select("practice_session_id, score")
    .in("practice_session_id", sessions.map((session) => session.id))
    .not("score", "is", null);

  if (questionsResult.error) throw createDatabaseError("Failed to load previous practice performance.", questionsResult.error);

  const categoryBySession = new Map(sessions.map((session) => [session.id, session.category]));
  const totals = new Map();
  for (const question of questionsResult.data || []) {
    const category = categoryBySession.get(question.practice_session_id);
    if (!category) continue;
    const total = totals.get(category) || { score: 0, attempts: 0 };
    total.score += Number(question.score) || 0;
    total.attempts += 1;
    totals.set(category, total);
  }

  const ranked = Array.from(totals.entries())
    .filter((entry) => entry[1].attempts > 0)
    .map((entry) => ({ category: entry[0], average: entry[1].score / entry[1].attempts }))
    .sort((a, b) => b.average - a.average);

  return {
    strongTopics: ranked.slice(0, 3).map((item) => item.category),
    weakTopics: ranked.slice(-3).reverse().map((item) => item.category),
    previousSessions: sessions.slice(0, 5).map((session) => ({ category: session.category, completed_at: session.completed_at })),
  };
};

const fetchPracticeContext = async (userId, supabase) => {
  const results = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).single(),
    getLatestForUser(supabase, "resume_analysis", userId),
    getLatestForUser(supabase, "skill_gap_analysis", userId),
    getLatestForUser(supabase, "roadmaps", userId),
    supabase
      .from("interviews")
      .select("interview_type, overall_score, feedback_summary, recommended_practice, completed_at")
      .eq("user_id", userId)
      .eq("status", "Completed")
      .order("completed_at", { ascending: false })
      .limit(3),
    getPracticeSignals(supabase, userId),
  ]);

  const profileResult = results[0];
  const interviewResult = results[4];
  if (profileResult.error || !profileResult.data) {
    throw new AppError("Profile not found. Please complete your profile before starting practice.", NOT_FOUND);
  }
  if (interviewResult.error) throw createDatabaseError("Failed to load mock interview history.", interviewResult.error);

  return {
    profile: profileResult.data,
    resumeAnalysis: results[1],
    skillGapAnalysis: results[2],
    roadmap: results[3],
    interviews: interviewResult.data || [],
    ...results[5],
  };
};

const getQuestionType = (category, questionNumber) => {
  const plan = QUESTION_TYPE_PLANS[category] || QUESTION_TYPE_PLANS.default;
  return plan[(questionNumber - 1) % plan.length];
};

const getAdaptiveDifficulty = (baseDifficulty, questions) => {
  const scores = questions
    .filter((question) => question.score !== null && question.score !== undefined)
    .slice(-2)
    .map((question) => Number(question.score));

  if (!scores.length) return baseDifficulty;
  const average = scores.reduce((total, score) => total + score, 0) / scores.length;
  const baseIndex = PRACTICE_DIFFICULTIES.indexOf(baseDifficulty);
  if (average >= 8) return PRACTICE_DIFFICULTIES[Math.min(baseIndex + 1, PRACTICE_DIFFICULTIES.length - 1)];
  if (average <= 4) return PRACTICE_DIFFICULTIES[Math.max(baseIndex - 1, 0)];
  return baseDifficulty;
};

const compactContext = (context) => ({
  profile: {
    current_role: context.profile.current_role || "Not specified",
    target_role: context.profile.target_role || "Software Engineer",
    years_experience: context.profile.years_experience || 0,
  },
  resume_analysis: context.resumeAnalysis ? {
    skills: asArray(context.resumeAnalysis.skills),
    overall_summary: context.resumeAnalysis.overall_summary || "Available",
  } : "Unavailable; do not invent resume facts.",
  skill_gap: context.skillGapAnalysis ? {
    matched_skills: asArray(context.skillGapAnalysis.matched_skills),
    missing_skills: asArray(context.skillGapAnalysis.missing_skills),
    priority_skills: asArray(context.skillGapAnalysis.priority_skills),
    learning_order: asArray(context.skillGapAnalysis.learning_order),
  } : "Unavailable; use the requested category and target role.",
  roadmap: context.roadmap ? {
    summary: context.roadmap.summary || "",
    current_phase: context.roadmap.current_phase,
  } : "Unavailable.",
  recent_mock_interviews: context.interviews.map((interview) => ({
    type: interview.interview_type,
    score: interview.overall_score,
    feedback: interview.feedback_summary,
    recommendations: asArray(interview.recommended_practice),
  })),
  strong_topics: context.strongTopics,
  weak_topics: context.weakTopics,
  previous_practice_sessions: context.previousSessions,
});

const buildQuestionPrompt = (context, session, questionNumber, difficulty, questionType, previousQuestions) => [
  "You are the CareerPilot Practice Arena question generator.",
  "Create exactly one personalized practice question. Use the provided context to target a genuine weak area where available, while keeping the question aligned to the requested practice category.",
  "",
  "Candidate context:",
  JSON.stringify(compactContext(context)),
  "",
  "Session:",
  "- Category: " + session.category,
  "- Target role: " + session.target_role,
  "- Difficulty: " + difficulty,
  "- Question number: " + questionNumber + " of " + session.total_questions,
  "- Required question type: " + questionType,
  "",
  "Previously asked questions (do not repeat their concept):",
  previousQuestions.map((question) => "- " + question.question).join("\n") || "None",
  "",
  "Rules:",
  "- Generate one original, interview-relevant question only.",
  "- Use exactly the required question type and difficulty.",
  "- For Multiple Choice, provide exactly four plausible options. For True / False, provide exactly [\"True\", \"False\"]. For Coding Challenge, Short Answer, Scenario Based, and Fill in the Blank, use an empty options array.",
  "- The explanation must be concise and teach the concept. The hint must help without revealing the answer.",
  "- Do not calculate or mention progress, completion, aggregate statistics, or accuracy.",
  "- Return strict JSON only. Do not wrap it in Markdown.",
  "",
  "{",
  "  \"question\": \"\",",
  "  \"question_type\": \"" + questionType + "\",",
  "  \"difficulty\": \"" + difficulty + "\",",
  "  \"options\": [],",
  "  \"correct_answer\": \"\",",
  "  \"hint\": \"\",",
  "  \"explanation\": \"\"",
  "}",
].join("\n");

const buildEvaluationPrompt = (question, answer) => [
  "You are the CareerPilot Practice Arena evaluator.",
  "",
  "Question type: " + question.question_type,
  "Question: " + question.question,
  "Options: " + JSON.stringify(asArray(question.options)),
  "Expected answer: " + question.correct_answer,
  "Candidate answer: " + answer,
  "",
  "Evaluate correctness and quality. Use score 0 for a skipped, empty, or I do not know response. Be concise, constructive, and technically accurate.",
  "Do not calculate progress, completion, aggregate statistics, or accuracy.",
  "Return strict JSON only:",
  "{",
  "  \"score\": 0,",
  "  \"correct\": false,",
  "  \"feedback\": \"\",",
  "  \"explanation\": \"\",",
  "  \"next_focus\": \"\"",
  "}",
].join("\n");

const buildReportNarrativePrompt = (session, questions, metrics) => [
  "You are the CareerPilot Practice Arena coach.",
  "Write qualitative feedback for this completed practice session. The backend has already calculated every numerical metric below.",
  "Do not recalculate, alter, or return any scores, accuracy, statistics, progress, or completion figures.",
  "",
  "Session: " + session.category + " for " + session.target_role,
  "Backend-calculated metrics for context only: overall score " + metrics.overallScore + "/100; accuracy " + metrics.accuracy + "%.",
  "Question results:",
  questions.map((question) => "- " + question.question + "\n  score: " + question.score + "/10; feedback: " + ((question.ai_feedback && question.ai_feedback.feedback) || "") + "; next focus: " + ((question.ai_feedback && question.ai_feedback.next_focus) || "")).join("\n"),
  "",
  "Return strict JSON only:",
  "{",
  "  \"strengths\": [\"\"],",
  "  \"weaknesses\": [\"\"],",
  "  \"recommended_topics\": [\"\"],",
  "  \"summary\": \"\"",
  "}",
].join("\n");

const toPublicQuestion = (question, includeSolution = false) => {
  const result = {
    id: question.id,
    question_number: question.question_number,
    question: question.question,
    question_type: question.question_type,
    difficulty: question.difficulty,
    options: asArray(question.options),
    hint: asArray(question.hints)[0] || "",
    user_answer: question.user_answer || null,
    score: question.score,
    feedback: question.ai_feedback || null,
  };

  if (includeSolution) {
    result.correct_answer = question.correct_answer;
    result.explanation = question.explanation;
    result.is_correct = question.is_correct;
  }
  return result;
};

const validateQuestionShape = (question, requiredType) => {
  if (question.question_type !== requiredType) {
    throw new AppError("AI returned an unexpected practice question type. Please try again.", INTERNAL_SERVER_ERROR);
  }
  if (requiredType === "Multiple Choice" && question.options.length !== 4) {
    throw new AppError("AI returned an invalid multiple-choice question. Please try again.", INTERNAL_SERVER_ERROR);
  }
  if (requiredType === "True / False" && (question.options.length !== 2 || !question.options.includes("True") || !question.options.includes("False"))) {
    throw new AppError("AI returned an invalid true/false question. Please try again.", INTERNAL_SERVER_ERROR);
  }
};

const generateAndSaveQuestion = async (supabase, context, session, questionNumber, difficulty, previousQuestions) => {
  const questionType = getQuestionType(session.category, questionNumber);
  let aiQuestion;
  try {
    aiQuestion = await aiService.generateStructuredResponse(
      buildQuestionPrompt(context, session, questionNumber, difficulty, questionType, previousQuestions),
      generatePracticeQuestionSchema
    );
  } catch (error) {
    throw new AppError("AI failed to generate a practice question: " + error.message, INTERNAL_SERVER_ERROR);
  }

  validateQuestionShape(aiQuestion, questionType);
  const result = await supabase
    .from("practice_questions")
    .insert({
      practice_session_id: session.id,
      question_number: questionNumber,
      question: aiQuestion.question,
      question_type: aiQuestion.question_type,
      difficulty: aiQuestion.difficulty,
      options: aiQuestion.options,
      correct_answer: aiQuestion.correct_answer,
      explanation: aiQuestion.explanation,
      hints: aiQuestion.hint ? [aiQuestion.hint] : [],
    })
    .select()
    .single();

  if (result.error || !result.data) throw createDatabaseError("Failed to save generated practice question.", result.error);
  return result.data;
};

const getSession = async (supabase, userId, sessionId) => {
  const result = await supabase
    .from("practice_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .single();

  if (result.error || !result.data) throw new AppError("Practice session not found.", NOT_FOUND);
  return result.data;
};

const getSessionQuestions = async (supabase, sessionId) => {
  const result = await supabase
    .from("practice_questions")
    .select("*")
    .eq("practice_session_id", sessionId)
    .order("question_number", { ascending: true });

  if (result.error) throw createDatabaseError("Failed to load practice questions.", result.error);
  return result.data || [];
};

const calculateMetrics = (questions) => {
  const attempted = questions.filter((question) => question.user_answer !== null && question.user_answer !== undefined);
  const scoreTotal = attempted.reduce((total, question) => total + (Number(question.score) || 0), 0);
  const correct = attempted.filter((question) => question.is_correct).length;
  return {
    questionsAttempted: attempted.length,
    questionsCorrect: correct,
    overallScore: attempted.length ? round((scoreTotal / (attempted.length * 10)) * 100) : 0,
    accuracy: attempted.length ? round((correct / attempted.length) * 100) : 0,
  };
};

const buildProgress = (session, questions) => {
  const metrics = calculateMetrics(questions);
  return {
    current_question: session.current_question,
    total_questions: session.total_questions,
    questions_attempted: metrics.questionsAttempted,
    completed_questions: metrics.questionsAttempted,
    accuracy: metrics.accuracy,
    is_complete: session.current_question >= session.total_questions && metrics.questionsAttempted >= session.total_questions,
  };
};

const startPractice = async (userId, payload) => {
  const supabase = getSupabaseAdmin();
  const context = await fetchPracticeContext(userId, supabase);
  const sessionResult = await supabase
    .from("practice_sessions")
    .insert({
      user_id: userId,
      category: payload.category,
      difficulty: payload.difficulty,
      target_role: context.profile.target_role || "Software Engineer",
      status: "In Progress",
      total_questions: payload.totalQuestions,
      current_question: 1,
    })
    .select()
    .single();

  if (sessionResult.error || !sessionResult.data) throw createDatabaseError("Failed to create practice session.", sessionResult.error);
  const session = sessionResult.data;

  try {
    const question = await generateAndSaveQuestion(supabase, context, session, 1, payload.difficulty, []);
    return {
      practice_session_id: session.id,
      current_question_number: 1,
      total_questions: session.total_questions,
      question: toPublicQuestion(question),
      context_availability: {
        resume_analysis: Boolean(context.resumeAnalysis),
        skill_gap: Boolean(context.skillGapAnalysis),
        roadmap: Boolean(context.roadmap),
        mock_interview_history: context.interviews.length > 0,
      },
    };
  } catch (error) {
    await supabase.from("practice_sessions").delete().eq("id", session.id).eq("user_id", userId);
    throw error;
  }
};

const answerQuestion = async (userId, sessionId, payload) => {
  const supabase = getSupabaseAdmin();
  const session = await getSession(supabase, userId, sessionId);
  if (session.status !== "In Progress") throw new AppError("Practice session is already completed.", BAD_REQUEST);

  const currentResult = await supabase
    .from("practice_questions")
    .select("*")
    .eq("practice_session_id", session.id)
    .eq("question_number", session.current_question)
    .single();

  if (currentResult.error || !currentResult.data) throw new AppError("Current practice question not found.", NOT_FOUND);
  const currentQuestion = currentResult.data;
  if (currentQuestion.user_answer !== null) throw new AppError("This question has already been answered.", BAD_REQUEST);

  let evaluation;
  try {
    evaluation = await aiService.generateStructuredResponse(
      buildEvaluationPrompt(currentQuestion, payload.answer),
      evaluatePracticeAnswerSchema
    );
  } catch (error) {
    throw new AppError("AI failed to evaluate the practice answer: " + error.message, INTERNAL_SERVER_ERROR);
  }

  const updateResult = await supabase
    .from("practice_questions")
    .update({
      user_answer: payload.answer,
      score: evaluation.score,
      is_correct: evaluation.correct,
      ai_feedback: evaluation,
      explanation: evaluation.explanation || currentQuestion.explanation,
    })
    .eq("id", currentQuestion.id)
    .select()
    .single();

  if (updateResult.error || !updateResult.data) throw createDatabaseError("Failed to save practice answer.", updateResult.error);

  const allQuestions = await getSessionQuestions(supabase, session.id);
  const isLastQuestion = session.current_question >= session.total_questions;
  let nextQuestion = null;
  let updatedSession = session;

  if (!isLastQuestion) {
    const context = await fetchPracticeContext(userId, supabase);
    const nextNumber = session.current_question + 1;
    nextQuestion = await generateAndSaveQuestion(
      supabase,
      context,
      session,
      nextNumber,
      getAdaptiveDifficulty(session.difficulty, allQuestions),
      allQuestions
    );

    const advanceResult = await supabase
      .from("practice_sessions")
      .update({ current_question: nextNumber })
      .eq("id", session.id)
      .select()
      .single();
    if (advanceResult.error || !advanceResult.data) throw createDatabaseError("Failed to advance practice session.", advanceResult.error);
    updatedSession = advanceResult.data;
  }

  return {
    question: nextQuestion ? toPublicQuestion(nextQuestion) : null,
    evaluation,
    progress: buildProgress(updatedSession, allQuestions),
  };
};

const recalculatePracticeStatistics = async (userId, supabase) => {
  const sessionsResult = await supabase
    .from("practice_sessions")
    .select("id, category, completed_at")
    .eq("user_id", userId)
    .eq("status", "Completed")
    .order("completed_at", { ascending: false });

  if (sessionsResult.error) throw createDatabaseError("Failed to calculate practice statistics.", sessionsResult.error);
  const sessions = sessionsResult.data || [];
  let questions = [];

  if (sessions.length) {
    const questionsResult = await supabase
      .from("practice_questions")
      .select("practice_session_id, is_correct, user_answer")
      .in("practice_session_id", sessions.map((session) => session.id))
      .not("user_answer", "is", null);
    if (questionsResult.error) throw createDatabaseError("Failed to calculate practice statistics.", questionsResult.error);
    questions = questionsResult.data || [];
  }

  const categoryBySession = new Map(sessions.map((session) => [session.id, session.category]));
  const byCategory = new Map();
  for (const question of questions) {
    const category = categoryBySession.get(question.practice_session_id);
    if (!category) continue;
    const value = byCategory.get(category) || { attempted: 0, correct: 0 };
    value.attempted += 1;
    value.correct += question.is_correct ? 1 : 0;
    byCategory.set(category, value);
  }

  const ranked = Array.from(byCategory.entries())
    .filter((entry) => entry[1].attempted > 0)
    .map((entry) => ({
      category: entry[0],
      accuracy: entry[1].correct / entry[1].attempted,
      attempts: entry[1].attempted,
    }))
    .sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts);

  const correct = questions.filter((question) => question.is_correct).length;
  const statistics = {
    user_id: userId,
    total_sessions: sessions.length,
    questions_attempted: questions.length,
    questions_correct: correct,
    overall_accuracy: questions.length ? round((correct / questions.length) * 100) : 0,
    best_category: ranked[0] ? ranked[0].category : null,
    weakest_category: ranked.length ? ranked[ranked.length - 1].category : null,
    last_session: sessions[0] ? sessions[0].completed_at : null,
    updated_at: new Date().toISOString(),
  };

  const upsertResult = await supabase
    .from("practice_statistics")
    .upsert(statistics, { onConflict: "user_id" });
  if (upsertResult.error) throw createDatabaseError("Failed to save practice statistics.", upsertResult.error);
  return statistics;
};

const completePractice = async (userId, sessionId) => {
  const supabase = getSupabaseAdmin();
  const session = await getSession(supabase, userId, sessionId);
  if (session.status !== "In Progress") throw new AppError("Practice session is already completed.", BAD_REQUEST);

  const questions = await getSessionQuestions(supabase, session.id);
  const metrics = calculateMetrics(questions);
  if (!metrics.questionsAttempted) {
    throw new AppError("Answer at least one practice question before completing the session.", UNPROCESSABLE_ENTITY);
  }

  let narrative;
  try {
    narrative = await aiService.generateStructuredResponse(
      buildReportNarrativePrompt(session, questions, metrics),
      generatePracticeReportNarrativeSchema
    );
  } catch (error) {
    throw new AppError("AI failed to generate the practice report: " + error.message, INTERNAL_SERVER_ERROR);
  }

  const completedAt = new Date().toISOString();
  const completeResult = await supabase
    .from("practice_sessions")
    .update({
      status: "Completed",
      score: metrics.overallScore,
      accuracy: metrics.accuracy,
      completed_at: completedAt,
    })
    .eq("id", session.id)
    .select()
    .single();

  if (completeResult.error || !completeResult.data) throw createDatabaseError("Failed to complete practice session.", completeResult.error);
  await recalculatePracticeStatistics(userId, supabase);

  return {
    practice_session: completeResult.data,
    report: {
      overall_score: metrics.overallScore,
      accuracy: metrics.accuracy,
      strengths: narrative.strengths,
      weaknesses: narrative.weaknesses,
      recommended_topics: narrative.recommended_topics,
      summary: narrative.summary,
    },
  };
};

const getPracticeHistory = async (userId, limit = 10) => {
  const supabase = getSupabaseAdmin();
  const result = await supabase
    .from("practice_sessions")
    .select("id, category, difficulty, target_role, status, total_questions, current_question, score, accuracy, started_at, completed_at, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (result.error) throw createDatabaseError("Failed to fetch practice history.", result.error);
  return result.data || [];
};

const getPracticeStatistics = async (userId) => {
  const supabase = getSupabaseAdmin();
  const result = await supabase
    .from("practice_statistics")
    .select("total_sessions, questions_attempted, questions_correct, overall_accuracy, best_category, weakest_category, last_session, updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (result.error) throw createDatabaseError("Failed to fetch practice statistics.", result.error);
  return result.data || {
    total_sessions: 0,
    questions_attempted: 0,
    questions_correct: 0,
    overall_accuracy: 0,
    best_category: null,
    weakest_category: null,
    last_session: null,
  };
};

const getPracticeDetails = async (userId, sessionId) => {
  const supabase = getSupabaseAdmin();
  const session = await getSession(supabase, userId, sessionId);
  const questions = await getSessionQuestions(supabase, session.id);
  const includeSolution = session.status === "Completed";

  return {
    practice_session: session,
    questions: questions.map((question) => toPublicQuestion(question, includeSolution)),
  };
};

const deletePractice = async (userId, sessionId) => {
  const supabase = getSupabaseAdmin();
  await getSession(supabase, userId, sessionId);
  const result = await supabase
    .from("practice_sessions")
    .delete()
    .eq("id", sessionId)
    .eq("user_id", userId);

  if (result.error) throw createDatabaseError("Failed to delete practice session.", result.error);
  await recalculatePracticeStatistics(userId, supabase);
  return { success: true };
};

module.exports = {
  startPractice,
  answerQuestion,
  completePractice,
  getPracticeHistory,
  getPracticeStatistics,
  getPracticeDetails,
  deletePractice,
};

