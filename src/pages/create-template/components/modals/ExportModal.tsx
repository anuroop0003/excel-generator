import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, FileDown, FileJson } from "lucide-react";
import * as XLSX from "xlsx";
import type { ExcelColumn } from "../../types";

interface ExportModalProps {
  data: any[];
  columns: ExcelColumn[];
  templateName: string;
}

export function ExportModal({ data, columns, templateName }: ExportModalProps) {
  const exportToJson = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${templateName.replace(/\s+/g, "_")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // Transform data to match column names if necessary,
    // or just use the keys which should match col.name
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${templateName.replace(/\s+/g, "_")}.xlsx`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-[11px] font-semibold border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          <Download className="size-3.5" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogDescription>
            Choose your preferred format to export the current preview data.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 border-2 hover:border-[#107C41] hover:bg-green-50 transition-all group cursor-pointer"
            onClick={exportToExcel}
          >
            <FileDown className="size-8 text-[#107C41] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">Excel (.xlsx)</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 border-2 hover:border-yellow-600 hover:bg-yellow-50 transition-all group cursor-pointer"
            onClick={exportToJson}
          >
            <FileJson className="size-8 text-yellow-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold">JSON (.json)</span>
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <p className="text-[10px] text-slate-400">
            Exporting {data.length} rows and {columns.length} columns.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
