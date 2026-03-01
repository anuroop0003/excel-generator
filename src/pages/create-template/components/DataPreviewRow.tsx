import { TableCell, TableRow } from "@/components/ui/table";
import { evaluateFormula } from "@/lib/formula-parser";
import type { ExcelColumn } from "../types";

interface DataPreviewRowProps {
  row: any;
  rowIndex: number;
  columns: ExcelColumn[];
  hasData: boolean;
}

export function DataPreviewRow({
  row,
  rowIndex,
  columns,
  hasData,
}: DataPreviewRowProps) {
  return (
    <TableRow className="border-b border-slate-200 hover:bg-green-50/50 h-6">
      <TableCell className="w-10 min-w-[40px] max-w-[40px] border-r border-slate-300 text-center text-[10px] text-slate-500 font-medium bg-slate-100 p-0 align-middle select-none flex-shrink-0 flex-grow-0">
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
              cellValue = col.defaultValue || "";
            }
          }
        }

        return (
          <TableCell
            key={`${rowIndex}-${col.id}`}
            className="px-2 py-0 border-r border-slate-200 last:border-r-0 text-xs text-slate-600 align-middle truncate max-w-[200px]"
          >
            {hasData ? (
              col.isFormula ? (
                <span className="font-mono text-[11px] text-green-700 font-semibold">
                  {cellValue}
                </span>
              ) : (
                <span
                  className={
                    cellValue === ""
                      ? "text-slate-300 italic text-[11px]"
                      : "text-slate-800"
                  }
                >
                  {cellValue === "" ? "empty" : String(cellValue)}
                </span>
              )
            ) : null}
          </TableCell>
        );
      })}
    </TableRow>
  );
}
