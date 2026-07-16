import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CloudUpload, Lightbulb, Check, FileText, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ResumeUploadStep({ onNext, onPrev }) {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleNext = () => {
    if (!file) {
      toast.error("Please upload your resume to continue.");
      return;
    }
    onNext();
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
            accept=".pdf,.doc,.docx" 
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
              
              <p className="mt-4 text-sm text-slate-500 dark:text-gray-400">Supports PDF, DOCX (Max 10MB)</p>
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-slate-900 dark:text-white transition-colors hover:bg-violet-500"
        >
          Save & Continue <ArrowRight className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
