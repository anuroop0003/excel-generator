import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { LayoutTemplate, Plus } from "lucide-react";
import type { ExcelColumn } from "../types";
import { SchemaRow } from "./SchemaRow";

interface SchemaEditorProps {
  columns: ExcelColumn[];
  handleAddColumn: () => void;
  handleRemoveColumn: (id: string) => void;
  handleReorderColumn: (activeId: string, overId: string) => void;
  handleUpdateColumn: <K extends keyof ExcelColumn>(
    id: string,
    field: K,
    value: ExcelColumn[K],
  ) => void;
}

export function SchemaEditor({
  columns,
  handleAddColumn,
  handleRemoveColumn,
  handleReorderColumn,
  handleUpdateColumn,
}: SchemaEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      handleReorderColumn(active.id.toString(), over.id.toString());
    }
  }

  return (
    <>
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-300 bg-slate-200 px-3">
        <div className="flex items-center gap-1.5">
          <LayoutTemplate className="size-3.5 text-[#107C41]" />
          <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Schema Editor
          </h2>
        </div>
        <Button
          size="sm"
          onClick={handleAddColumn}
          variant="ghost"
          className="h-6 text-[11px] text-slate-700 hover:bg-slate-300 py-0 border border-transparent hover:border-slate-400 cursor-pointer"
        >
          <Plus />
          Add Column
        </Button>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        {columns.length === 0 ? (
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
                    Default Value
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
                  items={columns.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {columns.map((col) => (
                    <SchemaRow
                      key={col.id}
                      col={col}
                      handleRemoveColumn={handleRemoveColumn}
                      handleUpdateColumn={handleUpdateColumn}
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
