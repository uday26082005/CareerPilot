const { AppError } = require("../../middleware/error/AppError");
const { getSupabaseAdmin } = require("../../config/supabase");
const aiService = require("../ai/groq.service");
const { generateQuestionSchema, evaluateAnswerSchema, generateReportSchema } = require("../../schemas/interview.schema");

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
const HTTP_STATUS_BAD_REQUEST = 400;

// Reusable data fetcher
const fetchUserContext = async (userId, supabase) => {
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single();
  const { data: resumeAnalysis } = await supabase.from("resume_analysis").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).single();
  const { data: skillGapAnalysis } = await supabase.from("skill_gap_analysis").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).single();
  const { data: roadmap } = await supabase.from("roadmaps").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1).single();

  return { profile, resumeAnalysis, skillGapAnalysis, roadmap };
};

const getSubTopic = (type, qNum) => {
  if (type === "Technical Interview") {
    const topics = [
      "Language Fundamentals & Core Concepts",
      "Data Structures (Arrays, HashMaps, etc.)",
      "Algorithms & Time Complexity",
      "Debugging, Testing & Code Review",
      "API Design or Micro-Architecture (NOT large-scale System Design)"
    ];
    return topics[(qNum - 1) % topics.length];
  }
  if (type === "Behavioral Interview") {
    const topics = [
      "Past Failures & Lessons Learned",
      "Conflict Resolution with Peers/Managers",
      "Leadership, Initiative & Ownership",
      "Time Management under Tight Deadlines",
      "Adaptability & Learning New Technologies"
    ];
    return topics[(qNum - 1) % topics.length];
  }
  // For Role-specific and Company-specific
  const topics = [
    "Day-to-day Frameworks & Tools",
    "Best Practices & Clean Code",
    "System Design & Scalability", // Only 1 system design question
    "Production Troubleshooting & Incident Response",
    "Cross-functional Collaboration & Engineering Trade-offs"
  ];
  return topics[(qNum - 1) % topics.length];
};

const buildQuestionPrompt = (context, type, difficulty, company, prevQuestions, subTopic) => {
  let typeInstructions = "";
  if (type === "Technical Interview") {
    typeInstructions = `This is a Technical interview. The specific sub-topic focus for THIS exact question MUST be: ${subTopic}.`;
  } else if (type === "Behavioral Interview") {
    typeInstructions = `This is a Behavioral interview. The specific sub-topic focus for THIS exact question MUST be: ${subTopic}.`;
  } else if (type === "Role-specific Interview") {
    typeInstructions = `This is a Role-Specific interview for a ${context.profile?.target_role || "Software Engineer"}. The specific sub-topic focus for THIS exact question MUST be: ${subTopic}.`;
  } else if (type === "Company-specific") {
    typeInstructions = `This is a Company-specific interview for ${company || "top tech companies"}. The specific sub-topic focus for THIS exact question MUST be: ${subTopic}. You MUST explicitly mention ${company} or its specific products/scenarios.`;
  }

  let prompt = `You are an expert technical interviewer and hiring manager at top tech companies.
Your goal is to conduct a realistic mock interview with a candidate.

Interview Details:
- Type: ${type}
- Difficulty: ${difficulty}
- Target Role: ${context.profile?.target_role || "Software Engineer"}
- Current Role: ${context.profile?.current_role || "Unknown"}
- Years Experience: ${context.profile?.years_experience || "0"}

Candidate Context (Use this to personalize the question):
- Known Skills (from resume): ${JSON.stringify(context.skillGapAnalysis?.matched_skills || [])}
- Missing Skills (needs learning): ${JSON.stringify(context.skillGapAnalysis?.missing_skills || [])}

Previous Questions Asked in this Session:
${prevQuestions.map((q, i) => `${i+1}. Topic: ${q.category} | Question: ${q.question}`).join("\n") || "None yet. This is the first question."}

TASK:
Generate EXACTLY ONE interview question based on the Interview Details and Candidate Context. 
CRITICAL: The new question MUST cover a completely different topic or concept than all previous questions listed above. DO NOT ask a similar question or test the same concept twice.

${typeInstructions}

Return the data as a JSON object precisely following this exact JSON structure:
{
  "question": "The interview question text",
  "category": "e.g., DSA, Behavioral, System Design, React",
  "difficulty": "${difficulty}",
  "expected_answer": "A detailed explanation of what a good answer should look like"
}`;
  return prompt;
};

