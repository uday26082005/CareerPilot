import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function ThemedSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
  align = "right",
  disabled = false,
  icon: Icon = null,
  size = "md"
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smart auto-flip: detect if there's enough space below or if we should open upwards
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 250 && rect.top > spaceBelow) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
  }, [isOpen]);

  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((o) => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (optValue) => {
    if (disabled) return;
    onChange(optValue);
    setIsOpen(false);
  };

  const sizeClasses = size === "lg" 
    ? "py-3.5 px-4 text-base rounded-xl" 
    : "py-2.5 px-4 text-sm rounded-xl";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex items-center justify-between w-full gap-3
          border font-semibold transition-all duration-200 cursor-pointer
          bg-[#0d1226] text-white
          border-white/10 hover:border-violet-500/50 hover:bg-[#111733]
          focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeClasses}
          ${isOpen ? "border-violet-500 ring-2 ring-violet-500/20 shadow-lg shadow-violet-950/30" : "shadow-sm"}
        `}
      >
        <div className="flex items-center gap-3 truncate">
          {Icon && <Icon className="h-5 w-5 text-violet-400 shrink-0" />}
          <span className={`truncate text-left ${!selectedOption ? "text-slate-400 font-normal" : "text-white"}`}>
            {displayLabel}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-violet-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-violet-300" : ""
          }`}
        />
      </button>

      {/* Themed Dropdown Menu Popup */}
      {isOpen && (
        <div
          className={`
            absolute z-[999] min-w-full max-h-56 overflow-y-auto
            rounded-xl border border-violet-500/30 bg-[#0c1024]/98
            shadow-2xl shadow-black/90 backdrop-blur-2xl
            p-1.5 space-y-0.5
            animate-in fade-in zoom-in-95 duration-150
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-white/[0.02]
            [&::-webkit-scrollbar-thumb]:bg-violet-500/50
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:bg-violet-400
            ${openUpwards ? "bottom-full mb-2" : "top-full mt-2"}
            ${align === "right" ? "right-0" : "left-0"}
          `}
          style={{ minWidth: "max(100%, 220px)" }}
        >
          {normalizedOptions.map((opt, idx) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`
                  flex items-center justify-between w-full px-3.5 py-2.5 text-sm text-left
                  rounded-lg transition-all duration-150 cursor-pointer
                  ${
                    isSelected
                      ? "bg-violet-600 text-white font-bold shadow-md shadow-violet-600/30"
                      : "text-slate-300 hover:bg-violet-500/15 hover:text-white"
                  }
                `}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="h-4 w-4 text-white shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
