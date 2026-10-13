import { Info, CheckCircle2, TrendingUp, Trophy } from "lucide-react";

function formatSalaryDisplay(raw) {
  if (!raw || typeof raw !== "string") return "Salary data unavailable";
  const cleaned = raw.trim();
  if (!cleaned || cleaned.toLowerCase().includes("unavailable")) return "Salary data unavailable";

  // Check if it's a range like "₹X LPA - ₹Y LPA" or "X - Y LPA" or "₹X - ₹Y LPA"
  const match = cleaned.match(/(?:₹\s*)?([0-9]+(?:\.[0-9]+)?)\s*(?:LPA)?\s*[-–—]\s*(?:₹\s*)?([0-9]+(?:\.[0-9]+)?)\s*(?:LPA)?/i);
  if (match) {
    const min = parseFloat(match[1]);
    const max = parseFloat(match[2]);
    if (isNaN(min) || isNaN(max)) return cleaned;
    if (min === max) {
      return `₹${min} LPA`;
    }
    return `₹${min} LPA – ₹${max} LPA`;
  }

  // Single value check like "₹X LPA" or "X LPA"
  const singleMatch = cleaned.match(/(?:₹\s*)?([0-9]+(?:\.[0-9]+)?)\s*(?:LPA)?/i);
  if (singleMatch) {
    const val = parseFloat(singleMatch[1]);
    if (!isNaN(val)) return `₹${val} LPA`;
  }

  return cleaned;
}

export default function SalaryInsights({ data }) {
  if (!data) return null;

  const entrySalary = formatSalaryDisplay(data.salary_entry);
  const midSalary = formatSalaryDisplay(data.salary_mid);
  const seniorSalary = formatSalaryDisplay(data.salary_senior);

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          Salary Insights (India) <Info className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </h3>
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          Updated {data.salary_updated || "Oct 2026"}
        </span>
      </div>

      <div className="flex-1 grid grid-cols-3 divide-x divide-slate-200 dark:divide-white/[0.08]">
        {/* Entry Level */}
        <div className="flex flex-col pr-4 justify-center">
          <div className="flex items-center gap-1.5 mb-2.5">
            <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-[#4ee4cb]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Entry Level</span>
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{entrySalary}</h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">0 - 2 years</span>
        </div>

        {/* Mid Level */}
        <div className="flex flex-col px-4 justify-center">
          <div className="flex items-center gap-1.5 mb-2.5">
            <TrendingUp className="h-4 w-4 text-amber-500 dark:text-[#ffd159]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mid Level</span>
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{midSalary}</h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">2 - 5 years</span>
        </div>

        {/* Senior Level */}
        <div className="flex flex-col pl-4 justify-center">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Trophy className="h-4 w-4 text-purple-600 dark:text-[#e29aff]" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Senior Level</span>
          </div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{seniorSalary}</h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">5+ years</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/[0.05] flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span className="truncate">Source: {data.salary_source || "India Tech Compensation Index (AmbitionBox & Glassdoor benchmarks)"}</span>
      </div>
    </div>
  );
}
