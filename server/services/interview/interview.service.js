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

const getDifficultyForQuestion = (baseDifficulty, mainQNum) => {
  if (baseDifficulty === "Hard") {
    return mainQNum <= 2 ? "Medium" : "Hard";
  }
  if (baseDifficulty === "Easy") {
    return mainQNum <= 3 ? "Easy" : "Medium";
  }
  // Default / Medium:
  if (mainQNum === 1) return "Easy";
  if (mainQNum === 5) return "Hard";
  return "Medium";
};

const getMainTopic = (type, mainQNum) => {
  const normalizedType = (type || "").toLowerCase();

  if (normalizedType.includes("technical")) {
    const topics = [
      {
        name: "Language Fundamentals & Execution Models",
        directive: "Ask about core language mechanics, memory management, execution models, types, or event loops."
      },
      {
        name: "Data Structures & Memory Layout",
        directive: "Ask about fundamental data structures such as hash tables, trees, heaps, arrays, or linked structures, testing internal lookup and storage mechanics."
      },
      {
        name: "Algorithms & Computational Complexity",
        directive: "Ask about algorithms, search/sort techniques, dynamic programming, or recursion, testing time and space complexity."
      },
      {
        name: "Databases & Data Modeling",
        directive: "Ask about relational vs non-relational database trade-offs, indexing mechanisms, transactions (ACID), or query optimization."
      },
      {
        name: "System Architecture & High-Scale Reliability",
        directive: "Ask about distributed systems, microservices, API architecture, concurrency, caching, rate limiting, or fault tolerance."
      }
    ];
    return topics[(mainQNum - 1) % topics.length];
  }

  if (normalizedType.includes("behavioral")) {
    const topics = [
      {
        name: "Conflict Resolution & Team Collaboration",
        directive: "Ask for a specific situation where the candidate had a disagreement with a colleague or stakeholder and how they resolved it."
      },
      {
        name: "Leadership, Initiative & Ownership",
        directive: "Ask for an example where the candidate identified an unassigned problem, took ownership, and drove a project to completion."
      },
      {
        name: "Handling Deadlines, Pressure & Prioritization",
        directive: "Ask about an experience delivering a critical project under tight deadlines with competing priorities."
      },
      {
        name: "Navigating Failure, Mistakes & Adaptability",
        directive: "Ask about a project that did not go according to plan, a technical mistake they made, and how they handled the setback and learned from it."
      },
      {
        name: "Cross-Functional Influence & Mentorship",
        directive: "Ask about working with non-technical stakeholders (Product, Design, Sales) or mentoring others to achieve a successful outcome."
      }
    ];
    return topics[(mainQNum - 1) % topics.length];
  }

  if (normalizedType.includes("role")) {
    const topics = [
      {
        name: "Core Frameworks & Practical Stack",
        directive: "Ask a practical question regarding the core tech stack, lifecycle, or daily implementation patterns for this role."
      },
      {
        name: "Production Troubleshooting & Incident Response",
        directive: "Ask how they would diagnose, investigate, and resolve an urgent production issue (e.g. latency spike, memory leak, or data inconsistency)."
      },
      {
        name: "API Design & Component Architecture",
        directive: "Ask about architecting maintainable interfaces, API contracts, modular abstractions, or backward compatibility."
      },
      {
        name: "Testing Strategies & CI/CD Pipelines",
        directive: "Ask about balancing unit, integration, and end-to-end testing, automated verification, and preventing production regressions."
      },
      {
        name: "Security, Performance & Scalability Best Practices",
        directive: "Ask about securing endpoints, optimizing critical paths, caching strategies, or hardening the system for this role."
      }
    ];
    return topics[(mainQNum - 1) % topics.length];
  }

  // Company-specific
  const topics = [
    {
      name: "Company Mission, Architecture & Product Vision",
      directive: "Ask why they want to work at this specific company and how their technical background aligns with the company's core mission and product challenges."
    },
    {
      name: "High-Scale Traffic & Distributed Systems",
      directive: "Ask about designing or operating systems that handle massive user scale, concurrency, and low latency typical of this company."
    },
    {
      name: "Product Engineering & User-Centric Trade-offs",
      directive: "Ask about balancing fast feature iteration with technical excellence, code quality, and user experience."
    },
    {
      name: "Resilience, Fault Tolerance & Disaster Recovery",
      directive: "Ask how they design systems to handle partial outages, third-party failures, or graceful degradation under heavy load."
    },
    {
      name: "Engineering Culture & Large-Scale Teamwork",
      directive: "Ask about collaborating across distributed teams, conducting rigorous code reviews, and upholding engineering standards."
    }
  ];
  return topics[(mainQNum - 1) % topics.length];
};

