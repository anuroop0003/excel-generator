import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { parseRawDataInput } from "@/lib/data-parser";
import { FileSpreadsheet, Play, Upload } from "lucide-react";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";

interface DataInputModalProps {
  onRunOutput: (data: any[]) => void;
}

export function DataInputModal({ onRunOutput }: DataInputModalProps) {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRun = () => {
    try {
      setError(null);
      // If we have text input, use that. Otherwise if we have file, it's already processed or we need to inform user.
      // But typically user expects text or file.
      if (inputText.trim()) {
        const parsedData = parseRawDataInput(inputText);
        onRunOutput(parsedData);
        setOpen(false);
        reset();
      } else if (uploadedFileName) {
        // If file was already parsed into text, we just run it.
        // In my implementation below, I'll put parsed data into the text area.
        setError("Please ensure data is loaded in the input box above.");
      } else {
        setError("Please provide some data (JSON, CSV or Excel).");
      }
    } catch (err: any) {
      setError(
        "Failed to parse data. Please ensure it is valid JSON or CSV format.",
      );
    }
  };

  const reset = () => {
    setInputText("");
    setUploadedFileName(null);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        setInputText(JSON.stringify(data, null, 2));
      } catch (err) {
        setError("Failed to read Excel file. Please try a different file.");
      }
    };
    reader.onerror = () => setError("Error reading file.");
    reader.readAsBinaryString(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-6 text-[11px] text-[#107C41] border-[#107C41] hover:bg-green-50 shadow-sm cursor-pointer"
        >
          <Upload />
          Load Data
        </Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false} className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#107C41] flex items-center gap-2">
            <Upload className="size-5" /> Load Test Data
          </DialogTitle>
          <DialogDescription>
            Paste your raw data in JSON sequence or basic CSV format, or upload
            an Excel file.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
              Input Data
            </span>
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 text-[11px] text-[#107C41] hover:bg-green-50 px-2 flex items-center cursor-pointer"
              >
                <FileSpreadsheet className="size-3.5" />
                {uploadedFileName ? "Change File" : "Upload Excel"}
              </Button>
            </div>
          </div>

          <div className="relative">
            <Textarea
              placeholder={'[\n  { "ID": 1, "First Name": "John" }\n]'}
              className="min-h-[180px] max-h-[400px] overflow-auto font-mono text-[11px] border-slate-300 focus-visible:ring-[#107C41] bg-slate-50/50"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            {uploadedFileName && (
              <div className="absolute top-2 right-2 bg-green-100 text-[#107C41] text-[10px] px-2 py-0.5 rounded border border-green-200 flex items-center gap-1 shadow-sm">
                <FileSpreadsheet className="size-2.5" />
                {uploadedFileName}
              </div>
            )}
          </div>
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-slate-500 cursor-pointer"
              onClick={reset}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleRun}
            className="bg-[#107C41] hover:bg-[#0c6132] text-white cursor-pointer"
          >
            <Play className="size-4" /> Run Output
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
