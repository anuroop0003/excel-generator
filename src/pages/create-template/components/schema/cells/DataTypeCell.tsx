import { FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell } from "@/components/ui/table";
import type { CreateTemplateFormValues } from "@/validations/create-template.validation";
import { Calendar, Hash, List, ToggleLeft, Type } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface DataTypeCellProps {
  index: number;
}

export function DataTypeCell({ index }: DataTypeCellProps) {
  const { control, setValue, getValues } =
    useFormContext<CreateTemplateFormValues>();

  return (
    <TableCell className="relative py-0 align-middle border-r border-slate-200 bg-white w-[110px] focus-within:z-20 focus-within:outline-2 focus-within:outline-[#107C41] focus-within:-outline-offset-2">
      <FormField
        control={control}
        name={`columns.${index}.type`}
        render={({ field }) => (
          <FormItem className="space-y-0">
            <Select
              onValueChange={(val) => {
                field.onChange(val);
                // Cleanup logic when changing types
                if (val === "Enum") {
                  const currentOptions = getValues(`columns.${index}.options`);
                  if (!currentOptions || currentOptions.length === 0) {
                    setValue(`columns.${index}.options`, [
                      { value: "Option 1", label: "Option 1" },
                      { value: "Option 2", label: "Option 2" },
                    ]);
                  }
                }
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="h-full w-full border-0 bg-transparent hover:bg-slate-50 focus:ring-0 shadow-none text-xs font-medium text-slate-700 px-2 py-0 rounded-none">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="shadow-md border-slate-300 text-xs text-slate-700">
                <SelectItem value="String" className="text-xs py-1">
                  <div className="flex items-center gap-2">
                    <Type className="size-3 text-slate-400" /> Text
                  </div>
                </SelectItem>
                <SelectItem value="Number" className="text-xs py-1">
                  <div className="flex items-center gap-2">
                    <Hash className="size-3 text-slate-400" /> Number
                  </div>
                </SelectItem>
                <SelectItem value="Date" className="text-xs py-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-3 text-slate-400" /> Date
                  </div>
                </SelectItem>
                <SelectItem value="Boolean" className="text-xs py-1">
                  <div className="flex items-center gap-2">
                    <ToggleLeft className="size-3 text-slate-400" /> Boolean
                  </div>
                </SelectItem>
                <SelectItem value="Enum" className="text-xs py-1">
                  <div className="flex items-center gap-2">
                    <List className="size-3 text-slate-400" /> Enum
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </TableCell>
  );
}
