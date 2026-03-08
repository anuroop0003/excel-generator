import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { CreateTemplateFormValues } from "@/validations/create-template.validation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useFormContext, useWatch } from "react-hook-form";
import { ActionsCell } from "./cells/ActionsCell";
import { ConfigFieldCell } from "./cells/ConfigFieldCell";
import { DataTypeCell } from "./cells/DataTypeCell";
import { DragHandleCell } from "./cells/DragHandleCell";
import { EnumOptionsCell } from "./cells/EnumOptionsCell";
import { FieldNameCell } from "./cells/FieldNameCell";
import { FormulaCell } from "./cells/FormulaCell";

interface SchemaRowProps {
  index: number;
  onRemove: () => void;
}

export function SchemaRow({ index, onRemove }: SchemaRowProps) {
  const { control } = useFormContext<CreateTemplateFormValues>();
  const column = useWatch({
    control,
    name: `columns.${index}`,
  });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 9999, position: "relative" as any } : {}),
  };

  if (!column) return null;

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        "group border-b border-slate-200 hover:bg-slate-50 h-7 focus-within:z-50 hover:z-50",
        isDragging ? "opacity-30 bg-slate-100" : "",
      )}
    >
      <DragHandleCell attributes={attributes} listeners={listeners} />
      <FieldNameCell index={index} />
      <DataTypeCell index={index} />

      {column.type === "Enum" ? (
        <EnumOptionsCell index={index} />
      ) : (
        <>
          <ConfigFieldCell
            index={index}
            field="formatting"
            placeholder="e.g. DD/MM/YYYY"
          />
          <ConfigFieldCell
            index={index}
            field="validation"
            placeholder="Rule..."
          />
          <FormulaCell index={index} />
        </>
      )}

      <ActionsCell name={column.name} onRemove={onRemove} />
    </TableRow>
  );
}
