import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet, Save } from "lucide-react";

interface TopHeaderProps {
  templateName: string;
  setTemplateName: (name: string) => void;
  onPublish?: () => void;
}

export function TopHeader({
  templateName,
  setTemplateName,
  onPublish,
}: TopHeaderProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-slate-300 bg-slate-50 px-4 z-10 w-full">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded bg-[#107C41] text-white shadow-sm border border-[#0d6635]">
          <FileSpreadsheet className="size-4" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold tracking-tight text-slate-800">
            Excel Builder
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full max-w-sm justify-end">
        <Input
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          className="h-7 w-full max-w-[200px] bg-white border-slate-300 text-[13px] font-medium px-2 py-0 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-green-600 focus-visible:ring-offset-0 transition-all shadow-sm"
          placeholder="Template Name..."
        />
        <div className="h-4 w-[1px] bg-slate-300"></div>
        <Button
          size="sm"
          onClick={onPublish}
          className="h-7 bg-[#107C41] hover:bg-[#0c6132] text-white font-medium text-xs shadow-sm transition-all"
        >
          <Save className="mr-1.5 size-3.5" /> Publish
        </Button>
      </div>
    </header>
  );
}
