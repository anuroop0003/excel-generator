import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import { useEffect, useState } from "react";
import type { ExcelColumn, Option } from "../../../types";

interface EnumOptionsCellProps {
  id: string;
  options: Option[] | undefined;
  onUpdate: <K extends keyof ExcelColumn>(
    id: string,
    field: K,
    value: ExcelColumn[K],
  ) => void;
}

export function EnumOptionsCell({
  id,
  options = [],
  onUpdate,
}: EnumOptionsCellProps) {
  const [inputValue, setInputValue] = useState("");

  // Update local state when options prop changes (e.g. initial load or external update)
  useEffect(() => {
    const valueString = options.map((opt) => opt.label).join(", ");
    setInputValue(valueString);
  }, [options]);

  const handleBlur = () => {
    const newOptions: Option[] = inputValue
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map((item) => ({ value: item, label: item }));
    onUpdate(id, "options", newOptions);
  };

  return (
    <TableCell
      colSpan={3}
      className="relative py-0 align-middle border-r border-slate-200 bg-slate-50/30 focus-within:z-20 focus-within:outline-2 focus-within:outline-[#107C41] focus-within:-outline-offset-2"
    >
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
          }
        }}
        placeholder="Comma separated options (Item1, Item2)"
        className="h-full w-full font-mono text-[11px] border-0 bg-transparent focus:bg-white focus-visible:ring-0 shadow-none placeholder:text-slate-300 text-slate-800 rounded-none"
      />
    </TableCell>
  );
}
