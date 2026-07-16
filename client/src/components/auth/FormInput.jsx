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
      <label className="mb-1 block text-sm font-semibold text-gray-200">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-300/70" />
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-sm text-white placeholder-gray-500 backdrop-blur-xl outline-none transition-all focus:border-violet-500/50 focus:bg-white/[0.06] ${
            Icon ? "pl-12" : "pl-4"
          } ${rightElement ? "pr-12" : "pr-4"}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {helperText && <p className="mt-2 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
