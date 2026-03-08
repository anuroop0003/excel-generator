import type { Template } from "@/lib/templates-store";
import { deleteTemplate, getTemplates } from "@/lib/templates-store";
import { useEffect, useState } from "react";
import { EmptyState } from "./components/EmptyState";
import { ListingHeader } from "./components/ListingHeader";
import { PageHeader } from "./components/PageHeader";
import { TemplatesTable } from "./components/TemplatesTable";

export default function ListingPage() {
  const [templates, setTemplates] = useState<Template[]>([]);

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
      <ListingHeader />

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <PageHeader />

        {templates.length === 0 ? (
          <EmptyState />
        ) : (
          <TemplatesTable templates={templates} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}