const formatConversationHistory = (history) => {
  if (!history || history.length === 0) return "No previous exchanges.";
  return history
    .filter(item => item && (item.question || item.user_answer))
    .map(item => `Q${item.question_number} [${item.category || "General"}]: ${item.question}\nCandidate's Answer: "${item.user_answer || "No response provided"}"`)
    .join("\n\n");
};

const buildMainQuestionPrompt = ({
  context,
  interviewType,
  difficulty,
  companyName,
  mainQuestionNumber,
  subTopic,
  previousMainQuestions = [],
  companyQuestions = []
}) => {
  const targetRole = context.profile?.target_role || "Software Engineer";
  const yearsExp = context.profile?.years_experience || 0;
  const matchedSkills = context.skillGapAnalysis?.matched_skills || [];

  const prevQuestionsSummary = previousMainQuestions.length > 0
    ? `PREVIOUS MAIN QUESTIONS ASKED IN THIS SESSION (DO NOT REPEAT OR OVERLAP):\n${previousMainQuestions.map((q, i) => `- Main Topic ${i + 1}: "${q}"`).join("\n")}`
    : "This is the first main question of the interview session.";

  let categoryDirectives = "";
  if (interviewType === "Technical Interview") {
    categoryDirectives = `Category: Technical Interview
- Focus Topic for Main Question ${mainQuestionNumber} of 5: ${subTopic.name}.
- Directive: ${subTopic.directive}
- Ask a foundational, practical technical question testing core understanding of this topic.
- Tailor the depth to a candidate targeting ${targetRole} with ${yearsExp} years of experience.`;
  } else if (interviewType === "Behavioral Interview") {
    categoryDirectives = `Category: Behavioral Interview
- Competency for Main Question ${mainQuestionNumber} of 5: ${subTopic.name}.
- Directive: ${subTopic.directive}
- Ask an open-ended behavioral question targeting a specific past scenario so the candidate can use the STAR framework.`;
  } else if (interviewType === "Role-specific Interview") {
    categoryDirectives = `Category: Role-Specific Interview (${targetRole})
- Focus Area for Main Question ${mainQuestionNumber} of 5: ${subTopic.name}.
- Directive: ${subTopic.directive}
- Ask a realistic, practical question concerning the real-world responsibilities and architecture of a ${targetRole}.`;
  } else {
    // Company-specific
    const comp = companyName || "top tech companies";
    categoryDirectives = `Category: Company-Specific Interview (${comp} - ${targetRole})
- Focus Area for Main Question ${mainQuestionNumber} of 5: ${subTopic.name}.
- Directive: ${subTopic.directive}
${companyQuestions && companyQuestions.length > 0 
  ? `- Past Interview Questions from ${comp} for inspiration:\n${companyQuestions.slice(0, 5).map((q, i) => `  * ${q.question}`).join("\n")}`
  : `- Simulate a realistic interview question typical of ${comp} for a ${targetRole}.`}`;
  }

  return `You are an expert technical interviewer and hiring manager conducting a structured mock interview.
You are asking MAIN QUESTION ${mainQuestionNumber} of 5 (an independent, new topic).

Candidate Context:
- Target Role: ${targetRole}
- Experience: ${yearsExp} years
- Known Skills: ${JSON.stringify(matchedSkills)}

Interview Details:
- Type: ${interviewType}
- Target Difficulty: ${difficulty}
${companyName ? `- Target Company: ${companyName}` : ""}

${prevQuestionsSummary}

${categoryDirectives}

STRICT INTERVIEWER RULES:
1. ASK EXACTLY ONE INDEPENDENT QUESTION.
2. PREFER ONE CONCISE SENTENCE. At most TWO short sentences if strictly necessary.
3. ABSOLUTELY NO introductory filler, greetings, or conversational preambles (e.g., do NOT start with "Welcome", "Let's move on", "Next", or "In modern engineering"). Start directly with the question.
4. NO compound questions or multi-part prompts.
5. NO hints, solutions, or explanations inside the question.
6. The question MUST assess the assigned topic (${subTopic.name}) and MUST NOT continue or follow up on previous topics.

Return the data as a JSON object matching this schema:
{
  "question": "The concise interview question text",
  "category": "${subTopic.name}",
  "difficulty": "${difficulty}",
  "expected_answer": "2-3 short bullet points outlining what a strong answer covers"
}`;
};

