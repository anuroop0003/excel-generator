import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import type { ExcelColumn } from "../../types";

interface EnumOptionsCellProps {
  id: string;
  options: string | undefined;
  onUpdate: <K extends keyof ExcelColumn>(
    id: string,
    field: K,
    value: ExcelColumn[K],
  ) => void;
}

export function EnumOptionsCell({
  id,
  options,
  onUpdate,
}: EnumOptionsCellProps) {
  return (
    <TableCell
      colSpan={4}
      className="relative p-0 align-middle border-r border-slate-200 bg-slate-50/30 focus-within:z-20 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#107C41]"
    >
      <Input
        value={options || ""}
        onChange={(e) => onUpdate(id, "options", e.target.value)}
        placeholder="Comma separated options (Item1, Item2)"
        className="mx-0.5 h-full w-full font-mono text-[11px] border-0 bg-transparent focus:bg-white focus-visible:ring-0 shadow-none placeholder:text-slate-300 text-slate-800 rounded-none"
      />
    </TableCell>
  );
}
