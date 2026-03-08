import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Template } from "@/lib/templates-store";
import { TemplateRow } from "./TemplateRow";

interface TemplatesTableProps {
  templates: Template[];
  onDelete: (id: string) => void;
}

export function TemplatesTable({ templates, onDelete }: TemplatesTableProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[40%] pl-6">Template Name</TableHead>
            <TableHead>Fields</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead className="text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates
            .sort((a, b) => b.lastModified - a.lastModified)
            .map((template) => (
              <TemplateRow
                key={template.id}
                template={template}
                onDelete={onDelete}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
