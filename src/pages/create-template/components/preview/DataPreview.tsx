import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getColumnLetter } from "@/lib/utils";
import { Database, LayoutTemplate } from "lucide-react";
import type { ExcelColumn } from "../../types";
import { TypeIcon } from "../common/TypeIcon";
import { DataInputModal } from "../modals/DataInputModal";
import { ExportModal } from "../modals/ExportModal";
import { DataPreviewRow } from "./DataPreviewRow";

interface DataPreviewProps {
  columns: ExcelColumn[];
  sampleData?: any[];
  onLoadData?: (data: any[]) => void;
  onUpdateCell: (rowIndex: number, field: string, value: any) => void;
  templateName: string;
}

export function DataPreview({
  columns,
  sampleData = [],
  onLoadData,
  onUpdateCell,
  templateName,
}: DataPreviewProps) {
  const hasData = sampleData && sampleData.length > 0;
  const rowsToRender = hasData ? sampleData : Array.from({ length: 40 });

  return (
    <>
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-300 bg-slate-100 px-3">
        <div className="flex items-center gap-1.5">
          <Database className="size-3.5 text-[#107C41]" />
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
              <div className="w-px h-3 bg-slate-300"></div>
              <DataInputModal columns={columns} onRunOutput={onLoadData} />
              <div className="w-px h-3 bg-slate-300"></div>
              <ExportModal
                data={sampleData}
                columns={columns}
                templateName={templateName}
              />
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
              <TableRow className="border-none bg-slate-200/50">
                <TableHead className="w-10 min-w-[40px] max-w-[40px] border-r border-slate-300 bg-slate-200/50 h-5 p-0"></TableHead>
                {columns.map((_, idx) => (
                  <TableHead
                    key={`letter-${idx}`}
                    className="h-5 border-r border-slate-300 px-2 bg-slate-200/50 text-center text-[10px] font-bold text-slate-500 py-0"
                  >
                    {getColumnLetter(idx)}
                  </TableHead>
                ))}
              </TableRow>
              <TableRow className="hover:bg-slate-100 border-none">
                <TableHead className="w-10 min-w-[40px] max-w-[40px] border-r border-slate-300 text-center px-0 text-slate-500 font-medium text-[11px] h-7 p-0 bg-slate-200 shrink-0 grow-0"></TableHead>
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
                        className="size-3 text-[#107C41] opacity-70 ml-2 shrink-0"
                      />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rowsToRender.map((row, rowIndex) => (
                <DataPreviewRow
                  key={`row-${rowIndex}`}
                  row={row}
                  rowIndex={rowIndex}
                  columns={columns}
                  hasData={hasData}
                  onUpdate={onUpdateCell}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