const buildEvaluationPrompt = (question, expectedAnswer, userAnswer, type) => {
  return `You are an expert technical interviewer evaluating a candidate's answer.

Question: ${question}
Expected Ideal Answer Guidelines: ${expectedAnswer}
Candidate's Answer: "${userAnswer}"
Interview Type: ${type}

TASK:
Evaluate the candidate's answer based on correctness, clarity, completeness, and depth.
If they just said "I don't know", the score should be 0.
Score the answer out of 10.

Return the data as a JSON object precisely following this exact JSON structure:
{
  "score": 0, // integer from 0 to 10
  "strengths": ["string", "string"], // what they did well
  "improvements": ["string", "string"], // what they missed or got wrong
  "ideal_answer": "string", // how you would answer it perfectly
  "next_focus": "string" // one sentence advice
}`;
};

const buildReportPrompt = (questions) => {
  return `You are a Senior Engineering Manager providing final feedback after a mock interview.

Interview Performance Data:
${questions.map((q, i) => `
Q${i+1}: ${q.question}
Category: ${q.category}
User Answer: ${q.user_answer}
Score: ${q.score}/10
`).join("\n")}

TASK:
Provide a final holistic evaluation of the candidate. Calculate realistic scores (out of 100) based on their actual performance.
CRITICAL: Keep the summary extremely concise and punchy (maximum 1 to 2 short sentences). Do not write a long paragraph.

Return the data as a JSON object precisely following this exact JSON structure:
{
  "overall_score": 0, // 0 to 100
  "communication_score": 0, // 0 to 100
  "technical_score": 0, // 0 to 100 (0 if behavioral only)
  "confidence_score": 0, // 0 to 100 based on answer assertiveness
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommended_practice": ["string"],
  "summary": "A short 1-2 sentence summary"
}`;
};

