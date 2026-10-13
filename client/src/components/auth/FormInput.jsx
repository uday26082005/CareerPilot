export default function FormInput({
  label,
  icon: Icon,
  type = "text",
  id,
  name,
  autoComplete,
  placeholder,
  helperText,
  rightElement,
  ...props
}) {
  const inputId = id || name;

  return (
    <div>
      {label && (
        <label 
          htmlFor={inputId}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-500 dark:text-[#ffd159]/80" />
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#242730] py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-amber-400 focus:bg-white dark:focus:border-[#ffd159]/60 dark:focus:bg-[#2b2f3a] ${
            Icon ? "pl-12" : "pl-4"
          } ${rightElement ? "pr-12" : "pr-4"}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {helperText && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
}
