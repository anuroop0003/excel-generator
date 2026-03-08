import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Template } from "@/lib/templates-store";
import { Calendar, Edit2, FileSpreadsheet, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TemplateRowProps {
  template: Template;
  onDelete: (id: string) => void;
}

export function TemplateRow({ template, onDelete }: TemplateRowProps) {
  const navigate = useNavigate();

  return (
    <TableRow
      key={template.id}
      className="hover:bg-slate-50/80 transition-colors group"
    >
      <TableCell className="font-medium pl-6 text-slate-800">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="size-4 text-[#107C41] opacity-60 group-hover:opacity-100 transition-opacity" />
          {template.name}
        </div>
      </TableCell>
      <TableCell className="text-slate-600">
        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-slate-200">
          {template.columns.length} Fields
        </span>
      </TableCell>
      <TableCell className="text-slate-500 text-xs">
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3" />
          {new Date(template.lastModified).toLocaleDateString()}
        </div>
      </TableCell>
      <TableCell className="text-right pr-6">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon-xs"
            title="Edit Template"
            onClick={() => navigate(`/edit-template/${template.id}`)}
            className="size-8 text-slate-600 hover:text-[#107C41] hover:bg-green-50 rounded-md cursor-pointer"
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            title="Delete Template"
            onClick={() => onDelete(template.id)}
            className="size-8 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
