import { FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";

export function AuthHeader() {
  return (
    <Link to="/" className="flex items-center gap-3 mb-8 group transition-all">
      <div className="flex h-10 w-10 items-center justify-center rounded bg-[#107C41] text-white shadow-sm border border-[#0d6635] group-hover:scale-105 transition-transform">
        <FileSpreadsheet className="size-6" />
      </div>
      <span className="text-2xl font-bold tracking-tight text-[#107C41]">
        Excel Builder
      </span>
    </Link>
  );
}
