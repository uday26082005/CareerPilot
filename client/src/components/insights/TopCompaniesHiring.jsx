import { ArrowRight, Search, Building2, Terminal, Monitor, Code } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopCompaniesHiring() {
  const COMPANIES = [
    { name: "Google", icon: Search, color: "text-blue-500", demand: "High", demandColor: "text-emerald-400", salary: "₹18 - 45 LPA", openings: "120+ Openings" },
    { name: "Microsoft", icon: LayoutGrid, color: "text-green-500", demand: "High", demandColor: "text-emerald-400", salary: "₹15 - 40 LPA", openings: "90+ Openings" },
    { name: "Amazon", icon: Building2, color: "text-orange-500", demand: "High", demandColor: "text-emerald-400", salary: "₹16 - 38 LPA", openings: "150+ Openings" },
    { name: "TCS", icon: Code, color: "text-red-500", demand: "High", demandColor: "text-emerald-400", salary: "₹3.5 - 12 LPA", openings: "250+ Openings" },
    { name: "Infosys", icon: Monitor, color: "text-blue-400", demand: "Medium", demandColor: "text-orange-400", salary: "₹3 - 10 LPA", openings: "180+ Openings" },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-md">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[11px] font-semibold text-gray-400">Top Companies Hiring</h3>
        <Link to="#" className="flex items-center gap-1.5 text-[10px] font-medium text-violet-400 hover:text-violet-300 transition-colors">
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="flex-1 grid grid-cols-5 divide-x divide-white/5">
        {COMPANIES.map((company, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center px-2 text-center">
            
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${company.color}`}>
              {company.name === 'Microsoft' ? (
                <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                   <div className="bg-red-500 rounded-sm"></div>
                   <div className="bg-green-500 rounded-sm"></div>
                   <div className="bg-blue-500 rounded-sm"></div>
                   <div className="bg-yellow-500 rounded-sm"></div>
                </div>
              ) : company.name === 'Google' ? (
                <span className="font-black text-lg text-blue-500">G</span>
              ) : company.name === 'Amazon' ? (
                <span className="font-bold text-lg text-white">a</span>
              ) : company.name === 'TCS' ? (
                <span className="font-bold text-sm text-red-500">tcs</span>
              ) : (
                <span className="font-bold text-xs text-blue-400">Infosys</span>
              )}
            </div>
            
            <h4 className="text-[11px] font-bold text-white mb-1">{company.name}</h4>
            <span className={`text-[9px] font-bold mb-2 ${company.demandColor}`}>{company.demand}</span>
            <span className="text-[9px] text-gray-400 mb-1">{company.salary}</span>
            <span className="text-[9px] text-gray-500">{company.openings}</span>

          </div>
        ))}
      </div>
      
    </div>
  );
}

// Temporary layout grid replacement for Microsoft icon
function LayoutGrid({ className }) {
  return <div className={className}></div>;
}
