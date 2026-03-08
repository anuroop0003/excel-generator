import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { CreateTemplateFormValues } from "@/validations/create-template.validation";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { LayoutTemplate, Plus, RefreshCcw } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { SchemaRow } from "./SchemaRow";

interface SchemaEditorProps {
  onUpdatePreview: () => void;
}

export function SchemaEditor({ onUpdatePreview }: SchemaEditorProps) {
  const { control } = useFormContext<CreateTemplateFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "columns",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  }

  const handleAddColumn = () => {
    append({
      id: crypto.randomUUID(),
      name: `Field_${fields.length + 1}`,
      type: "String",
    });
  };

  return (
    <>
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-300 bg-slate-200 px-3">
        <div className="flex items-center gap-1.5">
          <LayoutTemplate className="size-3.5 text-[#107C41]" />
          <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Schema Editor
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onUpdatePreview}
            variant="ghost"
            className="h-6 text-[11px] text-[#107C41] hover:bg-green-50 font-semibold py-0 border border-green-200 hover:border-green-300 cursor-pointer gap-1.5"
          >
            <RefreshCcw className="size-3" />
            Update Preview
          </Button>
          <Button
            size="sm"
            onClick={handleAddColumn}
            variant="ghost"
            className="h-6 text-[11px] text-slate-700 hover:bg-slate-300 py-0 border border-transparent hover:border-slate-400 cursor-pointer gap-1"
          >
            <Plus className="size-3" />
            Add Column
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        {fields.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-slate-400">No fields defined.</span>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table className="w-full border-collapse">
              <TableHeader className="sticky top-0 z-10 bg-slate-100 shadow-[0_1px_0_0_#cbd5e1]">
                <TableRow className="border-none hover:bg-slate-100">
                  <TableHead className="w-8 h-7 p-0 bg-slate-200 border-r border-slate-300"></TableHead>
                  <TableHead className="h-7 px-2 text-[11px] font-semibold text-slate-600 border-r border-slate-300 w-[15%] py-0 align-middle">
                    Field Name
                  </TableHead>
                  <TableHead className="h-7 px-2 text-[11px] font-semibold text-slate-600 border-r border-slate-300 w-[110px] py-0 align-middle">
                    Data Type
                  </TableHead>
                  <TableHead className="h-7 px-2 text-[11px] font-semibold text-slate-600 border-r border-slate-300 w-[12%] py-0 align-middle">
                    Format
                  </TableHead>
                  <TableHead className="h-7 px-2 text-[11px] font-semibold text-slate-600 border-r border-slate-300 w-[12%] py-0 align-middle">
                    Validation
                  </TableHead>
                  <TableHead className="h-7 px-2 text-[11px] font-semibold text-slate-600 border-r border-slate-300 py-0 align-middle">
                    Function
                  </TableHead>
                  <TableHead className="w-8 h-7 p-0 text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <SortableContext
                  items={fields.map((f) => f.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {fields.map((field, index) => (
                    <SchemaRow
                      key={field.id}
                      index={index}
                      onRemove={() => remove(index)}
                    />
                  ))}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        )}
      </div>
    </>
  );
}
