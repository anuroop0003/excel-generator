import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, FileSpreadsheet, Save } from "lucide-react";
import { Link } from "react-router-dom";

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
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-slate-300 bg-slate-50 px-4 z-10 w-full shadow-sm">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="text-slate-500 hover:text-[#107C41] transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
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
      </div>

      <div className="flex items-center gap-3 w-full max-w-sm justify-end">
        <div className="relative group flex-1 max-w-[200px]">
          <Input
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            className="h-7 w-full bg-white border-slate-300 text-[13px] font-medium px-2 py-0 placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-green-600 focus-visible:ring-offset-0 transition-all shadow-sm"
            placeholder="Template Name..."
          />
        </div>
        <div className="h-4 w-[1px] bg-slate-300"></div>
        <Button
          size="sm"
          onClick={onPublish}
          className="h-7 bg-[#107C41] hover:bg-[#0c6132] text-white font-medium text-xs shadow-sm transition-all cursor-pointer"
        >
          <Save className="size-3.5" /> Save Template
        </Button>
      </div>
    </header>
  );
}
