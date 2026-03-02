import { TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ExcelColumn } from "../types";
import { ActionsCell } from "./schema-row/ActionsCell";
import { ConfigFieldCell } from "./schema-row/ConfigFieldCell";
import { DataTypeCell } from "./schema-row/DataTypeCell";
import { DragHandleCell } from "./schema-row/DragHandleCell";
import { EnumOptionsCell } from "./schema-row/EnumOptionsCell";
import { FieldNameCell } from "./schema-row/FieldNameCell";
import { FormulaCell } from "./schema-row/FormulaCell";

interface SchemaRowProps {
  col: ExcelColumn;
  handleRemoveColumn: (id: string) => void;
  handleUpdateColumn: <K extends keyof ExcelColumn>(
    id: string,
    field: K,
    value: ExcelColumn[K],
  ) => void;
}

export function SchemaRow({
  col,
  handleRemoveColumn,
  handleUpdateColumn,
}: SchemaRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: col.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 9999, position: "relative" as any } : {}),
  };

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
      <FieldNameCell
        id={col.id}
        name={col.name}
        onUpdate={handleUpdateColumn}
      />
      <DataTypeCell id={col.id} type={col.type} onUpdate={handleUpdateColumn} />

      {col.type === "Enum" ? (
        <EnumOptionsCell
          id={col.id}
          options={col.options}
          onUpdate={handleUpdateColumn}
        />
      ) : (
        <>
          <ConfigFieldCell
            id={col.id}
            field="defaultValue"
            value={col.defaultValue}
            placeholder="Default Value"
            onUpdate={handleUpdateColumn}
          />
          <ConfigFieldCell
            id={col.id}
            field="formatting"
            value={col.formatting}
            placeholder="e.g. DD/MM/YYYY"
            onUpdate={handleUpdateColumn}
          />
          <ConfigFieldCell
            id={col.id}
            field="validation"
            value={col.validation}
            placeholder="Rule..."
            onUpdate={handleUpdateColumn}
          />
          <FormulaCell
            id={col.id}
            formula={col.formula}
            isFormula={col.isFormula}
            onUpdate={handleUpdateColumn}
          />
        </>
      )}

      <ActionsCell id={col.id} name={col.name} onRemove={handleRemoveColumn} />
    </TableRow>
  );
}
