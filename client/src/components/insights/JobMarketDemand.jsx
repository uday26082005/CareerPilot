import { Info, ArrowRight, Code2, Layout, Database, Server, Brain } from "lucide-react";
import { Link } from "react-router-dom";

export default function JobMarketDemand() {
  const DEMAND_DATA = [
    { role: "Full Stack Developer", icon: Code2, iconColor: "text-emerald-400 bg-emerald-500/10", barColor: "bg-emerald-500", label: "Very High", labelColor: "text-emerald-400", percent: 92 },
    { role: "Frontend Developer", icon: Layout, iconColor: "text-blue-400 bg-blue-500/10", barColor: "bg-blue-500", label: "High", labelColor: "text-blue-400", percent: 86 },
    { role: "Backend Developer", icon: Database, iconColor: "text-orange-400 bg-orange-500/10", barColor: "bg-orange-500", label: "High", labelColor: "text-orange-400", percent: 80 },
    { role: "DevOps Engineer", icon: Server, iconColor: "text-purple-400 bg-purple-500/10", barColor: "bg-purple-500", label: "Medium", labelColor: "text-purple-400", percent: 65 },
    { role: "AI Engineer", icon: Brain, iconColor: "text-pink-400 bg-pink-500/10", barColor: "bg-pink-500", label: "High", labelColor: "text-pink-400", percent: 72 },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[11px] font-semibold text-slate-500 dark:text-gray-400 flex items-center gap-1.5">
          Job Market Demand <Info className="h-3 w-3" />
        </h3>
        <Link to="#" className="flex items-center gap-1.5 text-[10px] font-medium text-violet-400 hover:text-violet-300 transition-colors">
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-between space-y-4">
        {DEMAND_DATA.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconColor}`}>
              <item.icon className="h-4 w-4" />
            </div>
            
            <span className="w-32 shrink-0 text-[11px] font-medium text-slate-600 dark:text-gray-300">{item.role}</span>
            
            <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/5">
              <div 
                className={`h-full rounded-full ${item.barColor}`} 
                style={{ width: `${item.percent}%` }} 
              />
            </div>

            <div className="flex items-center justify-end w-20 shrink-0 gap-3">
              <span className={`text-[10px] font-medium ${item.labelColor}`}>{item.label}</span>
              <span className="text-[11px] font-bold text-slate-900 dark:text-white w-7 text-right">{item.percent}%</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
