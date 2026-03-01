import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { evaluateFormula } from "@/lib/formula-parser";
import { Database, LayoutTemplate } from "lucide-react";
import type { ExcelColumn } from "../types";
import { TypeIcon } from "./TypeIcon";

import { DataInputModal } from "./DataInputModal";

interface DataPreviewProps {
  columns: ExcelColumn[];
  sampleData?: any[];
  onLoadData?: (data: any[]) => void;
}

export function DataPreview({
  columns,
  sampleData = [],
  onLoadData,
}: DataPreviewProps) {
  const hasData = sampleData && sampleData.length > 0;
  const rowsToRender = hasData ? sampleData : Array.from({ length: 40 });

  return (
    <>
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-300 bg-slate-100 px-3">
        <div className="flex items-center gap-1.5">
          <Database className="h-3.5 w-3.5 text-[#107C41]" />
          <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Data Preview
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-slate-500">
            {columns.length} columns defined
          </span>
          {onLoadData && (
            <>
              <div className="w-[1px] h-3 bg-slate-300"></div>
              <DataInputModal onRunOutput={onLoadData} />
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white relative">
        {columns.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400 absolute inset-0">
            <LayoutTemplate className="h-8 w-8 text-slate-200" />
            <p className="text-xs">No columns to preview.</p>
          </div>
        ) : (
          <Table className="whitespace-nowrap w-full border-collapse">
            <TableHeader className="sticky top-0 z-10 bg-slate-100 shadow-[0_1px_0_0_#cbd5e1]">
              <TableRow className="hover:bg-slate-100 border-none">
                <TableHead className="w-10 min-w-[40px] max-w-[40px] border-r border-slate-300 text-center px-0 text-slate-500 font-medium text-[11px] h-7 p-0 bg-slate-200 flex-shrink-0 flex-grow-0"></TableHead>
                {columns.map((col, idx) => (
                  <TableHead
                    key={col.id}
                    className="h-7 border-r border-slate-300 last:border-r-0 px-2 bg-slate-100 py-0 align-middle"
                  >
                    <div className="flex items-center justify-between w-full min-w-[100px]">
                      <span className="text-xs font-semibold text-slate-700 truncate">
                        {col.name || `Column ${idx + 1}`}
                      </span>
                      <TypeIcon
                        type={col.type}
                        className="h-3 w-3 text-[#107C41] opacity-70 ml-2 shrink-0"
                      />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rowsToRender.map((row, rowIndex) => (
                <TableRow
                  key={`row-${rowIndex}`}
                  className="border-b border-slate-200 hover:bg-green-50/50 h-6"
                >
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
                        ) : // MOCK PREVIEW
                        rowIndex < 3 ? (
                          col.isFormula ? (
                            <span className="font-mono text-[11px] text-green-700">
                              ={col.formula?.substring(1) || "FORMULA"}
                            </span>
                          ) : col.type === "Boolean" ? (
                            <span className="text-slate-600">TRUE</span>
                          ) : col.type === "Enum" ? (
                            <span className="text-slate-600">
                              {col.options?.split(",")[0]?.trim() || "Option"}
                            </span>
                          ) : col.type === "Number" ? (
                            <span className="text-slate-600 font-mono text-right w-full block">
                              123.45
                            </span>
                          ) : col.type === "Date" ? (
                            <span className="text-slate-600">2026-03-01</span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px] px-1">
                              {rowIndex === 0 ? col.name || "text" : "sample"}
                            </span>
                          )
                        ) : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
