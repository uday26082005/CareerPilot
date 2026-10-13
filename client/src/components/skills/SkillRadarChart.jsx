import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useTheme } from "../../contexts/ThemeContext";

const CustomTick = ({ payload, x, y, cy, textAnchor, isDark }) => {
  const text = payload.value || "";
  const lines = text.length > 14 ? text.replace(/-/g, '- ').split(' ') : [text];
  
  return (
    <g>
      <text x={x} y={y} dy={y > cy + 10 ? 10 : 0} textAnchor={textAnchor} fill={isDark ? "#9ca3af" : "#334155"} fontSize={11} fontWeight={isDark ? "normal" : "500"}>
        {lines.map((line, index) => (
          <tspan x={x} dy={index === 0 ? 0 : 13} key={index}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export default function SkillRadarChart({ radarData = [], matchedSkills = [], missingSkills = [] }) {
  const { isDark } = useTheme();
  // Use meaningful domain pillars if provided
  let chartData;

  if (Array.isArray(radarData) && radarData.length >= 3) {
    chartData = radarData;
  } else {
    // Fallback for legacy records: pick top 4 matched and top 4 missing
    const combined = [
      ...matchedSkills.slice(0, 4).map(skill => ({ subject: skill, A: 90, B: 100, fullMark: 100 })),
      ...missingSkills.slice(0, 4).map(skill => ({ subject: skill, A: 15, B: 100, fullMark: 100 }))
    ];
    while (combined.length > 0 && combined.length < 3) {
      combined.push({ subject: '', A: 0, B: 100, fullMark: 100 });
    }
    chartData = combined;
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 shadow-xs hover:shadow-sm transition-all backdrop-blur-md">
      <div className="mb-2">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Role Domain Competency</h3>
        <p className="text-xs text-slate-500 dark:text-gray-400">
          Core engineering pillar coverage vs role expectation
        </p>
      </div>
      
      <div className="h-[320px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart 
            cx="50%" 
            cy="50%" 
            outerRadius="72%" 
            data={chartData.length > 0 ? chartData : [{ subject: 'No Data', A: 0, B: 100, fullMark: 100 }]} 
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <PolarGrid stroke={isDark ? "#ffffff20" : "#e2e8f0"} />
            <PolarAngleAxis dataKey="subject" tick={<CustomTick isDark={isDark} />} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            
            <Radar
              name="Your Skills"
              dataKey="A"
              stroke={isDark ? "#ffd159" : "#f59e0b"}
              fill={isDark ? "#ffd159" : "#f59e0b"}
              fillOpacity={isDark ? 0.4 : 0.35}
            />
            <Radar
              name="Role Benchmark"
              dataKey="B"
              stroke={isDark ? "#4ee4cb" : "#0d9488"}
              fill={isDark ? "#4ee4cb" : "#0d9488"}
              fillOpacity={0.15}
            />
            
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: isDark ? '#9ca3af' : '#475569' }} 
              iconType="plainline"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-xl bg-white dark:bg-[#1c1e24] border border-slate-200 dark:border-white/10 p-2.5 text-xs text-slate-900 dark:text-white shadow-xl">
                      <span className="font-bold text-amber-600 dark:text-[#ffd159] block mb-1">{data.subject}</span>
                      <div className="flex flex-col gap-0.5 text-slate-600 dark:text-slate-300">
                        <span>Your Coverage: <strong className="text-slate-900 dark:text-white">{data.A}%</strong></span>
                        {data.detectedCount !== undefined && (
                          <span>Competencies: <strong className="text-teal-600 dark:text-[#4ee4cb]">{data.detectedCount}</strong> / {data.totalCount} detected</span>
                        )}
                        <span>Role Expectation: <strong className="text-teal-600 dark:text-[#4ee4cb]">100%</strong></span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
