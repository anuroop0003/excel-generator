import { TableCell } from "@/components/ui/table";
import type { ExcelColumn } from "../../types";
import { FormulaInput } from "../FormulaInput";

interface FormulaCellProps {
  id: string;
  formula: string | undefined;
  isFormula: boolean | undefined;
  onUpdate: <K extends keyof ExcelColumn>(
    id: string,
    field: K,
    value: ExcelColumn[K],
  ) => void;
}

export function FormulaCell({
  id,
  formula,
  isFormula,
  onUpdate,
}: FormulaCellProps) {
  return (
    <TableCell className="relative p-0 align-middle border-r border-slate-200 bg-slate-50/30 focus-within:z-20 focus-within:ring-2 focus-within:ring-inset focus-within:ring-[#107C41]">
      <FormulaInput
        value={formula || ""}
        onChange={(val) => {
          onUpdate(id, "formula", val);
          if (val && !isFormula) {
            onUpdate(id, "isFormula", true);
          }
        }}
      />
    </TableCell>
  );
}
