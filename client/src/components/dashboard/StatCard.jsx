import { ResponsiveContainer, LineChart, Line } from "recharts";

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  subtitleColor, 
  icon: Icon, 
  iconBgColor, 
  iconColor,
  chartData,
  chartColor
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-4 backdrop-blur-md transition-all hover:bg-white/[0.04] hover:border-slate-200 dark:border-white/10">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400">{title}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-slate-900 dark:text-white">{value}</span>
              <span className={`text-xs font-medium ${subtitleColor}`}>
                {subtitle}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mini Sparkline Chart */}
      <div className="mt-2 h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={chartColor} 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
