import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getTemplateById, saveTemplate } from "@/lib/templates-store";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TopHeader } from "./components/header/TopHeader";
import { DataPreview } from "./components/preview/DataPreview";
import { SchemaEditor } from "./components/schema/SchemaEditor";
import type { ExcelColumn } from "./types";

const DEFAULT_COLUMNS: ExcelColumn[] = [
  { id: "1", name: "ID", type: "Number" },
  { id: "2", name: "First Name", type: "String" },
  { id: "3", name: "Last Name", type: "String" },
  {
    id: "4",
    name: "Full Name",
    type: "String",
    isFormula: true,
    formula: '=CONCAT(A, " ", B)',
  },
];

export function CreateTemplatePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const templateIdRef = useRef(id || crypto.randomUUID());

  const [editingColumns, setEditingColumns] =
    useState<ExcelColumn[]>(DEFAULT_COLUMNS);
  const [previewColumns, setPreviewColumns] =
    useState<ExcelColumn[]>(DEFAULT_COLUMNS);
  const [templateName, setTemplateName] = useState("Sales Roster Template");
  const [sampleData, setSampleData] = useState<any[]>(
    Array.from({ length: 40 }, () => ({})),
  );

  useEffect(() => {
    if (id) {
      const existing = getTemplateById(id);
      if (existing) {
        setEditingColumns(existing.columns);
        setPreviewColumns(existing.columns);
        setTemplateName(existing.name);
        templateIdRef.current = existing.id;
      }
    }
  }, [id]);

  const handleSaveTemplate = () => {
    saveTemplate({
      id: templateIdRef.current,
      name: templateName,
      columns: editingColumns,
      lastModified: Date.now(),
    });
    navigate("/");
  };

  const handleUpdatePreview = () => {
    setPreviewColumns([...editingColumns]);
  };

  const handleUpdateCell = (rowIndex: number, field: string, value: any) => {
    setSampleData((prev) => {
      const next = [...prev];
      if (!next[rowIndex]) {
        next[rowIndex] = {};
      }
      next[rowIndex] = { ...next[rowIndex], [field]: value };
      return next;
    });
  };

  const handleAddColumn = () => {
    const newCol: ExcelColumn = {
      id: crypto.randomUUID(),
      name: `Field_${editingColumns.length + 1}`,
      type: "String",
    };
    setEditingColumns([...editingColumns, newCol]);
  };

  const handleRemoveColumn = (id: string) => {
    setEditingColumns(editingColumns.filter((col) => col.id !== id));
  };

  const handleReorderColumn = (activeId: string, overId: string) => {
    setEditingColumns((items) => {
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === overId);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleUpdateColumn = <K extends keyof ExcelColumn>(
    id: string,
    field: K,
    value: ExcelColumn[K],
  ) => {
    setEditingColumns(
      editingColumns.map((col) => {
        if (col.id === id) {
          const updated = { ...col, [field]: value };

          // Cleanup logic when changing types
          if (field === "type") {
            if (value === "Enum" && !updated.options) {
              updated.options = [
                { value: "Option 1", label: "Option 1" },
                { value: "Option 2", label: "Option 2" },
              ];
            }
          }

          return updated;
        }
        return col;
      }),
    );
  };

  return (
    <div className="flex h-screen w-full flex-col bg-white font-sans antialiased text-slate-900 overflow-hidden selection:bg-green-100 selection:text-green-900">
      <TopHeader
        templateName={templateName}
        setTemplateName={setTemplateName}
        onPublish={handleSaveTemplate}
      />

      {/* MAIN WORKSPACE - EDGE TO EDGE */}
      <div className="flex-1 overflow-hidden w-full bg-slate-100">
        <ResizablePanelGroup orientation="vertical" className="h-full w-full">
          {/* TOP PANEL: TABLE PREVIEW */}
          <ResizablePanel
            defaultSize={50}
            minSize={20}
            className="flex flex-col bg-white"
          >
            <DataPreview
              columns={previewColumns}
              sampleData={sampleData}
              onLoadData={(data) => setSampleData(data)}
              onUpdateCell={handleUpdateCell}
              templateName={templateName}
            />
          </ResizablePanel>

          {/* SPREADSHEET DIVIDER */}
          <ResizableHandle
            withHandle
            className="bg-slate-300 hover:bg-[#107C41] transition-colors w-full h-[6px] data-[state=dragging]:bg-[#107C41] relative flex items-center justify-center"
          >
            <div className="h-1 w-8 bg-slate-400 rounded-full opacity-50 absolute"></div>
          </ResizableHandle>

          {/* BOTTOM PANEL: COLUMN BUILDER / SCHEMA DEFINITION */}
          <ResizablePanel
            defaultSize={50}
            minSize={20}
            className="flex flex-col bg-slate-50"
          >
            <SchemaEditor
              columns={editingColumns}
              handleAddColumn={handleAddColumn}
              handleRemoveColumn={handleRemoveColumn}
              handleReorderColumn={handleReorderColumn}
              handleUpdateColumn={handleUpdateColumn}
              onUpdatePreview={handleUpdatePreview}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
