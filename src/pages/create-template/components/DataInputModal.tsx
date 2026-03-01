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
import { Play, Upload } from "lucide-react";
import { useState } from "react";

interface DataInputModalProps {
  onRunOutput: (data: any[]) => void;
}

export function DataInputModal({ onRunOutput }: DataInputModalProps) {
  const [inputText, setInputText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleRun = () => {
    try {
      setError(null);
      const parsedData = parseRawDataInput(inputText);
      onRunOutput(parsedData);
      setOpen(false);
      setInputText(""); // clear after successful run
    } catch (err: any) {
      setError(
        "Failed to parse data. Please ensure it is valid JSON or CSV format.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="h-6 text-[11px] text-[#107C41] border-[#107C41] hover:bg-green-50 shadow-sm"
        >
          <Upload />
          Load Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#107C41] flex items-center gap-2">
            <Upload className="h-5 w-5" /> Load Test Data
          </DialogTitle>
          <DialogDescription>
            Paste your raw data in JSON sequence or basic CSV format to test the
            template output.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <Textarea
            placeholder={'[\n  { "ID": 1, "First Name": "John" }\n]'}
            className="min-h-[180px] max-h-[400px] overflow-auto font-mono text-xs border-slate-300 focus-visible:ring-[#107C41]"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="text-slate-500">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleRun}
            className="bg-[#107C41] hover:bg-[#0c6132] text-white"
          >
            <Play className="mr-1.5 h-4 w-4" /> Run Output
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
