import { TableCell } from "@/components/ui/table";
import { GripVertical } from "lucide-react";

export function DragHandleCell({ attributes, listeners }: any) {
  return (
    <TableCell className="w-8 p-0 align-middle bg-slate-50 border-r border-slate-200">
      <div
        {...attributes}
        {...listeners}
        className="flex h-full w-full items-center justify-center text-slate-400 cursor-grab active:cursor-grabbing hover:text-slate-600 outline-none"
      >
        <GripVertical className="size-3.5" />
      </div>
    </TableCell>
  );
}
