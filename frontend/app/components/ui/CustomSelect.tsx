"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  accentClass?: string; // e.g. "text-yellow-400", "text-violet-400"
  ringClass?: string;   // e.g. "focus-visible:ring-yellow-500/40"
}

export default function CustomSelect({
  label, id, value, onChange, options,
  accentClass = "text-yellow-400",
  ringClass = "ring-yellow-500/30",
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value) ?? options[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-1.5" ref={ref}>
      <label htmlFor={id} className="text-sm font-medium text-gray-300">{label}</label>
      
      {/* Trigger */}
      <button
        id={id}
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-black/50 border transition-all duration-200 text-sm font-medium text-white outline-none focus-visible:ring-2 ${ringClass} ${
          open ? `border-white/20 ring-2 ${ringClass}` : "border-white/10 hover:border-white/20"
        }`}
      >
        <span className="flex items-center gap-3">
          {selected?.icon && (
            <span className={`w-5 h-5 flex items-center justify-center shrink-0 ${accentClass}`}>
              {selected.icon}
            </span>
          )}
          <span>{selected?.label}</span>
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform duration-300 shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      <div
        role="listbox"
        className={`absolute z-50 mt-1 w-full min-w-[220px] rounded-2xl border border-white/10 bg-[#111]/95 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-200 origin-top ${
          open ? "opacity-100 scale-100 translate-y-0 pointer-events-auto" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
        style={{ maxWidth: ref.current ? ref.current.offsetWidth + "px" : undefined }}
      >
        <div className="p-1.5">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                  isSelected
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {/* Icon */}
                {opt.icon && (
                  <span className={`w-5 h-5 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? accentClass : "text-gray-600 group-hover:text-gray-300"
                  }`}>
                    {opt.icon}
                  </span>
                )}
                <span className="flex-1 text-left">{opt.label}</span>
                {/* Checkmark */}
                {isSelected && (
                  <Check size={14} className={`${accentClass} shrink-0`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
