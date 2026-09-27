import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

const CustomTick = ({ payload, x, y, cy, textAnchor }) => {
  const text = payload.value || "";
  const lines = text.length > 14 ? text.replace(/-/g, '- ').split(' ') : [text];
  
  return (
    <g>
      <text x={x} y={y} dy={y > cy + 10 ? 10 : 0} textAnchor={textAnchor} fill="#9ca3af" fontSize={11}>
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
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
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
            <PolarGrid stroke="#ffffff20" />
            <PolarAngleAxis dataKey="subject" tick={<CustomTick />} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            
            <Radar
              name="Your Skills"
              dataKey="A"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.4}
            />
            <Radar
              name="Role Benchmark"
              dataKey="B"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.15}
            />
            
            <Legend 
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#9ca3af' }} 
              iconType="plainline"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg bg-slate-900 border border-white/10 p-2.5 text-xs text-white shadow-xl">
                      <span className="font-bold text-violet-300 block mb-1">{data.subject}</span>
                      <div className="flex flex-col gap-0.5 text-slate-300">
                        <span>Your Coverage: <strong className="text-white">{data.A}%</strong></span>
                        {data.detectedCount !== undefined && (
                          <span>Competencies: <strong className="text-emerald-400">{data.detectedCount}</strong> / {data.totalCount} detected</span>
                        )}
                        <span>Role Expectation: <strong className="text-blue-400">100%</strong></span>
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
