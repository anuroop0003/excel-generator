import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import type { ExcelColumn } from "../../types";

interface ConfigFieldCellProps {
  id: string;
  field: "defaultValue" | "formatting" | "validation";
  value: string | undefined;
  placeholder: string;
  onUpdate: <K extends keyof ExcelColumn>(
    id: string,
    field: K,
    value: ExcelColumn[K],
  ) => void;
}

export function ConfigFieldCell({
  id,
  field,
  value,
  placeholder,
  onUpdate,
}: ConfigFieldCellProps) {
  return (
    <TableCell className="relative p-0 align-middle border-r border-slate-200 bg-white focus-within:z-20 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#107C41]">
      <Input
        value={value || ""}
        onChange={(e) => onUpdate(id, field, e.target.value)}
        placeholder={placeholder}
        className="h-full w-full border-0 bg-transparent text-[11px] text-slate-800 focus-visible:ring-0 shadow-none placeholder:text-slate-300 rounded-none"
      />
    </TableCell>
  );
}