const startInterview = async (userId, payload) => {
  const supabase = getSupabaseAdmin();
  const context = await fetchUserContext(userId, supabase);
  
  if (!context.profile) {
    throw new AppError("Profile not found. Please complete your profile.", HTTP_STATUS_NOT_FOUND);
  }

  // 1. Create Interview Session
  const { data: interview, error: insertError } = await supabase
    .from("interviews")
    .insert({
      user_id: userId,
      interview_type: payload.interviewType,
      target_role: context.profile.target_role || "Software Engineer",
      company_name: payload.companyName || null,
      difficulty: payload.difficulty,
      total_questions: 5,
      current_question: 1,
      status: 'In Progress'
    })
    .select()
    .single();

  if (insertError) {
    throw new AppError(`Failed to start interview. ${insertError.message}`, HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  // 2. Generate First Question (Question 1 is Easy)
  const currentDifficulty = "Easy";
  const subTopic = getSubTopic(payload.interviewType, 1);
  const prompt = buildQuestionPrompt(context, payload.interviewType, currentDifficulty, payload.companyName, [], subTopic);
  
  let aiQuestion;
  try {
    aiQuestion = await aiService.generateStructuredResponse(prompt, generateQuestionSchema);
  } catch (error) {
    throw new AppError(`AI Failed to generate question: ${error.message}`, HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  // 3. Save First Question
  const { data: questionData, error: qError } = await supabase
    .from("interview_questions")
    .insert({
      interview_id: interview.id,
      question_number: 1,
      question: aiQuestion.question,
      category: aiQuestion.category,
      difficulty: aiQuestion.difficulty,
      expected_answer: aiQuestion.expected_answer
    })
    .select()
    .single();

  if (qError) {
    throw new AppError("Failed to save generated question.", HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  return {
    interview_id: interview.id,
    current_question_number: 1,
    total_questions: 5,
    question: {
      id: questionData.id,
      text: questionData.question,
      category: questionData.category,
      difficulty: questionData.difficulty
    }
  };
};

const answerQuestion = async (userId, interviewId, payload) => {
  const supabase = getSupabaseAdmin();
  
  // 1. Get Active Interview and Current Question
  const { data: interview, error: iError } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", interviewId)
    .eq("user_id", userId)
    .single();

  if (iError || !interview) {
    throw new AppError("Interview not found.", HTTP_STATUS_NOT_FOUND);
  }

  if (interview.status !== 'In Progress') {
    throw new AppError("Interview is already completed.", HTTP_STATUS_BAD_REQUEST);
  }

  const { data: currentQ, error: qError } = await supabase
    .from("interview_questions")
    .select("*")
    .eq("interview_id", interviewId)
    .eq("question_number", interview.current_question)
    .single();

  if (qError || !currentQ) {
    throw new AppError("Current question not found.", HTTP_STATUS_NOT_FOUND);
  }

  // 2. Evaluate Answer using AI
  const evalPrompt = buildEvaluationPrompt(currentQ.question, currentQ.expected_answer, payload.answer, interview.interview_type);
  
  let evaluation;
  try {
    evaluation = await aiService.generateStructuredResponse(evalPrompt, evaluateAnswerSchema);
  } catch (error) {
    throw new AppError(`AI Failed to evaluate answer: ${error.message}`, HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  // 3. Save Evaluation
  await supabase
    .from("interview_questions")
    .update({
      user_answer: payload.answer,
      score: evaluation.score,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      ideal_answer: evaluation.ideal_answer,
      next_focus: evaluation.next_focus
    })
    .eq("id", currentQ.id);

  // 4. Determine Next Step (Next Question vs Finish)
  let isComplete = interview.current_question >= interview.total_questions;
  let nextQuestionData = null;

  if (!isComplete) {
    // Generate next question
    const context = await fetchUserContext(userId, supabase);
    const { data: prevQs } = await supabase.from("interview_questions").select("question").eq("interview_id", interviewId);
    
    // Determine dynamic difficulty (2 Easy, 2 Medium, 1 Hard)
    const nextQNum = interview.current_question + 1;
    let currentDifficulty = "Easy";
    if (nextQNum === 3 || nextQNum === 4) currentDifficulty = "Medium";
    if (nextQNum === 5) currentDifficulty = "Hard";

    const subTopic = getSubTopic(interview.interview_type, nextQNum);
    const nextQPrompt = buildQuestionPrompt(context, interview.interview_type, currentDifficulty, interview.company_name, prevQs || [], subTopic);
    
    let aiQuestion;
    try {
      aiQuestion = await aiService.generateStructuredResponse(nextQPrompt, generateQuestionSchema);
    } catch (error) {
      throw new AppError(`AI Failed to generate next question: ${error.message}`, HTTP_STATUS_INTERNAL_SERVER_ERROR);
    }
    
    const { data: savedNextQ } = await supabase
      .from("interview_questions")
      .insert({
        interview_id: interview.id,
        question_number: nextQNum,
        question: aiQuestion.question,
        category: aiQuestion.category,
        difficulty: aiQuestion.difficulty,
        expected_answer: aiQuestion.expected_answer
      })
      .select()
      .single();

    nextQuestionData = savedNextQ;

    await supabase
      .from("interviews")
      .update({ current_question: nextQNum })
      .eq("id", interviewId);
  }

  return {
    evaluation,
    is_complete: isComplete,
    next_question: nextQuestionData ? {
      id: nextQuestionData.id,
      text: nextQuestionData.question,
      category: nextQuestionData.category,
      difficulty: nextQuestionData.difficulty
    } : null
  };
};

const updateStatistics = async (userId, supabase, report) => {
  // Fetch existing stats
  const { data: stats } = await supabase.from("interview_statistics").select("*").eq("user_id", userId).single();

  if (!stats) {
    // Initial insert
    await supabase.from("interview_statistics").insert({
      user_id: userId,
      total_interviews: 1,
      average_score: report.overall_score,
      technical_average: report.technical_score,
      behavioral_average: report.overall_score, // simplified
      role_average: report.overall_score,
      company_average: report.overall_score,
      best_score: report.overall_score,
      lowest_score: report.overall_score,
      last_interview: new Date().toISOString()
    });
  } else {
    // Update aggregates
    const newTotal = stats.total_interviews + 1;
    const newAvg = Math.round(((stats.average_score * stats.total_interviews) + report.overall_score) / newTotal);
    const newBest = Math.max(stats.best_score, report.overall_score);
    const newLowest = Math.min(stats.lowest_score, report.overall_score);

    await supabase.from("interview_statistics").update({
      total_interviews: newTotal,
      average_score: newAvg,
      best_score: newBest,
      lowest_score: newLowest,
      last_interview: new Date().toISOString()
    }).eq("user_id", userId);
  }
};

const completeInterview = async (userId, interviewId) => {
  const supabase = getSupabaseAdmin();
  
  const { data: interview } = await supabase.from("interviews").select("*").eq("id", interviewId).eq("user_id", userId).single();
  if (!interview || interview.status === 'Completed') {
    throw new AppError("Invalid interview or already completed.", HTTP_STATUS_BAD_REQUEST);
  }

  // Fetch all answered questions
  const { data: questions } = await supabase
    .from("interview_questions")
    .select("*")
    .eq("interview_id", interviewId)
    .not("user_answer", "is", null)
    .order("question_number", { ascending: true });

  if (!questions || questions.length === 0) {
    throw new AppError("No answered questions found.", HTTP_STATUS_BAD_REQUEST);
  }

  const reportPrompt = buildReportPrompt(questions);
  
  let report;
  try {
    report = await aiService.generateStructuredResponse(reportPrompt, generateReportSchema);
  } catch (error) {
    throw new AppError(`AI Failed to generate report: ${error.message}`, HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  // Save report to interview
  const { data: savedInterview } = await supabase
    .from("interviews")
    .update({
      status: 'Completed',
      overall_score: report.overall_score,
      communication_score: report.communication_score,
      technical_score: report.technical_score,
      confidence_score: report.confidence_score,
      feedback_summary: report.summary,
      recommended_practice: report.recommended_practice,
      completed_at: new Date().toISOString()
    })
    .eq("id", interviewId)
    .select()
    .single();

  // Update statistics
  await updateStatistics(userId, supabase, report);

  return {
    interview: savedInterview,
    report
  };
};

const getInterviewHistory = async (userId, limit = 10) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("interviews")
    .select("id, interview_type, target_role, company_name, difficulty, overall_score, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
    
  if (error) throw new AppError("Failed to fetch history", HTTP_STATUS_INTERNAL_SERVER_ERROR);
  return data;
};

const getInterviewStatistics = async (userId) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("interview_statistics").select("*").eq("user_id", userId).single();
  
  if (error && error.code !== 'PGRST116') {
    throw new AppError("Failed to fetch statistics", HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }
  
  return data || {
    total_interviews: 0,
    average_score: 0,
    best_score: 0,
    lowest_score: 0
  };
};

const getInterviewDetails = async (userId, interviewId) => {
  const supabase = getSupabaseAdmin();
  const { data: interview, error: iError } = await supabase
    .from("interviews")
    .select("*")
    .eq("id", interviewId)
    .eq("user_id", userId)
    .single();

  if (iError || !interview) throw new AppError("Interview not found", HTTP_STATUS_NOT_FOUND);

  const { data: questions } = await supabase
    .from("interview_questions")
    .select("*")
    .eq("interview_id", interviewId)
    .order("question_number", { ascending: true });

  return { interview, questions };
};

const deleteInterview = async (userId, interviewId) => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("interviews")
    .delete()
    .eq("id", interviewId)
    .eq("user_id", userId);

  if (error) throw new AppError("Failed to delete interview", HTTP_STATUS_INTERNAL_SERVER_ERROR);
  return { success: true };
};

module.exports = {
  startInterview,
  answerQuestion,
  completeInterview,
  getInterviewHistory,
  getInterviewStatistics,
  getInterviewDetails,
  deleteInterview
};
