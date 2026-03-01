import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";

import { DataPreview } from "./components/DataPreview";
import { SchemaEditor } from "./components/SchemaEditor";
import { TopHeader } from "./components/TopHeader";
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
    formula: '=CONCAT(A2, " ", B2)',
  },
];

export function CreateTemplatePage() {
  const [columns, setColumns] = useState<ExcelColumn[]>(DEFAULT_COLUMNS);
  const [templateName, setTemplateName] = useState("Sales Roster Template");
  const [sampleData, setSampleData] = useState<any[]>([]);

  const handleAddColumn = () => {
    const newCol: ExcelColumn = {
      id: crypto.randomUUID(),
      name: `Field_${columns.length + 1}`,
      type: "String",
    };
    setColumns([...columns, newCol]);
  };

  const handleRemoveColumn = (id: string) => {
    setColumns(columns.filter((col) => col.id !== id));
  };

  const handleReorderColumn = (activeId: string, overId: string) => {
    setColumns((items) => {
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
    setColumns(
      columns.map((col) => {
        if (col.id === id) {
          const updated = { ...col, [field]: value };

          // Cleanup logic when changing types
          if (field === "type") {
            if (value === "Enum" && !updated.options) {
              updated.options = "Option 1, Option 2";
            }
          }

          // Cleanup when toggling formula
          if (field === "isFormula" && !value) {
            // We keep the formula string around in case they toggle it back immediately,
            // but you could add logic here to clear it if desired: `updated.formula = ""`
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
              columns={columns}
              sampleData={sampleData}
              onLoadData={(data) => setSampleData(data)}
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
              columns={columns}
              handleAddColumn={handleAddColumn}
              handleRemoveColumn={handleRemoveColumn}
              handleReorderColumn={handleReorderColumn}
              handleUpdateColumn={handleUpdateColumn}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
