import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

const CustomTick = ({ payload, x, y, cx, cy, textAnchor }) => {
  const text = payload.value || "";
  // Split long text by spaces, and also split after hyphens
  const lines = text.length > 12 ? text.replace(/-/g, '- ').split(' ') : [text];
  
  return (
    <g>
      <text x={x} y={y} dy={y > cy + 10 ? 10 : 0} textAnchor={textAnchor} fill="#9ca3af" fontSize={11}>
        {lines.map((line, index) => (
          <tspan x={x} dy={index === 0 ? 0 : 14} key={index}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export default function SkillRadarChart({ matchedSkills = [], missingSkills = [] }) {
  // Combine up to 8 skills to fit the radar chart nicely
  // Use 90 instead of 100 for matched to avoid touching edges, and 10 instead of 0 for missing to avoid center spikes
  const combined = [
    ...matchedSkills.slice(0, 4).map(skill => ({ subject: skill, A: 90, B: 100, fullMark: 100 })),
    ...missingSkills.slice(0, 4).map(skill => ({ subject: skill, A: 10, B: 100, fullMark: 100 }))
  ];
  
  // If we don't have enough skills from the backend, pad with some empty ones so chart doesn't break
  while (combined.length > 0 && combined.length < 3) {
    combined.push({ subject: '', A: 0, B: 0, fullMark: 100 });
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-0 text-base font-semibold text-slate-500 dark:text-gray-400">Skill Comparison</h3>
      
      <div className="h-[340px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={combined.length > 0 ? combined : [{subject: 'No Data', A:0, B:0, fullMark: 100}]} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
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
              name="Required Skills"
              dataKey="B"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.2}
            />
            
            <Legend 
              wrapperStyle={{ fontSize: '13px', paddingTop: '10px', color: '#9ca3af' }} 
              iconType="plainline"
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '8px', fontSize: '13px' }}
              itemStyle={{ color: '#fff' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
