export default function FormInput({
  label,
  icon: Icon,
  type = "text",
  placeholder,
  helperText,
  rightElement,
  ...props
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#ffd159]/80" />
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#242730] py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-500 outline-none transition-all focus:border-[#ffd159]/60 focus:bg-[#2b2f3a] ${
            Icon ? "pl-12" : "pl-4"
          } ${rightElement ? "pr-12" : "pr-4"}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {helperText && <p className="mt-1.5 text-xs text-slate-400">{helperText}</p>}
    </div>
  );
}
