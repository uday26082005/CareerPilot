import { ArrowRight, Search, Building2, Terminal, Monitor, Code } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopCompaniesHiring() {
  const COMPANIES = [
    { name: "Google", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg", demand: "High", demandColor: "text-emerald-400", salary: "₹18 - 45 LPA" },
    { name: "Microsoft", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", demand: "High", demandColor: "text-emerald-400", salary: "₹15 - 40 LPA" },
    { name: "Amazon", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg", demand: "High", demandColor: "text-emerald-400", salary: "₹16 - 38 LPA", invertDark: true },
    { name: "TCS", demand: "High", demandColor: "text-emerald-400", salary: "₹3.5 - 12 LPA", isText: true, textFallback: "tcs", textColor: "text-red-500" },
    { name: "Infosys", logoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg", demand: "Medium", demandColor: "text-orange-400", salary: "₹3 - 10 LPA" },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-slate-500 dark:text-gray-400">Top Companies Hiring</h3>
      </div>

      <div className="flex-1 grid grid-cols-5 divide-x divide-white/5">
        {COMPANIES.map((company, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center px-2 text-center">
            
            <div className={`mb-3 flex h-10 w-10 p-1 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5`}>
              {company.isText ? (
                <span className={`font-bold text-base ${company.textColor}`}>{company.textFallback}</span>
              ) : (
                <img src={company.logoUrl} alt={company.name} className={`h-full w-full object-contain drop-shadow-sm ${company.invertDark ? 'dark:invert dark:brightness-200' : ''}`} />
              )}
            </div>
            
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{company.name}</h4>
            <span className={`text-xs font-bold mb-2 ${company.demandColor}`}>{company.demand}</span>
            <span className="text-xs text-slate-500 dark:text-gray-400">{company.salary}</span>

          </div>
        ))}
      </div>
      
    </div>
  );
}


