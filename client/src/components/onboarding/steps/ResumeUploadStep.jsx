import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CloudUpload, Lightbulb, Check, FileText, X } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function ResumeUploadStep({ onNext, onPrev }) {
  const { session } = useAuth();
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF resumes are supported.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Resume file must not exceed 5 MB.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const [analyzing, setAnalyzing] = useState(false);

  const handleNext = async () => {
    if (!file) {
      toast.error("Please upload your resume to continue.");
      return;
    }

    setAnalyzing(true);
    const toastId = toast.loading("Analyzing your resume with Gemini AI...");
    
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(`${API_BASE_URL}/resume/analyze`, formData, {
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });

      console.log("Gemini AI Analysis Result:", response.data.data);
      
      toast.success("Resume analyzed successfully!", { id: toastId });
      
      // We will save this result to global state or context in the next phase
      // For now, just proceed to the next step
      onNext();

    } catch (error) {
      console.error(error);
      const responseData = error.response?.data;
      const validationMessage = responseData?.errors?.map((item) => item.message).join(", ");
      toast.error(
        validationMessage || responseData?.message || "Failed to analyze resume. Please try again.",
        { id: toastId }
      );
    } finally {
      setAnalyzing(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex h-full flex-col"
    >
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-black">Resume Upload</h1>
        <p className="text-base text-slate-500 dark:text-gray-400">
          Upload your resume to help us analyze your skills, experience, and qualifications to provide better recommendations.
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        {/* Upload Area */}
        <div className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-500/30 bg-violet-500/5 py-12 transition-all hover:border-violet-500/50 hover:bg-violet-500/10">
          <div className="absolute inset-0 -z-10 rounded-2xl bg-violet-600/10 blur-[40px] transition-opacity group-hover:opacity-100 opacity-50" />
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf,.pdf"
            className="hidden" 
          />

          {!file ? (
            <>
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <CloudUpload className="h-8 w-8" />
              </div>
              
              <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Drag & drop your resume here</h3>
              <p className="mb-4 text-sm font-medium text-slate-400 dark:text-gray-500 uppercase">or</p>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg bg-violet-600 px-6 py-2.5 text-base font-semibold text-slate-900 dark:text-white transition-colors hover:bg-violet-500 shadow-lg shadow-violet-500/25"
              >
                Browse Files
              </button>
              
              <p className="mt-4 text-sm text-slate-500 dark:text-gray-400">Supports PDF (Max 5MB)</p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">{file.name}</h3>
              <p className="mb-6 text-sm text-slate-400 dark:text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <button 
                onClick={handleRemoveFile}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/20"
              >
                <X className="h-4 w-4" /> Remove File
              </button>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Tips for a great upload</h4>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Use an updated resume",
              "Ensure all key skills are mentioned",
              "Include your latest experience and projects",
              "Keep it concise and relevant"
            ].map((tip, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-violet-400" />
                <span className="text-base text-slate-600 dark:text-gray-300">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-slate-200 dark:border-white/5 pt-6">
        <button
          onClick={onPrev}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-gray-400 transition-colors hover:text-slate-900 dark:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <motion.button
          onClick={handleNext}
          disabled={analyzing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-slate-900 dark:text-white transition-colors hover:bg-violet-500 disabled:opacity-50"
        >
          {analyzing ? "Analyzing AI..." : "Analyze & Finish"}
          {!analyzing && <ArrowRight className="h-5 w-5" />}
        </motion.button>
      </div>
    </motion.div>
  );
}
