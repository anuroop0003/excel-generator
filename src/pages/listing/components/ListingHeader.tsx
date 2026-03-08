import { Button } from "@/components/ui/button";
import { FileSpreadsheet, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ListingHeader() {
  const navigate = useNavigate();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-300 bg-white px-6 z-10 w-full shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#107C41] text-white shadow-sm border border-[#0d6635]">
          <FileSpreadsheet className="size-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-[#107C41]">
          Excel Template Manager
        </span>
      </div>
      <Button
        size="sm"
        onClick={() => navigate("/create-template")}
        className="bg-[#107C41] hover:bg-[#0c6132] text-white font-semibold shadow-sm transition-all cursor-pointer"
      >
        <Plus className="mr-2 h-4 w-4" /> Create New Template
      </Button>
    </header>
  );
}
