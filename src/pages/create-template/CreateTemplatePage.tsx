import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { getTemplateById, saveTemplate } from "@/lib/templates-store";
import {
  createTemplateSchema,
  type CreateTemplateFormValues,
} from "@/validations/create-template.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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

  const methods = useForm<CreateTemplateFormValues>({
    resolver: zodResolver(createTemplateSchema),
    defaultValues: {
      id: id || crypto.randomUUID(),
      templateName: "Sales Roster Template",
      columns: DEFAULT_COLUMNS,
    },
  });

  const { reset, watch, getValues } = methods;

  const [previewColumns, setPreviewColumns] =
    useState<ExcelColumn[]>(DEFAULT_COLUMNS);
  const [sampleData, setSampleData] = useState<any[]>(
    Array.from({ length: 40 }, () => ({})),
  );

  useEffect(() => {
    if (id) {
      const existing = getTemplateById(id);
      if (existing) {
        reset({
          id: existing.id,
          templateName: existing.name,
          columns: existing.columns as any,
        });
        setPreviewColumns(existing.columns);
      }
    }
  }, [id, reset]);

  const handleSaveTemplate = () => {
    const values = getValues();
    saveTemplate({
      id: values.id,
      name: values.templateName,
      columns: values.columns as ExcelColumn[],
      lastModified: Date.now(),
    });
    navigate("/");
  };

  const handleUpdatePreview = () => {
    setPreviewColumns([...getValues().columns] as ExcelColumn[]);
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

  const templateName = watch("templateName");

  return (
    <FormProvider {...methods}>
      <div className="flex h-screen w-full flex-col bg-white font-sans antialiased text-slate-900 overflow-hidden selection:bg-green-100 selection:text-green-900">
        <TopHeader onPublish={handleSaveTemplate} />

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
              <SchemaEditor onUpdatePreview={handleUpdatePreview} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </FormProvider>
  );
}
