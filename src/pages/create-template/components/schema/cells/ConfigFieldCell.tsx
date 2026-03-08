import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import type { CreateTemplateFormValues } from "@/validations/create-template.validation";
import { useFormContext } from "react-hook-form";

interface ConfigFieldCellProps {
  index: number;
  field: "formatting" | "validation";
  placeholder: string;
}

export function ConfigFieldCell({
  index,
  field,
  placeholder,
}: ConfigFieldCellProps) {
  const { control } = useFormContext<CreateTemplateFormValues>();

  return (
    <TableCell className="relative py-0 align-middle border-r border-slate-200 bg-white focus-within:z-20 focus-within:outline-2 focus-within:outline-[#107C41] focus-within:-outline-offset-2">
      <FormField
        control={control}
        name={`columns.${index}.${field}`}
        render={({ field: formField }) => (
          <FormItem className="space-y-0">
            <FormControl>
              <Input
                {...formField}
                value={formField.value || ""}
                placeholder={placeholder}
                className="h-full w-full border-0 bg-transparent text-slate-800 focus-visible:ring-0 shadow-none placeholder:text-slate-300 rounded-none"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </TableCell>
  );
}
