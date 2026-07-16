import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";

const DATA = [
  { subject: 'JavaScript', A: 90, B: 100, fullMark: 100 },
  { subject: 'React', A: 85, B: 90, fullMark: 100 },
  { subject: 'Node.js', A: 70, B: 85, fullMark: 100 },
  { subject: 'Databases', A: 75, B: 80, fullMark: 100 },
  { subject: 'System Design', A: 50, B: 75, fullMark: 100 },
  { subject: 'Cloud (AWS)', A: 40, B: 70, fullMark: 100 },
  { subject: 'DevOps', A: 30, B: 60, fullMark: 100 },
  { subject: 'Problem Solving', A: 85, B: 80, fullMark: 100 },
];

export default function SkillRadarChart() {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      <h3 className="mb-4 text-sm font-semibold text-slate-500 dark:text-gray-400">Skill Comparison</h3>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={DATA}>
            <PolarGrid stroke="#ffffff20" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} stroke="#ffffff20" />
            
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
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#9ca3af' }} 
              iconType="plainline"
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#ffffff10', borderRadius: '8px', fontSize: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
