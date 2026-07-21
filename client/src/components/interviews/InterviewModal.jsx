import { useState, useEffect, useRef } from "react";
import { X, Mic, Send, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function InterviewModal({ isOpen, onClose, interviewType, difficulty, companyName, resumeInterviewId }) {
  const { session } = useAuth();
  const [interviewId, setInterviewId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [report, setReport] = useState(null);
  const [lastEvaluation, setLastEvaluation] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  // Refs for recording
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    if (isOpen && !interviewId && !loading && !error) {
      if (resumeInterviewId) {
        resumeInterview(resumeInterviewId);
      } else {
        startInterview();
      }
    }
  }, [isOpen]);

  const resumeInterview = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/interviews/${id}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      const data = res.data.data;
      setInterviewId(data.interview.id);
      setCurrentQuestionNumber(data.interview.current_question);
      setTotalQuestions(data.interview.total_questions);
      
      if (data.interview.status === 'Completed') {
        const aggregatedStrengths = data.questions.flatMap(q => q.strengths || []).filter(Boolean);
        const aggregatedWeaknesses = data.questions.flatMap(q => q.improvements || []).filter(Boolean);
        const uniqueStrengths = [...new Set(aggregatedStrengths)].slice(0, 4);
        const uniqueWeaknesses = [...new Set(aggregatedWeaknesses)].slice(0, 4);

        setReport({
          overall_score: data.interview.overall_score,
          communication_score: data.interview.communication_score,
          technical_score: data.interview.technical_score,
          confidence_score: data.interview.confidence_score,
          summary: data.interview.feedback_summary || "Good job completing the interview.",
          strengths: uniqueStrengths.length > 0 ? uniqueStrengths : ["Solid baseline performance"],
          weaknesses: uniqueWeaknesses.length > 0 ? uniqueWeaknesses : ["Keep practicing to refine your answers"]
        });
        setIsCompleted(true);
      } else {
        // Find the active question
        const activeQ = data.questions.find(q => q.question_number === data.interview.current_question);
        if (activeQ) {
          setCurrentQuestion({
            id: activeQ.id,
            text: activeQ.question,
            category: activeQ.category,
            difficulty: activeQ.difficulty
          });
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resume interview.");
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/interviews/start`, {
        interviewType,
        difficulty,
        companyName
      }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      setInterviewId(res.data.data.interview_id);
      setCurrentQuestion(res.data.data.question);
      setCurrentQuestionNumber(res.data.data.current_question_number);
      setTotalQuestions(res.data.data.total_questions);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start interview.");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    
    // Stop recording if they submit while mic is on
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    setLoading(true);
    setError(null);
    setLastEvaluation(null);
    
    try {
      const res = await axios.post(`${API_BASE_URL}/interviews/${interviewId}/answer`, { answer }, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      const { evaluation, is_complete, next_question } = res.data.data;
      
      setLastEvaluation(evaluation);
      
      if (is_complete) {
        completeInterview();
      } else {
        // Wait a few seconds for user to read feedback, or just show next immediately?
        // Let's just show next question, but maybe keep the feedback visible briefly
        setCurrentQuestion(next_question);
        setCurrentQuestionNumber(prev => prev + 1);
        setAnswer("");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit answer.");
    } finally {
      setLoading(false);
    }
  };

  const completeInterview = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/interviews/${interviewId}/complete`, {}, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      setIsCompleted(true);
      setReport(res.data.data.report);
    } catch (err) {
      setError("Failed to complete interview.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setInterviewId(null);
    setCurrentQuestion(null);
    setAnswer("");
    setIsCompleted(false);
    setReport(null);
    setError(null);
    setLastEvaluation(null);
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    onClose();
  };

  const uploadAndTranscribe = async (audioBlob, ext = 'webm') => {
    setIsTranscribing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, `recording.${ext}`);

      const res = await axios.post(`${API_BASE_URL}/transcribe`, formData, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      
      const newText = res.data.data.text.trim();
      if (newText) {
        setAnswer(prev => prev + (prev.length > 0 && !prev.endsWith(' ') ? ' ' : '') + newText);
      }
    } catch (err) {
      console.error("Transcription failed:", err);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      alert(`Failed to transcribe audio. Details: ${errorMsg}. Please try again.`);
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Let the browser pick its best supported codec instead of forcing webm
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const mimeType = mediaRecorder.mimeType || 'audio/webm';
          let ext = 'webm';
          if (mimeType.includes('mp4')) ext = 'mp4';
          else if (mimeType.includes('ogg')) ext = 'ogg';

          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          stream.getTracks().forEach(track => track.stop()); // Release mic
          await uploadAndTranscribe(audioBlob, ext);
        };

        // Start with a 250ms timeslice to force chunk flushing
        mediaRecorder.start(250);
        setIsRecording(true);
      } catch (err) {
        console.error("Mic access denied:", err);
        alert("Could not access microphone. Please check permissions.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#0f111f] shadow-2xl border border-slate-200 dark:border-white/10 max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Mock Interview</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400">{interviewType} {companyName && interviewType === "Company-specific" ? `(${companyName})` : ''}</p>
          </div>
          <button onClick={handleClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && !currentQuestion && !report && (
            <div className="flex h-64 flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
              <p className="text-slate-500 dark:text-gray-400">Preparing your interview...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-500 flex gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && currentQuestion && !isCompleted && (
            <div className="flex flex-col gap-6 h-full">
              {/* Progress */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-violet-500">Question {currentQuestionNumber} of {totalQuestions}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-white/5">
                  <div 
                    className="h-full rounded-full bg-violet-500 transition-all duration-500" 
                    style={{ width: `${(currentQuestionNumber / totalQuestions) * 100}%` }}
                  />
                </div>
              </div>

              {/* Last Evaluation Feedback (optional) */}
              {lastEvaluation && (
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-500">Feedback on previous answer (Score: {lastEvaluation.score}/10)</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-gray-300 mb-1"><span className="font-semibold">Strengths:</span> {lastEvaluation?.strengths?.join(", ")}</p>
                  <p className="text-sm text-slate-600 dark:text-gray-300"><span className="font-semibold">Improvements:</span> {lastEvaluation?.improvements?.join(", ")}</p>
                </div>
              )}

              {/* AI Question */}
              <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.02] p-6 border border-slate-100 dark:border-white/5">
                <p className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">{currentQuestion.category}</p>
                <h3 className="text-xl font-medium leading-relaxed text-slate-900 dark:text-white">
                  {currentQuestion.text}
                </h3>
              </div>

              {/* User Input */}
              <div className="flex-1 flex flex-col gap-3 min-h-[200px]">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 dark:text-gray-300">Your Answer</label>
                  <button 
                    onClick={toggleRecording}
                    disabled={isTranscribing}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isRecording 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : isTranscribing 
                          ? 'bg-amber-500/20 text-amber-500 cursor-not-allowed'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'
                    }`}
                  >
                    {isTranscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
                    {isRecording ? "Recording... (Click to Stop)" : isTranscribing ? "Transcribing..." : "Click to Speak"}
                  </button>
                </div>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your detailed answer here..."
                  className="flex-1 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-transparent p-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={submitAnswer}
                  disabled={!answer.trim() || loading || isRecording || isTranscribing}
                  className="flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Submit Answer
                </button>
              </div>
            </div>
          )}

          {isCompleted && report && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-violet-500/10 text-violet-500 mb-4">
                  <span className="text-3xl font-bold">{report.overall_score}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Interview Completed!</h3>
                <p className="text-slate-500 dark:text-gray-400">{report.summary}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-4 text-center">
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Technical</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{report.technical_score}/100</p>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-4 text-center">
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Communication</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{report.communication_score}/100</p>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] p-4 text-center">
                  <p className="text-sm text-slate-500 dark:text-gray-400 mb-1">Confidence</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{report.confidence_score}/100</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold text-emerald-500 mb-3 uppercase tracking-wide">Key Strengths</h4>
                  <ul className="space-y-2">
                    {report?.strengths?.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-orange-500 mb-3 uppercase tracking-wide">Areas to Improve</h4>
                  <ul className="space-y-2">
                    {report?.weaknesses?.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-gray-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button onClick={handleClose} className="w-full rounded-lg bg-slate-900 dark:bg-white py-3 font-semibold text-white dark:text-slate-900 transition-transform active:scale-[0.98]">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
