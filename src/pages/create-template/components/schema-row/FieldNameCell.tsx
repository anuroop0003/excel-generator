import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import type { ExcelColumn } from "../../types";

interface FieldNameCellProps {
  id: string;
  name: string;
  onUpdate: <K extends keyof ExcelColumn>(
    id: string,
    field: K,
    value: ExcelColumn[K],
  ) => void;
}

export function FieldNameCell({ id, name, onUpdate }: FieldNameCellProps) {
  return (
    <TableCell className="relative p-0 align-middle border-r border-slate-200 focus-within:z-20 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#107C41]">
      <Input
        value={name}
        onChange={(e) => onUpdate(id, "name", e.target.value)}
        className="h-full w-full border-0 bg-transparent px-2 text-[11px] font-medium text-slate-800 focus-visible:ring-0 shadow-none rounded-none"
        placeholder="Field name..."
      />
    </TableCell>
  );
}
