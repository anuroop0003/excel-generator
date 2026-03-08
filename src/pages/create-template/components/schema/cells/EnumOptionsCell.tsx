import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import type { CreateTemplateFormValues } from "@/validations/create-template.validation";
import { useFormContext } from "react-hook-form";

interface EnumOptionsCellProps {
  index: number;
}

export function EnumOptionsCell({ index }: EnumOptionsCellProps) {
  const { control } = useFormContext<CreateTemplateFormValues>();

  return (
    <TableCell
      colSpan={3}
      className="relative py-0 align-middle border-r border-slate-200 bg-white focus-within:z-20 focus-within:outline-2 focus-within:outline-[#107C41] focus-within:-outline-offset-2"
    >
      <FormField
        control={control}
        name={`columns.${index}.options`}
        render={({ field }) => (
          <FormItem className="space-y-0">
            <FormControl>
              <Input
                value={(field.value || [])
                  .map((opt: any) => opt.label)
                  .join(", ")}
                onChange={(e) => {
                  const val = e.target.value;
                  const options = val
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((s) => ({ value: s, label: s }));
                  field.onChange(options);
                }}
                className="h-full w-full border-0 bg-transparent text-[11px] text-slate-800 focus-visible:ring-0 shadow-none placeholder:text-slate-300 rounded-none italic"
                placeholder="Option A, Option B..."
              />
            </FormControl>
          </FormItem>
        )}
      />
    </TableCell>
  );
}
