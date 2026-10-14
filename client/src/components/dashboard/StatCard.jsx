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
  chartColor,
  themeVariant = "dark",
  allowWrap = false,
  valueClassName = ""
}) {
  const isCandyCard = themeVariant !== "dark";

  const getRawText = (val) => {
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (val && typeof val === "object" && val.props) {
      return getRawText(val.props.children);
    }
    return "";
  };

  const rawString = getRawText(value);
  const strLen = rawString.length;
  const isMultiWordOrLong = strLen > 14 || (rawString.includes(" ") && strLen > 8);
  const shouldWrap = allowWrap || isMultiWordOrLong;

  const getMetricSizeClass = () => {
    if (!shouldWrap) {
      return "text-2xl leading-none truncate";
    }
    if (strLen > 24) {
      return "text-base sm:text-lg lg:text-xl leading-snug break-words [overflow-wrap:anywhere]";
    }
    if (strLen > 14) {
      return "text-lg sm:text-xl lg:text-2xl leading-snug break-words [overflow-wrap:anywhere]";
    }
    return "text-xl sm:text-2xl leading-tight break-words [overflow-wrap:anywhere]";
  };

  const getContainerStyle = () => {
    switch (themeVariant) {
      case "mint":
        return "bg-gradient-to-br from-[#4ee4cb] via-[#3de7c9] to-[#2cd4b3] text-slate-950 shadow-lg shadow-teal-500/15 border border-teal-300/40 hover:shadow-teal-500/25";
      case "yellow":
        return "bg-gradient-to-br from-[#ffd159] via-[#fed656] to-[#f5b82e] text-slate-950 shadow-lg shadow-amber-500/15 border border-amber-300/40 hover:shadow-amber-500/25";
      case "lavender":
        return "bg-gradient-to-br from-[#e29aff] via-[#d985fb] to-[#cf75f7] text-slate-950 shadow-lg shadow-fuchsia-500/15 border border-fuchsia-300/40 hover:shadow-fuchsia-500/25";
      case "pink":
        return "bg-gradient-to-br from-[#ff94aa] via-[#ff829b] to-[#ff6f8c] text-slate-950 shadow-lg shadow-pink-500/15 border border-pink-300/40 hover:shadow-pink-500/25";
      case "peach":
        return "bg-gradient-to-br from-[#ffb48a] via-[#ffa577] to-[#ff9462] text-slate-950 shadow-lg shadow-orange-500/15 border border-orange-300/40 hover:shadow-orange-500/25";
      case "sky":
        return "bg-gradient-to-br from-[#72c5ff] via-[#5cb7fa] to-[#46a7f5] text-slate-950 shadow-lg shadow-blue-500/15 border border-blue-300/40 hover:shadow-blue-500/25";
      default:
        return "bg-white dark:bg-[#1c1e24] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white shadow-sm dark:shadow-xl dark:shadow-black/25 hover:bg-slate-50 dark:hover:bg-[#22252c] hover:border-slate-300 dark:hover:border-white/15";
    }
  };

  return (
    <div className={`flex flex-col justify-between h-full rounded-2xl p-5 min-h-[148px] transition-all duration-300 backdrop-blur-md ${getContainerStyle()}`}>
      {/* Top Header: Title & Icon */}
      <div className="flex items-center justify-between gap-3">
        <h3 className={`text-xs font-bold uppercase tracking-wider truncate ${
          isCandyCard ? "text-slate-900/80" : "text-slate-500 dark:text-slate-400"
        }`}>
          {title}
        </h3>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform ${
          isCandyCard 
            ? "bg-black/15 text-slate-950 shadow-inner" 
            : iconBgColor || "bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10"
        }`}>
          <Icon className={`h-4.5 w-4.5 ${isCandyCard ? "text-slate-950" : iconColor}`} />
        </div>
      </div>

      {/* Middle: Prominent Metric Value */}
      <div className="my-1.5 min-w-0 flex-1 flex items-center">
        <div 
          className={`font-black tracking-tight ${
            isCandyCard ? "text-slate-950" : "text-slate-900 dark:text-white"
          } ${getMetricSizeClass()} ${valueClassName}`}
          title={rawString || undefined}
        >
          {value}
        </div>
      </div>

      {/* Bottom: Subtitle Pill Badge */}
      <div className="flex items-center">
        <span 
          className={`text-xs font-semibold truncate max-w-full ${
            isCandyCard 
              ? "text-slate-950 bg-black/10 px-2.5 py-1 rounded-full" 
              : `bg-slate-100 dark:bg-white/[0.06] px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/[0.06] ${subtitleColor}`
          }`}
          title={typeof subtitle === "string" ? subtitle : undefined}
        >
          {subtitle}
        </span>
      </div>
      
      {/* Mini Sparkline Chart */}
      {chartData && chartData.length > 0 && (
        <div className="mt-2 h-10 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={isCandyCard ? "#0f172a" : chartColor} 
                strokeWidth={2} 
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
