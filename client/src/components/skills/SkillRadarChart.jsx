import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";



export default function SkillRadarChart({ matchedSkills = [], missingSkills = [] }) {
  // Combine up to 8 skills to fit the radar chart nicely
  const combined = [
    ...matchedSkills.slice(0, 4).map(skill => ({ subject: skill, A: 100, B: 100, fullMark: 100 })),
    ...missingSkills.slice(0, 4).map(skill => ({ subject: skill, A: 30, B: 100, fullMark: 100 }))
  ];
  
  // If we don't have enough skills from the backend, pad with some empty ones so chart doesn't break
  while (combined.length > 0 && combined.length < 3) {
    combined.push({ subject: '', A: 0, B: 0, fullMark: 100 });
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-0 text-base font-semibold text-slate-500 dark:text-gray-400">Skill Comparison</h3>
      
      <div className="h-[280px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={combined.length > 0 ? combined : [{subject: 'No Data', A:0, B:0, fullMark: 100}]}>
            <PolarGrid stroke="#ffffff20" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} stroke="#ffffff20" />
            
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