const buildFollowUpQuestionPrompt = ({
  context,
  interviewType,
  difficulty,
  companyName,
  targetRole,
  mainQuestionNumber,
  followUpNumber,
  mainQuestion,
  mainAnswer,
  previousFollowUp,
  previousFollowUpAnswer,
  candidateAnswer,
  conversationHistory = []
}) => {
  const formattedHistory = formatConversationHistory(conversationHistory);

  let followUpDirective = "";
  if (followUpNumber === 1) {
    followUpDirective = `FOLLOW-UP 1 OF 2 FOR THIS TOPIC:
- Main Question Asked: "${mainQuestion?.question || ""}"
- Candidate's Answer: "${candidateAnswer}"
- YOUR GOAL: Actively listen to the candidate's answer and probe deeper into their specific statements, choices, or approach.
${interviewType === "Technical Interview" ? `- Probe into edge cases, time/space complexity, data structure choices, or trade-offs of what they just explained.` : ""}
${interviewType === "Behavioral Interview" ? `- Probe into their specific personal actions, decision-making rationale, or how they navigated challenges within their story.` : ""}
${interviewType === "Role-specific Interview" ? `- Probe into real-world production implementation, debugging, or practical edge cases for a ${targetRole}.` : ""}
${interviewType === "Company-specific" || interviewType === "Company-specific Interview" ? `- Probe into how their approach handles concurrency, high scale, or user reliability at ${companyName || "scale"}.` : ""}
- If their answer was incomplete or vague, ask a clarifying probe. If they said "I don't know", ask a gentle adjacent question within the same topic.`;
  } else {
    followUpDirective = `FOLLOW-UP 2 OF 2 FOR THIS TOPIC (FINAL FOLLOW-UP ON THIS TOPIC):
- Original Main Question: "${mainQuestion?.question || "Initial topic question"}"
- Candidate's Initial Answer: "${mainAnswer || ""}"
- First Follow-Up Question: "${previousFollowUp?.question || ""}"
- Candidate's Second Answer: "${candidateAnswer}"
- YOUR GOAL: Take the conversation to its final depth on this same topic before moving on.
${interviewType === "Technical Interview" ? `- Probe into failure modes under extreme constraints, alternative architectural solutions, or deep optimizations.` : ""}
${interviewType === "Behavioral Interview" ? `- Probe into the final measurable outcome, stakeholder reaction, long-term impact, and key lessons learned.` : ""}
${interviewType === "Role-specific Interview" ? `- Probe into observability, monitoring, automated recovery, or operational resilience in production.` : ""}
${interviewType === "Company-specific" || interviewType === "Company-specific Interview" ? `- Probe into disaster recovery, telemetry, or cross-team alignment at ${companyName || "scale"}.` : ""}
- Do NOT jump to an unrelated topic. Keep the question tightly anchored to this topic thread.`;
  }

  return `You are an expert interviewer conducting an interactive mock interview.
The candidate is currently on Main Topic ${mainQuestionNumber} of 5.
Your task is to generate Follow-up Question ${followUpNumber} of 2 for this topic based directly on the candidate's response.

INTERVIEW CONTEXT:
- Type: ${interviewType}
- Target Role: ${targetRole}
- Target Difficulty: ${difficulty}
${companyName ? `- Target Company: ${companyName}` : ""}

FULL CONVERSATION HISTORY SO FAR:
${formattedHistory}

${followUpDirective}

STRICT INTERVIEWER RULES:
1. ASK EXACTLY ONE QUESTION that demonstrates active listening to what the candidate actually said.
2. PREFER ONE CONCISE SENTENCE. At most TWO short sentences if strictly necessary.
3. ABSOLUTELY NO conversational filler (e.g., NO "Good point", "Thanks for sharing", "Understood", "Moving forward", "Let's dive deeper"). Start directly with the question.
4. DO NOT combine multiple questions into one.
5. DO NOT provide the answer, give hints, or explain the concept.
6. DO NOT repeat questions already asked in the conversation history.

Return the data as a JSON object matching this schema:
{
  "question": "The concise follow-up question text",
  "category": "${mainQuestion?.category || "Technical Depth"}",
  "difficulty": "${difficulty}",
  "expected_answer": "2-3 short bullet points outlining what a strong candidate response should address"
}`;
};

