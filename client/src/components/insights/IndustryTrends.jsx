import { ArrowRight, Code2, Cpu, Cloud, Server } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

const generateData = (trend) => {
  return Array.from({ length: 15 }, (_, i) => ({
    value: trend === 'up' ? i * 2 + Math.random() * 10 : 10 + Math.random() * 5
  }));
};

export default function IndustryTrends() {
  const TRENDS = [
    { name: "MERN Stack", demand: "Demand +18%", icon: Code2, color: "#10b981", data: generateData('up') },
    { name: "AI Integration", demand: "Demand +31%", icon: Cpu, color: "#3b82f6", data: generateData('up') },
    { name: "Cloud Computing", demand: "Demand +25%", icon: Cloud, color: "#f59e0b", data: generateData('up') },
    { name: "DevOps", demand: "Demand +20%", icon: Server, color: "#8b5cf6", data: generateData('up') },
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-slate-500 dark:text-gray-400">Industry Trends</h3>
        <Link to="#" className="flex items-center gap-1.5 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        {TRENDS.map((trend, idx) => (
          <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-white/5 last:border-0 last:pb-0 first:pt-0">
            
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300">
                <trend.icon className="h-4 w-4" style={{ color: trend.color }} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{trend.name}</h4>
                <p className="text-xs" style={{ color: trend.color }}>{trend.demand}</p>
              </div>
            </div>

            <div className="h-8 w-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trend.data}>
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={trend.color} 
                    strokeWidth={1.5} 
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        ))}
      </div>
      
    </div>
  );
}
