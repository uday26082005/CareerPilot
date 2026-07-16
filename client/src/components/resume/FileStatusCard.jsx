import { FileText } from "lucide-react";

export default function FileStatusCard() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <div className="flex items-start gap-4">
        
        {/* PDF Icon Box */}
        <div className="flex h-16 w-12 flex-col items-center justify-center rounded-lg bg-white shrink-0 shadow-lg relative">
          <div className="absolute top-0 right-0 w-4 h-4 bg-gray-200 rounded-bl-lg" style={{ clipPath: "polygon(100% 0, 0 0, 0 100%)" }} />
          <span className="mt-4 text-[10px] font-black text-red-600">PDF</span>
        </div>
        
        {/* File Info */}
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">Uday_Kumar_Resume.pdf</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">Uploaded on May 18, 2025 • 2.4 MB</p>
          
          <div className="mt-4 inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            Analyzed Successfully
          </div>
        </div>
      </div>
    </div>
  );
}
