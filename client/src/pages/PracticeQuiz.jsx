import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, XCircle, HelpCircle, Code, Layers, Server, Database, Cloud, ArrowLeft, RefreshCw, Trophy, ArrowRight, Loader2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const TOPICS = [
  { id: "dsa", category: "Data Structures & Algorithms", name: "Data Structures & Algorithms", icon: HelpCircle, count: 120, desc: "Master arrays, trees, graphs, and core algorithms." },
  { id: "frontend", category: "React", name: "Frontend Development", icon: Code, count: 80, desc: "React, CSS, HTML, and browser fundamentals." },
  { id: "backend", category: "Node.js", name: "Backend Development", icon: Server, count: 95, desc: "Node.js, Express, APIs, and server architecture." },
  { id: "system_design", category: "System Design", name: "System Design", icon: Layers, count: 50, desc: "Scalability, load balancing, and distributed systems." },
  { id: "databases", category: "SQL", name: "Databases", icon: Database, count: 65, desc: "SQL, NoSQL, indexing, and normalization." },
  { id: "devops", category: "DevOps & Cloud", name: "DevOps & Cloud", icon: Cloud, count: 40, desc: "AWS, Docker, CI/CD, and deployment strategies." },
];

export default function PracticeQuiz() {
  const { session } = useAuth();
  const location = useLocation();
  const startedTopicParamRef = useRef(null);

  const [view, setView] = useState("selection");
  const [activeTopic, setActiveTopic] = useState(null);
  const [practiceSessionId, setPracticeSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [pendingQuestion, setPendingQuestion] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [report, setReport] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const authHeaders = () => ({
    Authorization: "Bearer " + (session && session.access_token ? session.access_token : ""),
  });

  const startPractice = useCallback(async (topicId) => {
    const topic = TOPICS.find((item) => item.id === topicId);
    if (!topic) return;

    setActiveTopic(topicId);
    setView("quiz");
    setPracticeSessionId(null);
    setCurrentQuestion(null);
    setPendingQuestion(null);
    setSelectedAnswer(null);
    setTextAnswer("");
    setEvaluation(null);
    setReport(null);
    setScore(0);
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        API_BASE_URL + "/practice/start",
        { category: topic.category, difficulty: "Medium", totalQuestions: 10 },
        { headers: { Authorization: "Bearer " + (session && session.access_token ? session.access_token : "") } }
      );
      const data = response.data.data;
      setPracticeSessionId(data.practice_session_id);
      setCurrentQuestion(data.question);
      setTotalQuestions(data.total_questions);
    } catch (requestError) {
      setError(requestError.response && requestError.response.data && requestError.response.data.message
        ? requestError.response.data.message
        : "Unable to start this practice session.");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    const topicParam = new URLSearchParams(location.search).get("topic");
    if (topicParam && TOPICS.some((topic) => topic.id === topicParam) && startedTopicParamRef.current !== topicParam) {
      startedTopicParamRef.current = topicParam;
      startPractice(topicParam);
    }
  }, [location.search, startPractice]);

  const submitAnswer = async (answer) => {
    if (!practiceSessionId || !currentQuestion || !answer.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await axios.post(
        API_BASE_URL + "/practice/" + practiceSessionId + "/answer",
        { answer },
        { headers: authHeaders() }
      );
      const data = response.data.data;
      setEvaluation(data.evaluation);
      setPendingQuestion(data.question);
    } catch (requestError) {
      setError(requestError.response && requestError.response.data && requestError.response.data.message
        ? requestError.response.data.message
        : "Unable to evaluate this answer.");
    } finally {
      setSubmitting(false);
    }
  };

  const completePractice = async () => {
    if (!practiceSessionId) return;

    setSubmitting(true);
    setError(null);
    try {
      const response = await axios.post(
        API_BASE_URL + "/practice/" + practiceSessionId + "/complete",
        {},
        { headers: authHeaders() }
      );
      const completedReport = response.data.data.report;
      setReport(completedReport);
      setScore(Math.round((completedReport.overall_score || 0) / 10));
      setView("results");
    } catch (requestError) {
      setError(requestError.response && requestError.response.data && requestError.response.data.message
        ? requestError.response.data.message
        : "Unable to finish this practice session.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOptionClick = (option) => {
    if (selectedAnswer || evaluation || submitting) return;
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (evaluation) {
      if (pendingQuestion) {
        setCurrentQuestion(pendingQuestion);
        setPendingQuestion(null);
        setSelectedAnswer(null);
        setTextAnswer("");
        setEvaluation(null);
      } else {
        completePractice();
      }
      return;
    }

    submitAnswer(selectedAnswer || textAnswer);
  };

  const handleSkipQuestion = () => {
    if (selectedAnswer || textAnswer.trim() || evaluation || submitting) return;
    submitAnswer("Skipped by user.");
  };

  const handleReturnToTopics = () => {
    setView("selection");
    setActiveTopic(null);
    setPracticeSessionId(null);
    setCurrentQuestion(null);
    setPendingQuestion(null);
    setSelectedAnswer(null);
    setTextAnswer("");
    setEvaluation(null);
    setReport(null);
    setError(null);
  };

  if (view === "selection") {
    return (
      <div className="flex flex-col gap-6 pb-6 w-full max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Practice Arena</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Select a topic below to start a 10-question practice quiz. Challenge yourself and see where you stand!
          </p>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => startPractice(topic.id)}
              disabled={loading}
              className="group flex flex-col items-center text-center p-8 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-violet-500/30 hover:bg-slate-50 dark:hover:bg-white/[0.04] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 mb-6 group-hover:scale-110 transition-transform">
                <topic.icon className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{topic.name}</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">{topic.desc}</p>

              <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400">
                {loading ? "Preparing Practice" : "Start Quiz"} {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === "quiz") {
    const topic = TOPICS.find((item) => item.id === activeTopic);
    const questionNumber = currentQuestion ? currentQuestion.question_number : 1;
    const hasOptions = Boolean(currentQuestion && currentQuestion.options && currentQuestion.options.length);
    const answerReady = Boolean(selectedAnswer || textAnswer.trim());

    return (
      <div className="max-w-4xl mx-auto py-8">
        <button
          onClick={handleReturnToTopics}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Topics
        </button>

        <div className="rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] backdrop-blur-md overflow-hidden flex flex-col min-h-[600px] shadow-2xl">
          <div className="p-8 border-b border-slate-200 dark:border-white/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  {topic && <topic.icon className="h-5 w-5" />}
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{topic && topic.name}</h2>
              </div>
              <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300">
                Question {questionNumber} of {totalQuestions}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-300"
                style={{ width: ((questionNumber / totalQuestions) * 100) + "%" }}
              />
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            {loading && (
              <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                <p className="text-slate-500 dark:text-gray-400">Creating your personalized question...</p>
              </div>
            )}

            {!loading && error && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
                {error}
              </div>
            )}

            {!loading && currentQuestion && (
              <>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-10 leading-relaxed">
                  {currentQuestion.question}
                </h3>

                {hasOptions ? (
                  <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => {
                      let stateClass = "border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-violet-500/30 hover:bg-violet-500/5 hover:text-violet-400";
                      let icon = null;
                      const isSelected = selectedAnswer === option;

                      if (evaluation) {
                        if (isSelected) {
                          stateClass = evaluation.correct
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                            : "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
                          icon = evaluation.correct
                            ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            : <XCircle className="h-5 w-5 text-red-500" />;
                        } else {
                          stateClass = "border-slate-200 dark:border-white/5 opacity-40";
                        }
                      } else if (isSelected) {
                        stateClass = "border-violet-500 bg-violet-500/10 text-violet-700 dark:text-violet-400";
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          disabled={Boolean(selectedAnswer) || Boolean(evaluation) || submitting}
                          className={"w-full p-5 rounded-2xl border flex items-center justify-between text-left transition-all duration-200 " + stateClass}
                        >
                          <span className="text-base font-medium">{option}</span>
                          {icon}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <textarea
                    value={textAnswer}
                    onChange={(event) => setTextAnswer(event.target.value)}
                    disabled={Boolean(evaluation) || submitting}
                    placeholder="Type your answer here..."
                    className="min-h-[200px] w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-5 text-base font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
                  />
                )}

                {evaluation && (
                  <div className="mt-6 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-sm text-slate-600 dark:text-gray-300">
                    <p className="font-semibold text-slate-900 dark:text-white">{evaluation.feedback}</p>
                    <p className="mt-1">{evaluation.explanation}</p>
                  </div>
                )}

                <div className="mt-auto pt-10 flex items-center justify-between">
                  <button
                    onClick={handleSkipQuestion}
                    disabled={answerReady || Boolean(evaluation) || submitting}
                    className={"text-sm font-semibold transition-colors " + (answerReady || evaluation || submitting ? "text-slate-300 dark:text-gray-600 cursor-not-allowed" : "text-slate-500 hover:text-slate-700 dark:text-gray-400 dark:hover:text-white")}
                  >
                    Skip Question
                  </button>

                  <button
                    onClick={handleNextQuestion}
                    disabled={(!answerReady && !evaluation) || submitting}
                    className={"px-8 py-3 rounded-xl text-sm font-bold transition-all " + (answerReady || evaluation
                      ? "bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:-translate-y-0.5"
                      : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-gray-500 cursor-not-allowed")}
                  >
                    {submitting ? "Checking..." : evaluation ? (pendingQuestion ? "Next Question" : "View Results") : "Check Answer"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === "results") {
    const topic = TOPICS.find((item) => item.id === activeTopic);
    const percentage = report ? report.accuracy : score * 10;
    const resultMessage = percentage >= 80
      ? "Excellent work!"
      : percentage >= 50
        ? "Good job, keep practicing!"
        : "Keep learning and try again!";

    return (
      <div className="max-w-3xl mx-auto py-16 flex flex-col items-center justify-center text-center">
        <div className="w-full rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-12 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {percentage >= 80 && (
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />
          )}

          <div className="flex justify-center mb-8 relative z-10">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-8 ring-slate-50 dark:ring-[#060816]">
              <Trophy className="h-10 w-10" />
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 relative z-10">{resultMessage}</h2>
          <p className="text-slate-500 dark:text-gray-400 mb-10 relative z-10">
            {report && report.summary ? report.summary : <>You completed the <span className="font-bold text-slate-900 dark:text-white">{topic && topic.name}</span> practice quiz.</>}
          </p>

          <div className="flex justify-center mb-12 relative z-10">
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-gray-500 mb-2">Final Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-slate-900 dark:text-white">{score}</span>
                <span className="text-2xl font-bold text-slate-400 dark:text-gray-500">/ 10</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 relative z-10">
            <button
              onClick={handleReturnToTopics}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              Back to Topics
            </button>
            <button
              onClick={() => startPractice(activeTopic)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-violet-600 text-white hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:-translate-y-0.5"
            >
              <RefreshCw className="h-4 w-4" /> Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
