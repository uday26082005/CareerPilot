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
          bg-[#242730] text-white
          border-white/[0.08] hover:border-white/20 hover:bg-[#2b2f3a]
          focus:outline-none focus:border-[#ffd159] focus:ring-2 focus:ring-[#ffd159]/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeClasses}
          ${isOpen ? "border-[#ffd159] ring-2 ring-[#ffd159]/20 shadow-lg shadow-black/40" : "shadow-sm"}
        `}
      >
        <div className="flex items-center gap-3 truncate">
          {Icon && <Icon className="h-5 w-5 text-[#ffd159] shrink-0" />}
          <span className={`truncate text-left ${!selectedOption ? "text-slate-400 font-normal" : "text-white"}`}>
            {displayLabel}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#ffd159]" : ""
          }`}
        />
      </button>

      {/* Themed Dropdown Menu Popup */}
      {isOpen && (
        <div
          className={`
            absolute z-[999] min-w-full max-h-56 overflow-y-auto
            rounded-2xl border border-white/10 bg-[#1c1e24]
            shadow-2xl shadow-black/90 backdrop-blur-2xl
            p-1.5 space-y-1
            animate-in fade-in zoom-in-95 duration-150
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-white/[0.02]
            [&::-webkit-scrollbar-thumb]:bg-white/20
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb:hover]:bg-white/30
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
                  rounded-xl transition-all duration-150 cursor-pointer
                  ${
                    isSelected
                      ? "bg-[#ffd159]/15 text-[#ffd159] border border-[#ffd159]/30 font-bold shadow-md shadow-amber-500/5"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="h-4 w-4 text-[#ffd159] shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
