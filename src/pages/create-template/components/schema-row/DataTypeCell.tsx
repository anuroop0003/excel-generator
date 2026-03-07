import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import { Calendar, Hash, List, ToggleLeft, Type } from "lucide-react";
import type { ColumnType, ExcelColumn } from "../../types";

interface DataTypeCellProps {
  id: string;
  type: ColumnType;
  onUpdate: <K extends keyof ExcelColumn>(
    id: string,
    field: K,
    value: ExcelColumn[K],
  ) => void;
}

export function DataTypeCell({ id, type, onUpdate }: DataTypeCellProps) {
  return (
    <TableCell className="relative py-0 align-middle border-r border-slate-200 bg-white w-[110px] focus-within:z-20 focus-within:outline-2 focus-within:outline-[#107C41] focus-within:-outline-offset-2">
      <Select
        value={type}
        onValueChange={(val) => onUpdate(id, "type", val as ColumnType)}
      >
        <SelectTrigger className="h-full w-full border-0 bg-transparent hover:bg-slate-50 focus:ring-0 shadow-none text-xs font-medium text-slate-700 px-2 py-0 rounded-none">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="shadow-md border-slate-300 text-xs">
          <SelectItem value="String" className="text-xs py-1">
            <div className="flex items-center gap-2">
              <Type className="size-3 text-slate-400" /> Text
            </div>
          </SelectItem>
          <SelectItem value="Number" className="text-xs py-1">
            <div className="flex items-center gap-2">
              <Hash className="size-3 text-slate-400" /> Number
            </div>
          </SelectItem>
          <SelectItem value="Date" className="text-xs py-1">
            <div className="flex items-center gap-2">
              <Calendar className="size-3 text-slate-400" /> Date
            </div>
          </SelectItem>
          <SelectItem value="Boolean" className="text-xs py-1">
            <div className="flex items-center gap-2">
              <ToggleLeft className="size-3 text-slate-400" /> Boolean
            </div>
          </SelectItem>
          <SelectItem value="Enum" className="text-xs py-1">
            <div className="flex items-center gap-2">
              <List className="size-3 text-slate-400" /> Enum
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </TableCell>
  );
}