const generateFallbackMainQuestion = (type, mainQNum, targetRole = "Software Engineer", company, difficulty = "Medium") => {
  const normalizedType = (type || "").toLowerCase();
  const comp = company || "our engineering team";

  if (normalizedType.includes("technical")) {
    const questions = [
      {
        question: "How does a hash map work internally, and what is its average lookup time?",
        category: "Language Fundamentals & Execution Models",
        difficulty,
        expected_answer: "Explanation of hashing functions, array buckets, collision handling (chaining/open addressing), and O(1) average lookup."
      },
      {
        question: "What is the difference between synchronous and asynchronous execution in modern programming runtimes?",
        category: "Data Structures & Memory Layout",
        difficulty,
        expected_answer: "Explanation of blocking vs non-blocking I/O, event loops, call stacks, promises/async-await."
      },
      {
        question: "How does binary search work, and under what condition can it be applied?",
        category: "Algorithms & Computational Complexity",
        difficulty,
        expected_answer: "Requires a sorted collection, repeatedly divides search interval in half, achieves O(log n) time complexity."
      },
      {
        question: "What is the primary function of database indexes, and what trade-off do they introduce on write operations?",
        category: "Databases & Data Modeling",
        difficulty,
        expected_answer: "B-Tree/Hash indexes accelerate read queries but add CPU/disk overhead on INSERT, UPDATE, and DELETE operations."
      },
      {
        question: "How would you design a distributed rate limiter to protect backend APIs from sudden traffic spikes?",
        category: "System Architecture & High-Scale Reliability",
        difficulty,
        expected_answer: "Discussion of token bucket or sliding window algorithm, Redis centralized storage, atomic operations, and latency considerations."
      }
    ];
    return questions[(mainQNum - 1) % questions.length];
  }

  if (normalizedType.includes("behavioral")) {
    const questions = [
      {
        question: "Tell me about a time you had a technical disagreement with a colleague and how you resolved it.",
        category: "Conflict Resolution & Team Collaboration",
        difficulty,
        expected_answer: "STAR response detailing the technical disagreement, objective evaluation of trade-offs, and collaborative resolution."
      },
      {
        question: "Can you describe a situation where you took the initiative on an unassigned problem without being asked?",
        category: "Leadership, Initiative & Ownership",
        difficulty,
        expected_answer: "Clear example of identifying a problem or opportunity, rallying support, taking ownership, and driving tangible impact."
      },
      {
        question: "How do you manage your priorities when faced with competing requests and tight deadlines?",
        category: "Handling Deadlines, Pressure & Prioritization",
        difficulty,
        expected_answer: "Framework for prioritization (Eisenhower/MoSCoW), clear communication with stakeholders, and handling scope adjustments."
      },
      {
        question: "Tell me about a project that did not go as planned and what you learned from that setback.",
        category: "Navigating Failure, Mistakes & Adaptability",
        difficulty,
        expected_answer: "Honest description of what went wrong, personal accountability, root cause analysis, and practical lessons applied to future work."
      },
      {
        question: "Describe a time when you had to explain a complex technical concept to a non-technical stakeholder.",
        category: "Cross-Functional Influence & Mentorship",
        difficulty,
        expected_answer: "Using analogies, focusing on business impact rather than jargon, verifying understanding, and establishing alignment."
      }
    ];
    return questions[(mainQNum - 1) % questions.length];
  }

  if (normalizedType.includes("role")) {
    const questions = [
      {
        question: `How do you structure and manage application state and data flow in your daily work as a ${targetRole}?`,
        category: "Core Frameworks & Practical Stack",
        difficulty,
        expected_answer: "Clear breakdown of architectural patterns, state boundaries, immutability, and predictability."
      },
      {
        question: `How would you diagnose and resolve an unexpected latency spike or memory leak in production as a ${targetRole}?`,
        category: "Production Troubleshooting & Incident Response",
        difficulty,
        expected_answer: "Using APM telemetry, profiling tools, heap dumps, reproducing in staging, and rolling out safe rollbacks or patches."
      },
      {
        question: `What principles do you adhere to when designing clean, robust, and backward-compatible APIs?`,
        category: "API Design & Component Architecture",
        difficulty,
        expected_answer: "Clear REST/gRPC conventions, versioning strategies, strong typing/validation, consistent error formats, and documentation."
      },
      {
        question: `How do you determine the right balance between unit tests, integration tests, and end-to-end tests in your pipeline?`,
        category: "Testing Strategies & CI/CD Pipelines",
        difficulty,
        expected_answer: "Testing pyramid principles, testing critical business paths with integration tests, fast unit tests, and mocking external boundaries."
      },
      {
        question: `What security and performance practices do you consider essential when deploying code to production?`,
        category: "Security, Performance & Scalability Best Practices",
        difficulty,
        expected_answer: "Input sanitization, authentication/authorization checks, rate limiting, caching layers, and minimal privilege access."
      }
    ];
    return questions[(mainQNum - 1) % questions.length];
  }

  // Company-specific
  const questions = [
    {
      question: `Why are you interested in joining ${comp}, and what technical challenges here excite you most?`,
      category: "Company Mission, Architecture & Product Vision",
      difficulty,
      expected_answer: "Authentic motivation aligned with the company's domain, scale challenges, and technical engineering reputation."
    },
    {
      question: `How would you design a service at ${comp} to remain highly available during sudden regional outages or traffic surges?`,
      category: "High-Scale Traffic & Distributed Systems",
      difficulty,
      expected_answer: "Multi-region deployment, load balancing, stateless service tiers, auto-scaling, and database replication."
    },
    {
      question: `How do you balance fast product delivery with long-term code quality and architectural health?`,
      category: "Product Engineering & User-Centric Trade-offs",
      difficulty,
      expected_answer: "Pragmatic prioritization of MVP vs tech debt, technical debt tracking, automated tests, and incremental refactoring."
    },
    {
      question: `How would you handle a cascading failure across interdependent microservices in a distributed architecture?`,
      category: "Resilience, Fault Tolerance & Disaster Recovery",
      difficulty,
      expected_answer: "Circuit breakers, exponential backoff with jitter, dead-letter queues, timeouts, and graceful feature degradation."
    },
    {
      question: `Describe how you navigate engineering disagreements during code reviews or architectural RFC discussions at scale.`,
      category: "Engineering Culture & Large-Scale Teamwork",
      difficulty,
      expected_answer: "Focusing on data and benchmarks rather than opinions, clear documentation, empathy, and aligning with company standards."
    }
  ];
  return questions[(mainQNum - 1) % questions.length];
};

