import * as Icons from "lucide-react";

export default function KeyTakeaways({ data }) {
  if (!data) return null;
  const takeaways = data.key_takeaways || [];

  const themeBadges = [
    "text-teal-700 bg-teal-50 border-teal-200 dark:text-[#4ee4cb] dark:bg-[#4ee4cb]/10 dark:border-[#4ee4cb]/20",
    "text-amber-700 bg-amber-50 border-amber-200 dark:text-[#ffd159] dark:bg-[#ffd159]/10 dark:border-[#ffd159]/20",
    "text-purple-700 bg-purple-50 border-purple-200 dark:text-[#e29aff] dark:bg-[#e29aff]/10 dark:border-[#e29aff]/20",
    "text-rose-700 bg-rose-50 border-rose-200 dark:text-[#ffb48a] dark:bg-[#ffb48a]/10 dark:border-[#ffb48a]/20"
  ];

  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/[0.08] dark:bg-[#1c1e24] dark:shadow-xl dark:shadow-black/25">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Key Takeaways
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3">
        {takeaways.slice(0, 4).map((item, idx) => {
          const IconComponent = Icons[item.iconName] || Icons.Target;
          const badgeClass = themeBadges[idx % themeBadges.length];

          // Keep title concise and punchy without run-on sentences
          let displayTitle = (item.title || "").trim();
          if (displayTitle.includes(".")) {
            const firstClause = displayTitle.split(".")[0].trim();
            if (firstClause.length >= 10) displayTitle = firstClause;
          }

          return (
            <div
              key={idx}
              className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 dark:bg-[#242730] dark:border-white/[0.06]"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${badgeClass}`}
              >
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                  {displayTitle}
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
