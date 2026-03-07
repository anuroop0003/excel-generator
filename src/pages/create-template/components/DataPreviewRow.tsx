import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { evaluateFormula } from "@/lib/formula-parser";
import { cn } from "@/lib/utils";
import type { ExcelColumn } from "../types";

interface DataPreviewRowProps {
  row: any;
  rowIndex: number;
  columns: ExcelColumn[];
  hasData: boolean;
  onUpdate: (rowIndex: number, field: string, value: any) => void;
}

export function DataPreviewRow({
  row,
  rowIndex,
  columns,
  hasData,
  onUpdate,
}: DataPreviewRowProps) {
  return (
    <TableRow className="border-b border-slate-200 hover:bg-green-50/50 h-6">
      <TableCell className="py-0 w-10 min-w-[40px] max-w-[40px] border-r border-slate-300 text-center text-[10px] text-slate-500 font-medium bg-slate-100 p-0 align-middle select-none shrink-0 grow-0">
        {rowIndex + 1}
      </TableCell>
      {columns.map((col) => {
        let cellValue: any = "";
        if (hasData) {
          // Handle Actual Raw Data
          if (col.isFormula) {
            cellValue = evaluateFormula(
              col.formula || "",
              row,
              rowIndex,
              columns,
            );
          } else {
            cellValue = row[col.name];
            if (
              cellValue === undefined ||
              cellValue === null ||
              cellValue === ""
            ) {
              cellValue = "";
            }
          }
        }

        return (
          <TableCell
            key={`${rowIndex}-${col.id}`}
            className={cn(
              "py-0 border-r border-slate-200 last:border-r-0 text-xs text-slate-600 align-middle",
            )}
          >
            {col.isFormula ? (
              <span className="font-mono text-[11px] text-green-700 font-semibold truncate block max-w-[200px]">
                {hasData ? cellValue : ""}
              </span>
            ) : col.type === "Enum" ? (
              <div className="group/cell relative flex items-center h-full w-full">
                <Select
                  key={JSON.stringify(col.options)}
                  value={hasData ? String(cellValue) : ""}
                  onValueChange={(val) => onUpdate(rowIndex, col.name, val)}
                >
                  <SelectTrigger className="h-[23px] w-full border-none bg-transparent px-2 text-[11px] shadow-none rounded-none focus:outline focus:outline-green-600 focus:-outline-offset-1 focus:bg-white hover:bg-slate-50 transition-none gap-0.5 [&_svg]:size-3 [&_svg]:opacity-0 group-hover/cell:[&_svg]:opacity-50">
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {(col.options || []).map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <Input
                value={hasData ? String(cellValue) : ""}
                onChange={(e) => onUpdate(rowIndex, col.name, e.target.value)}
                className="h-[23px] w-full border-none bg-transparent px-2 text-[11px] shadow-none rounded-none focus-visible:ring-0 focus:outline focus:outline-green-600 focus:-outline-offset-1 focus:bg-white hover:bg-slate-50 transition-none font-sans"
                placeholder=""
              />
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
