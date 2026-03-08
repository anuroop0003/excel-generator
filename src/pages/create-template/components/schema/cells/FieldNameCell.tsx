import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import { getColumnLetter } from "@/lib/utils";
import type { ExcelColumn } from "../../../types";

interface FieldNameCellProps {
  id: string;
  name: string;
  onUpdate: <K extends keyof ExcelColumn>(
    id: string,
    field: K,
    value: ExcelColumn[K],
  ) => void;
  index: number;
}

export function FieldNameCell({
  id,
  name,
  index,
  onUpdate,
}: FieldNameCellProps) {
  return (
    <TableCell className="relative py-0 align-middle border-r border-slate-200 focus-within:z-20 focus-within:outline-2 focus-within:outline-[#107C41] focus-within:-outline-offset-2">
      <div className="flex items-center h-full">
        <div className="flex h-full w-6 shrink-0 items-center justify-center bg-slate-50 border-r border-slate-200 text-[10px] font-bold text-slate-400 select-none">
          {getColumnLetter(index)}
        </div>
        <Input
          value={name}
          onChange={(e) => onUpdate(id, "name", e.target.value)}
          className="h-full w-full border-0 bg-transparent px-2 text-[11px] font-medium text-slate-800 focus-visible:ring-0 shadow-none rounded-none"
          placeholder="Field name..."
        />
      </div>
    </TableCell>
  );
}
