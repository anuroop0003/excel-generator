import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  GripVertical,
  Hash,
  List,
  SquareFunction,
  ToggleLeft,
  Trash2,
  Type,
} from "lucide-react";
import type { ColumnType, ExcelColumn } from "../types";
import { FormulaInput } from "./FormulaInput";

interface SchemaRowProps {
  col: ExcelColumn;
  handleRemoveColumn: (id: string) => void;
  handleUpdateColumn: <K extends keyof ExcelColumn>(
    id: string,
    field: K,
    value: ExcelColumn[K],
  ) => void;
}

export function SchemaRow({
  col,
  handleRemoveColumn,
  handleUpdateColumn,
}: SchemaRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: col.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 9999, position: "relative" as any } : {}),
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`group border-b border-slate-200 hover:bg-slate-50 h-7 focus-within:z-50 hover:z-50 ${
        isDragging ? "opacity-30 bg-slate-100" : ""
      }`}
    >
      {/* Drag Handle */}
      <TableCell className="w-8 p-0 align-middle bg-slate-50 border-r border-slate-200">
        <div
          {...attributes}
          {...listeners}
          className="flex h-full w-full items-center justify-center text-slate-400 cursor-grab active:cursor-grabbing hover:text-slate-600 outline-none"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>
      </TableCell>

      {/* Field Name */}
      <TableCell className="p-0 align-middle border-r border-slate-200">
        <Input
          value={col.name}
          onChange={(e) => handleUpdateColumn(col.id, "name", e.target.value)}
          className="h-full w-full border-0 bg-transparent px-2 text-[11px] font-medium text-slate-800 focus:ring-inset focus:ring-2 focus:ring-[#107C41] shadow-none"
          placeholder="Field name..."
        />
      </TableCell>

      {/* Data Type */}
      <TableCell className="p-0 align-middle border-r border-slate-200 bg-white">
        <Select
          value={col.type}
          onValueChange={(val) =>
            handleUpdateColumn(col.id, "type", val as ColumnType)
          }
        >
          <SelectTrigger className="h-full w-full border-0 bg-transparent hover:bg-slate-50 focus:ring-inset focus:ring-2 focus:ring-[#107C41] shadow-none text-xs font-medium text-slate-700 px-2 py-0">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="shadow-md border-slate-300 text-xs">
            <SelectItem value="String" className="text-xs py-1">
              <div className="flex items-center gap-2">
                <Type className="h-3 w-3 text-slate-400" /> Text
              </div>
            </SelectItem>
            <SelectItem value="Number" className="text-xs py-1">
              <div className="flex items-center gap-2">
                <Hash className="h-3 w-3 text-slate-400" /> Number
              </div>
            </SelectItem>
            <SelectItem value="Date" className="text-xs py-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-slate-400" /> Date
              </div>
            </SelectItem>
            <SelectItem value="Boolean" className="text-xs py-1">
              <div className="flex items-center gap-2">
                <ToggleLeft className="h-3 w-3 text-slate-400" /> Boolean
              </div>
            </SelectItem>
            <SelectItem value="Enum" className="text-xs py-1">
              <div className="flex items-center gap-2">
                <List className="h-3 w-3 text-slate-400" /> Enum
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </TableCell>

      {/* Configuration (Dynamic based on Type) */}
      <TableCell className="p-0 align-middle border-r border-slate-200 bg-slate-50/30">
        <div className="flex items-center h-full w-full gap-2 px-2 overflow-visible">
          {/* COMMON REQUIRED TOGGLE */}
          <label
            className="flex flex-col md:flex-row items-center gap-1 cursor-pointer shrink-0"
            title="Required Field"
          >
            <input
              type="checkbox"
              title="Mark Required"
              checked={col.required || false}
              onChange={(e) =>
                handleUpdateColumn(col.id, "required", e.target.checked)
              }
              className="size-3 border-slate-300 text-[#107C41] focus:ring-[#107C41] cursor-pointer"
            />
            <span className="text-[10px] font-medium text-slate-500 select-none hidden md:inline">
              Req
            </span>
          </label>

          {/* FORMULA TOGGLE (COMPUTED FIELD) */}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() =>
              handleUpdateColumn(col.id, "isFormula", !col.isFormula)
            }
            title="Toggle Formula (Computed Field)"
            className={cn(
              "p-0 transition-all",
              col.isFormula
                ? "border-green-600 bg-green-50 text-green-700 hover:text-green-700"
                : "border-slate-300 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700",
            )}
          >
            <SquareFunction className="size-4" />
          </Button>

          <div className="h-4 w-[1px] bg-slate-300 opacity-50 shrink-0"></div>

          {/* FORMULA CONFIG */}
          {col.isFormula ? (
            <FormulaInput
              value={col.formula || ""}
              onChange={(val) => handleUpdateColumn(col.id, "formula", val)}
            />
          ) : col.type === "Enum" ? (
            /* ENUM CONFIG */
            <div className="flex flex-1 items-center gap-2 h-full w-full">
              <Input
                value={col.options || ""}
                onChange={(e) =>
                  handleUpdateColumn(col.id, "options", e.target.value)
                }
                placeholder="Comma separated options (Item1, Item2)"
                className="h-full w-full font-mono text-[11px] px-2 border-0 bg-transparent focus:bg-white focus:ring-inset focus:ring-2 focus:ring-[#107C41] shadow-none placeholder:text-slate-300 text-slate-800"
              />
            </div>
          ) : (
            /* STANDARD FIELDS CONFIG */
            <div className="flex flex-1 items-center gap-1.5 h-full py-1">
              <Input
                value={col.defaultValue || ""}
                onChange={(e) =>
                  handleUpdateColumn(col.id, "defaultValue", e.target.value)
                }
                placeholder="Default Val"
                title="Default fall-back value"
                className="h-full w-[80px] lg:w-[100px] text-[11px] border border-slate-200 bg-white focus:bg-white focus:ring-1 focus:ring-[#107C41] shadow-none placeholder:text-slate-300 text-slate-800 px-1.5 shrink-0"
              />
              <Input
                value={col.formatting || ""}
                onChange={(e) =>
                  handleUpdateColumn(col.id, "formatting", e.target.value)
                }
                placeholder="Format Mask"
                title="Formatting mask (e.g. DD/MM/YYYY, 0.00)"
                className="h-full w-[80px] lg:w-[100px] text-[11px] border border-slate-200 bg-white focus:bg-white focus:ring-1 focus:ring-[#107C41] shadow-none placeholder:text-slate-300 text-slate-800 px-1.5 shrink-0"
              />
              <Input
                value={col.validation || ""}
                onChange={(e) =>
                  handleUpdateColumn(col.id, "validation", e.target.value)
                }
                placeholder="Validation Rule"
                title="Data validation boundaries or regex constraint"
                className="h-full min-w-[80px] flex-1 text-[11px] border border-slate-200 bg-white focus:bg-white focus:ring-1 focus:ring-[#107C41] shadow-none placeholder:text-slate-300 text-slate-800 px-1.5"
              />
            </div>
          )}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="p-0 align-middle text-center w-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleRemoveColumn(col.id)}
          className="h-full w-full text-slate-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