const generateFallbackFollowUp = (type, mainQ, candidateAnswer, followUpNumber, difficulty = "Medium") => {
  const normalizedType = (type || "").toLowerCase();

  if (followUpNumber === 1) {
    if (normalizedType.includes("technical")) {
      return {
        question: "What are the primary performance trade-offs or edge cases with that specific approach?",
        category: mainQ?.category || "Technical Depth",
        difficulty,
        expected_answer: "Discussion of time/space complexity, edge cases, and architectural trade-offs."
      };
    }
    if (normalizedType.includes("behavioral")) {
      return {
        question: "What specific action or personal decision did you take to move that situation forward?",
        category: mainQ?.category || "Action & Ownership",
        difficulty,
        expected_answer: "Clear elaboration of the candidate's direct personal involvement, decisions, and initiative."
      };
    }
    if (normalizedType.includes("role")) {
      return {
        question: "How would you implement and verify that solution within your day-to-day workflow?",
        category: mainQ?.category || "Practical Implementation",
        difficulty,
        expected_answer: "Step-by-step implementation, testing methodology, and operational verification."
      };
    }
    return {
      question: "How would that specific approach hold up under high concurrency and scale?",
      category: mainQ?.category || "Scalability",
      difficulty,
      expected_answer: "Handling concurrent connections, data consistency, and resource bottlenecks under heavy load."
    };
  }

  // followUpNumber === 2
  if (normalizedType.includes("technical")) {
    return {
      question: "If system memory or CPU became severely constrained, how would you optimize or adapt that design?",
      category: mainQ?.category || "Optimization & Constraints",
      difficulty,
      expected_answer: "Techniques for memory compression, streaming, caching, or algorithmic optimizations under tight limits."
    };
  }
  if (normalizedType.includes("behavioral")) {
    return {
      question: "What was the final measurable outcome, and what would you do differently in retrospect?",
      category: mainQ?.category || "Reflection & Impact",
      difficulty,
      expected_answer: "Reflection on measurable business or team results, key takeaways, and lessons learned."
    };
  }
  if (normalizedType.includes("role")) {
    return {
      question: "How would you monitor, log, and alert on unexpected runtime failures for that implementation in production?",
      category: mainQ?.category || "Observability & Reliability",
      difficulty,
      expected_answer: "Practical metrics, structured logging, distributed tracing, and actionable alerting thresholds."
    };
  }
  return {
    question: "What telemetry or key metrics would you track to ensure reliability and user satisfaction under load?",
    category: mainQ?.category || "Operational Metrics",
    difficulty,
    expected_answer: "Key SLIs/SLOs, latency percentiles (p95/p99), error rates, and automated canary verification."
  };
};

