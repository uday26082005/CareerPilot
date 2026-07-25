import * as Icons from "lucide-react";

export default function KeyTakeaways({ data }) {
  if (!data) return null;
  const takeaways = data.key_takeaways || [];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.02] p-6 backdrop-blur-md">
      
      <h3 className="mb-6 text-base font-semibold text-slate-500 dark:text-gray-400">Key Takeaways</h3>

      <div className="flex-1 flex flex-col justify-between">
        {takeaways.map((item, idx) => {
          const IconComponent = Icons[item.iconName] || Icons.Target;
          return (
            <div key={idx} className="flex gap-4">
              <div className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.iconColor}`}>
                <IconComponent className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
