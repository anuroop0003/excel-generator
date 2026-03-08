import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TableCell } from "@/components/ui/table";
import { getColumnLetter } from "@/lib/utils";
import type { CreateTemplateFormValues } from "@/validations/create-template.validation";
import { useFormContext } from "react-hook-form";

interface FieldNameCellProps {
  index: number;
}

export function FieldNameCell({ index }: FieldNameCellProps) {
  const { control } = useFormContext<CreateTemplateFormValues>();

  return (
    <TableCell className="relative py-0 align-middle border-r border-slate-200 focus-within:z-20 focus-within:outline-2 focus-within:outline-[#107C41] focus-within:-outline-offset-2">
      <div className="flex items-center h-full">
        <div className="flex h-full w-6 shrink-0 items-center justify-center bg-slate-50 border-r border-slate-200 text-[10px] font-bold text-slate-400 select-none">
          {getColumnLetter(index)}
        </div>
        <FormField
          control={control}
          name={`columns.${index}.name`}
          render={({ field }) => (
            <FormItem className="w-full space-y-0">
              <FormControl>
                <Input
                  {...field}
                  className="h-full w-full border-0 bg-transparent px-2 text-[11px] font-medium text-slate-800 focus-visible:ring-0 shadow-none rounded-none"
                  placeholder="Field name..."
                />
              </FormControl>
              <FormMessage className="text-[10px] absolute -bottom-4 left-6" />
            </FormItem>
          )}
        />
      </div>
    </TableCell>
  );
}