const buildQuestionPrompt = (context, type, difficulty, company, prevQuestions, subTopic, companyQuestions = []) => {
  return buildMainQuestionPrompt({
    context,
    interviewType: type,
    difficulty,
    companyName: company,
    mainQuestionNumber: 1,
    subTopic: typeof subTopic === 'object' ? subTopic : { name: subTopic, directive: `Focus on ${subTopic}` },
    previousMainQuestions: [],
    companyQuestions
  });
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
}
CRITICAL: Limit strengths and improvements arrays to EXACTLY 1 or 2 short items.
CRITICAL: Keep 'ideal_answer' extremely concise (2-3 sentences max) to avoid token limits.`;
};

const buildReportPrompt = (questions) => {
  return `You are a Senior Engineering Manager providing final feedback after a 15-question structured mock interview.

Interview Performance Data:
${questions.map((q, i) => `
Q${i+1} [${q.category}]: ${q.question}
User Answer: ${q.user_answer}
Score: ${q.score}/10
`).join("\n")}

TASK:
Provide a final holistic evaluation of the candidate. Calculate realistic scores (out of 100) based on their actual performance across all 15 questions.
CRITICAL: Keep the summary extremely concise and punchy (maximum 1 to 2 short sentences). Do not write a long paragraph.

Return the data as a JSON object precisely following this exact JSON structure:
{
  "overall_score": 0, // 0 to 100
  "communication_score": 0, // 0 to 100
  "technical_score": 0, // 0 to 100 (0 if behavioral only)
  "confidence_score": 0, // 0 to 100 based on answer assertiveness
  "strengths": ["string"],
  "weaknesses": ["string"],
  "summary": "A short 1-2 sentence summary"
}
CRITICAL INSTRUCTION: You MUST limit all array properties (strengths, weaknesses, recommended_practice) to EXACTLY 2 items each. Keep descriptions concise to prevent hitting strict token limits.`;
};

const startInterview = async (userId, payload) => {
  const supabase = getSupabaseAdmin();
  const context = await fetchUserContext(userId, supabase);
  
  if (!context.profile) {
    throw new AppError("Profile not found. Please complete your profile.", HTTP_STATUS_NOT_FOUND);
  }

  // 1. Create Interview Session (Total 15 questions: 5 main questions + 2 follow-ups each)
  const { data: interview, error: insertError } = await supabase
    .from("interviews")
    .insert({
      user_id: userId,
      interview_type: payload.interviewType,
      target_role: context.profile.target_role || "Software Engineer",
      company_name: payload.companyName || null,
      difficulty: payload.difficulty,
      total_questions: 15,
      current_question: 1,
      status: 'In Progress'
    })
    .select()
    .single();

  if (insertError) {
    throw new AppError(`Failed to start interview. ${insertError.message}`, HTTP_STATUS_INTERNAL_SERVER_ERROR);
  }

  // 2. Generate First Main Question (Main Question 1 of 5)
  let companyQuestions = [];
  if ((payload.interviewType === "Company-specific" || payload.interviewType === "Company-specific Interview") && payload.companyName) {
    try {
      const { data: pastInterviews } = await supabase
        .from("interviews")
        .select("id")
        .eq("company_name", payload.companyName);
        
      if (pastInterviews && pastInterviews.length > 0) {
        const interviewIds = pastInterviews.map(i => i.id);
        const { data: pastQuestions } = await supabase
          .from("interview_questions")
          .select("question, category")
          .in("interview_id", interviewIds)
          .limit(10);
        if (pastQuestions) {
          companyQuestions = pastQuestions;
        }
      }
    } catch (dbErr) {
      console.error("Failed to fetch past company questions:", dbErr);
    }
  }

  const currentDifficulty = getDifficultyForQuestion(payload.difficulty, 1);
  const subTopic = getMainTopic(payload.interviewType, 1);
  const prompt = buildMainQuestionPrompt({
    context,
    interviewType: payload.interviewType,
    difficulty: currentDifficulty,
    companyName: payload.companyName,
    mainQuestionNumber: 1,
    subTopic,
    previousMainQuestions: [],
    companyQuestions
  });
  
  let aiQuestion;
  try {
    aiQuestion = await aiService.generateStructuredResponse(prompt, generateQuestionSchema);
  } catch (error) {
    console.error("AI Failed to generate initial main question, using fallback:", error);
    aiQuestion = generateFallbackMainQuestion(payload.interviewType, 1, context.profile?.target_role, payload.companyName, currentDifficulty);
  }

  // 3. Save First Question
  const { data: questionData, error: qError } = await supabase
    .from("interview_questions")
    .insert({
      interview_id: interview.id,
      question_number: 1,
      question: aiQuestion.question,
      category: aiQuestion.category || subTopic.name,
      difficulty: aiQuestion.difficulty || currentDifficulty,
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
    total_questions: 15,
    main_question_number: 1,
    follow_up_number: 0,
    question: {
      id: questionData.id,
      text: questionData.question,
      category: questionData.category,
      difficulty: questionData.difficulty,
      main_question_number: 1,
      follow_up_number: 0
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

  // Idempotency guard: If this question was already answered, return existing evaluation & next question to prevent duplicates
  if (currentQ.user_answer) {
    const nextQNum = interview.current_question + 1;
    const { data: existingNextQ } = await supabase
      .from("interview_questions")
      .select("*")
      .eq("interview_id", interviewId)
      .eq("question_number", nextQNum)
      .maybeSingle();

    const mainQIndex = Math.floor((nextQNum - 1) / 3) + 1;
    const followUpIndex = (nextQNum - 1) % 3;

    return {
      evaluation: {
        score: currentQ.score || 0,
        strengths: currentQ.strengths || [],
        improvements: currentQ.improvements || [],
        ideal_answer: currentQ.ideal_answer || "",
        next_focus: currentQ.next_focus || ""
      },
      is_complete: interview.current_question >= interview.total_questions,
      next_question: existingNextQ ? {
        id: existingNextQ.id,
        text: existingNextQ.question,
        category: existingNextQ.category,
        difficulty: existingNextQ.difficulty,
        main_question_number: mainQIndex,
        follow_up_number: followUpIndex
      } : null
    };
  }

  // 2. Evaluate Answer using AI (with fallback on transient timeout)
  const evalPrompt = buildEvaluationPrompt(currentQ.question, currentQ.expected_answer, payload.answer, interview.interview_type);
  
  let evaluation;
  try {
    evaluation = await aiService.generateStructuredResponse(evalPrompt, evaluateAnswerSchema);
  } catch (error) {
    console.error("AI Failed to evaluate answer, using fallback evaluation:", error);
    evaluation = {
      score: 7,
      strengths: ["Addressed key concepts in the response"],
      improvements: ["Elaborate on specific trade-offs and edge cases"],
      ideal_answer: currentQ.expected_answer || "Clear and structured explanation covering core mechanics.",
      next_focus: "Elaborate further on trade-offs and implementation details."
    };
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
  let nextMainIndex = null;
  let nextFollowUpIndex = null;

  if (!isComplete) {
    const nextQNum = interview.current_question + 1;
    nextMainIndex = Math.floor((nextQNum - 1) / 3) + 1; // 1 to 5
    nextFollowUpIndex = (nextQNum - 1) % 3; // 0 = Main Question, 1 = Follow-up A, 2 = Follow-up B
    const currentDifficulty = getDifficultyForQuestion(interview.difficulty, nextMainIndex);

    // Check if next question was already inserted for this question_number (idempotency guard)
    const { data: existingNextQ } = await supabase
      .from("interview_questions")
      .select("*")
      .eq("interview_id", interviewId)
      .eq("question_number", nextQNum)
      .maybeSingle();

    if (existingNextQ) {
      nextQuestionData = existingNextQ;
    } else {
      const context = await fetchUserContext(userId, supabase);
      const targetRole = context.profile?.target_role || interview.target_role || "Software Engineer";

      // Fetch full conversation history so far for context
      const { data: conversationHistory } = await supabase
        .from("interview_questions")
        .select("question_number, question, category, difficulty, user_answer")
        .eq("interview_id", interviewId)
        .order("question_number", { ascending: true });

      let aiQuestion;

      if (nextFollowUpIndex === 0) {
        // CASE A: NEW INDEPENDENT MAIN QUESTION (Questions 4, 7, 10, 13)
        // Extract previous main questions to prevent repeating topics
        const previousMainQuestions = (conversationHistory || [])
          .filter(q => (q.question_number - 1) % 3 === 0)
          .map(q => q.question);

        let companyQuestions = [];
        if ((interview.interview_type === "Company-specific" || interview.interview_type === "Company-specific Interview") && interview.company_name) {
          try {
            const { data: pastInterviews } = await supabase
              .from("interviews")
              .select("id")
              .eq("company_name", interview.company_name);
              
            if (pastInterviews && pastInterviews.length > 0) {
              const interviewIds = pastInterviews.map(i => i.id);
              const { data: pastQuestions } = await supabase
                .from("interview_questions")
                .select("question, category")
                .in("interview_id", interviewIds)
                .limit(10);
              if (pastQuestions) {
                companyQuestions = pastQuestions;
              }
            }
          } catch (dbErr) {
            console.error("Failed to fetch past company questions:", dbErr);
          }
        }

        const subTopic = getMainTopic(interview.interview_type, nextMainIndex);
        const mainPrompt = buildMainQuestionPrompt({
          context,
          interviewType: interview.interview_type,
          difficulty: currentDifficulty,
          companyName: interview.company_name,
          mainQuestionNumber: nextMainIndex,
          subTopic,
          previousMainQuestions,
          companyQuestions
        });

        try {
          aiQuestion = await aiService.generateStructuredResponse(mainPrompt, generateQuestionSchema);
        } catch (error) {
          console.error(`AI Failed to generate main question ${nextMainIndex}, using fallback:`, error);
          aiQuestion = generateFallbackMainQuestion(interview.interview_type, nextMainIndex, targetRole, interview.company_name, currentDifficulty);
        }
      } else if (nextFollowUpIndex === 1) {
        // CASE B: FIRST FOLLOW-UP TO CURRENT MAIN QUESTION (Questions 2, 5, 8, 11, 14)
        // Current question (currentQ) is the main question for this topic
        const followUpPrompt = buildFollowUpQuestionPrompt({
          context,
          interviewType: interview.interview_type,
          difficulty: currentDifficulty,
          companyName: interview.company_name,
          targetRole,
          mainQuestionNumber: nextMainIndex,
          followUpNumber: 1,
          mainQuestion: currentQ,
          mainAnswer: payload.answer,
          candidateAnswer: payload.answer,
          conversationHistory: conversationHistory || []
        });

        try {
          aiQuestion = await aiService.generateStructuredResponse(followUpPrompt, generateQuestionSchema);
        } catch (error) {
          console.error(`AI Failed to generate follow-up 1 for topic ${nextMainIndex}, using fallback:`, error);
          aiQuestion = generateFallbackFollowUp(interview.interview_type, currentQ, payload.answer, 1, currentDifficulty);
        }
      } else {
        // CASE C: SECOND FOLLOW-UP TO CURRENT MAIN QUESTION (Questions 3, 6, 9, 12, 15)
        // The original main question is (nextQNum - 2)
        const origMainQ = (conversationHistory || []).find(q => q.question_number === nextQNum - 2) || currentQ;

        const followUpPrompt = buildFollowUpQuestionPrompt({
          context,
          interviewType: interview.interview_type,
          difficulty: currentDifficulty,
          companyName: interview.company_name,
          targetRole,
          mainQuestionNumber: nextMainIndex,
          followUpNumber: 2,
          mainQuestion: origMainQ,
          mainAnswer: origMainQ?.user_answer,
          previousFollowUp: currentQ,
          previousFollowUpAnswer: payload.answer,
          candidateAnswer: payload.answer,
          conversationHistory: conversationHistory || []
        });

        try {
          aiQuestion = await aiService.generateStructuredResponse(followUpPrompt, generateQuestionSchema);
        } catch (error) {
          console.error(`AI Failed to generate follow-up 2 for topic ${nextMainIndex}, using fallback:`, error);
          aiQuestion = generateFallbackFollowUp(interview.interview_type, origMainQ, payload.answer, 2, currentDifficulty);
        }
      }

      const { data: savedNextQ } = await supabase
        .from("interview_questions")
        .insert({
          interview_id: interview.id,
          question_number: nextQNum,
          question: aiQuestion.question,
          category: aiQuestion.category || currentQ.category || "General",
          difficulty: aiQuestion.difficulty || currentDifficulty,
          expected_answer: aiQuestion.expected_answer || "Clear and structured explanation addressing the question."
        })
        .select()
        .single();

      nextQuestionData = savedNextQ;
    }

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
      difficulty: nextQuestionData.difficulty,
      main_question_number: nextMainIndex,
      follow_up_number: nextFollowUpIndex
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
    console.error("AI Failed to generate report, calculating deterministic fallback report:", error);
    const validScores = questions.filter(q => typeof q.score === 'number');
    const avgScore = validScores.length > 0 
      ? Math.round((validScores.reduce((acc, q) => acc + q.score, 0) / validScores.length) * 10)
      : 70;
    report = {
      overall_score: avgScore,
      communication_score: avgScore,
      technical_score: avgScore,
      confidence_score: avgScore,
      strengths: ["Demonstrated solid core understanding", "Maintained consistent structure throughout answers"],
      weaknesses: ["Deepen discussion of edge cases", "Continue practicing technical trade-offs"],
      recommended_practice: ["System architecture design", "Edge-case analysis"],
      summary: "Completed mock interview session with consistent effort across all questions."
    };
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
