import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import * as formulajs from "@formulajs/formulajs";
import { useState } from "react";

const FORMULA_FUNCTIONS = Object.keys(formulajs).map((name) => ({
  name,
  desc: `Standard Excel ${name} function`,
}));

export function FormulaInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  // Extract the word being typed after an "=" or after a non-word character
  const match = value.match(/([A-Za-z]+)$/);
  const search = match ? match[1].toUpperCase() : "";

  const suggestions = value.startsWith("=")
    ? FORMULA_FUNCTIONS.filter((f) => f.name.startsWith(search))
    : [];

  const showSuggestions =
    focused && value.startsWith("=") && suggestions.length > 0;

  const handleSelect = (funcName: string) => {
    if (search) {
      onChange(value.slice(0, -search.length) + funcName + "(");
    } else {
      onChange(value + funcName + "(");
    }
  };

  return (
    <Popover open={showSuggestions}>
      <PopoverAnchor asChild>
        <div className="relative flex items-center flex-1 h-full w-full">
          <span className="absolute left-2 text-[11px] font-mono font-bold text-green-700 pointer-events-none">
            ƒx
          </span>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="=SUM(A, B)"
            className="h-full w-full font-mono text-[11px] pl-6 border-0 bg-transparent focus:bg-white focus:ring-inset focus:ring-2 focus:ring-[#107C41] shadow-none placeholder:text-slate-300 text-green-900"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[250px] p-1 border-slate-200 shadow-xl z-[100] max-h-[180px] overflow-auto"
        align="start"
      >
        {suggestions.map((s) => (
          <div
            key={s.name}
            className="px-2 py-1.5 hover:bg-slate-100 cursor-pointer flex flex-col"
            onMouseDown={(e) => {
              e.preventDefault();
              handleSelect(s.name);
            }}
          >
            <div className="text-[11px] font-mono font-bold text-green-800">
              {s.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate">{s.desc}</div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
