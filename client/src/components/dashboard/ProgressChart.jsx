import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChevronDown } from "lucide-react";

export default function ProgressChart({ data }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0c1a] p-3 shadow-xl">
          <p className="text-sm font-bold text-violet-400">{`Score: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Progress</h3>
        <button className="flex items-center gap-2 rounded-lg bg-slate-100 dark:bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-gray-300 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:text-white">
          This Week <ChevronDown className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 2, stroke: '#060816' }}
              activeDot={{ r: 6, fill: '#8b5cf6', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
