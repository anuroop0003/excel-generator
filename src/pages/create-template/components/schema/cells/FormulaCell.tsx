import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { TableCell } from "@/components/ui/table";
import type { CreateTemplateFormValues } from "@/validations/create-template.validation";
import { useFormContext, useWatch } from "react-hook-form";
import { FormulaInput } from "../../common/FormulaInput";

interface FormulaCellProps {
  index: number;
}

export function FormulaCell({ index }: FormulaCellProps) {
  const { control, setValue } = useFormContext<CreateTemplateFormValues>();
  const isFormula = useWatch({
    control,
    name: `columns.${index}.isFormula`,
  });

  return (
    <TableCell className="relative py-0 align-middle border-r border-slate-200 bg-slate-50/30 focus-within:z-20 focus-within:outline-2 focus-within:outline-[#107C41] focus-within:-outline-offset-2">
      <FormField
        control={control}
        name={`columns.${index}.formula`}
        render={({ field }) => (
          <FormItem className="space-y-0">
            <FormControl>
              <FormulaInput
                value={field.value || ""}
                onChange={(val: string) => {
                  field.onChange(val);
                  if (val && !isFormula) {
                    setValue(`columns.${index}.isFormula`, true);
                  }
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </TableCell>
  );
}
