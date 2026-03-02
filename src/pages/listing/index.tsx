import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Template } from "@/lib/templates-store";
import { deleteTemplate, getTemplates } from "@/lib/templates-store";
import {
  Calendar,
  Edit2,
  FileSpreadsheet,
  FileType,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ListingPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTemplates(getTemplates());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteTemplate(id);
      setTemplates(getTemplates());
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
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
          <Plus /> Create New Template
        </Button>
      </header>

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Your Templates
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage and edit your custom Excel data structures.
            </p>
          </div>
        </div>

        {templates.length === 0 ? (
          <Card className="border-dashed border-2 bg-white/50 border-slate-300">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <FileType className="size-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700">
                No templates found
              </h3>
              <p className="text-slate-500 mb-6">
                Create your first template to start generating Excel files.
              </p>
              <Button
                size="sm"
                onClick={() => navigate("/create-template")}
                variant="outline"
                className="border-[#107C41] text-[#107C41] hover:bg-green-100 hover:text-[#107C41] cursor-pointer"
              >
                <Plus /> Create Now
              </Button>
            </CardContent>
          </Card>
        ) : (
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
                            onClick={() =>
                              navigate(`/edit-template/${template.id}`)
                            }
                            className="size-8 text-slate-600 hover:text-[#107C41] hover:bg-green-50 rounded-md cursor-pointer"
                          >
                            <Edit2 />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            title="Delete Template"
                            onClick={() => handleDelete(template.id)}
                            className="size-8 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
}
