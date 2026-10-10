import * as Icons from "lucide-react";

export default function KeyTakeaways({ data }) {
  if (!data) return null;
  const takeaways = data.key_takeaways || [];

  const themeBadges = [
    "text-[#4ee4cb] bg-[#4ee4cb]/10 border-[#4ee4cb]/20",
    "text-[#ffd159] bg-[#ffd159]/10 border-[#ffd159]/20",
    "text-[#e29aff] bg-[#e29aff]/10 border-[#e29aff]/20",
    "text-[#ffb48a] bg-[#ffb48a]/10 border-[#ffb48a]/20"
  ];

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/[0.08] bg-[#1c1e24] p-6 shadow-xl shadow-black/25">
      
      <h3 className="mb-6 text-xs font-semibold uppercase tracking-wider text-slate-400">Key Takeaways</h3>

      <div className="flex-1 flex flex-col justify-between gap-3">
        {takeaways.map((item, idx) => {
          const IconComponent = Icons[item.iconName] || Icons.Target;
          const badgeClass = themeBadges[idx % themeBadges.length];

          return (
            <div key={idx} className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#242730] border border-white/[0.06]">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${badgeClass}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex items-center">
                <h4 className="text-sm font-semibold text-slate-200">{item.title}</h4>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
