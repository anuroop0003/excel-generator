import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  GripVertical,
  Hash,
  LayoutTemplate,
  List,
  Plus,
  ToggleLeft,
  Trash2,
  Type,
} from "lucide-react";
import { useState } from "react";
import type { ColumnType, ExcelColumn } from "../types";

const FORMULA_FUNCTIONS = [
  { name: "CONCAT", desc: "Joins multiple text strings into one" },
  { name: "SUM", desc: "Adds all the numbers in a range" },
  { name: "AVERAGE", desc: "Returns the average of its arguments" },
  { name: "IF", desc: "Conditional logic" },
  { name: "AND", desc: "Checks whether all arguments are true" },
  { name: "OR", desc: "Checks whether any argument is true" },
  { name: "LOWER", desc: "Converts text to lowercase" },
  { name: "UPPER", desc: "Converts text to uppercase" },
  { name: "PROPER", desc: "Capitalizes the first letter in each word" },
];

function FormulaInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  // Extract the word being typed after an "=" or after a non-word character
  const match = value.match(/([A-Za-z]+)$/);
  const search = match ? match[1].toUpperCase() : "";

  const suggestions = value.startsWith("=")
    ? FORMULA_FUNCTIONS.filter((f) => f.name.startsWith(search))
    : [];

  const showSuggestions =
    focused && value.startsWith("=") && suggestions.length > 0;

  const handleSelect = (funcName: string) => {
    if (search) {
      onChange(value.slice(0, -search.length) + funcName + "(");
    } else {
      onChange(value + funcName + "(");
    }
  };

  return (
    <Popover open={showSuggestions}>
      <PopoverAnchor asChild>
        <div className="relative flex items-center flex-1 h-full w-full">
          <span className="absolute left-2 text-[11px] font-mono font-bold text-green-700 pointer-events-none">
            ƒx
          </span>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="=SUM(A, B)"
            className="h-full w-full font-mono text-[11px] pl-6 border-0 bg-transparent focus:bg-white focus:ring-inset focus:ring-2 focus:ring-[#107C41] shadow-none placeholder:text-slate-300 text-green-900"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[250px] p-1 border-slate-200 shadow-xl z-[100] max-h-[180px] overflow-auto"
        align="start"
      >
        {suggestions.map((s) => (
          <div
            key={s.name}
            className="px-2 py-1.5 hover:bg-slate-100 cursor-pointer flex flex-col rounded-sm"
            onMouseDown={(e) => {
              e.preventDefault();
              handleSelect(s.name);
            }}
          >
            <div className="text-[11px] font-mono font-bold text-green-800">
              {s.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate">{s.desc}</div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}

interface SchemaEditorProps {
  columns: ExcelColumn[];
  handleAddColumn: () => void;
  handleRemoveColumn: (id: string) => void;
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
  handleUpdateColumn,
}: SchemaEditorProps) {
  return (
    <>
      <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-300 bg-slate-200 px-3">
        <div className="flex items-center gap-1.5">
          <LayoutTemplate className="h-3.5 w-3.5 text-[#107C41]" />
          <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
            Schema Editor
          </h2>
        </div>
        <Button
          size="sm"
          onClick={handleAddColumn}
          variant="ghost"
          className="h-6 text-[11px] text-slate-700 hover:bg-slate-300 px-2 py-0 border border-transparent hover:border-slate-400 rounded-sm"
        >
          <Plus /> Add Field
        </Button>
      </div>

      <div className="flex-1 overflow-auto bg-white">
        {columns.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-slate-400">No fields defined.</span>
          </div>
        ) : (
          <Table className="w-full border-collapse">
            <TableHeader className="sticky top-0 z-10 bg-slate-100 shadow-[0_1px_0_0_#cbd5e1]">
              <TableRow className="border-none hover:bg-slate-100">
                <TableHead className="w-8 h-7 p-0 bg-slate-200 border-r border-slate-300"></TableHead>
                <TableHead className="h-7 px-2 text-[11px] font-semibold text-slate-600 border-r border-slate-300 w-[20%] py-0 align-middle">
                  Field Name
                </TableHead>
                <TableHead className="h-7 px-2 text-[11px] font-semibold text-slate-600 border-r border-slate-300 w-[15%] py-0 align-middle">
                  Data Type
                </TableHead>
                <TableHead className="h-7 px-2 text-[11px] font-semibold text-slate-600 border-r border-slate-300 py-0 align-middle">
                  Configuration
                </TableHead>
                <TableHead className="w-8 h-7 p-0 text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {columns.map((col) => (
                <TableRow
                  key={col.id}
                  className="group border-b border-slate-200 hover:bg-slate-50 h-7 relative focus-within:z-50 hover:z-50"
                >
                  {/* Drag Handle */}
                  <TableCell className="w-8 p-0 align-middle bg-slate-50 border-r border-slate-200">
                    <div className="flex h-full w-full items-center justify-center text-slate-300 cursor-grab active:cursor-grabbing hover:text-slate-500">
                      <GripVertical className="h-3.5 w-3.5" />
                    </div>
                  </TableCell>

                  {/* Field Name */}
                  <TableCell className="p-0 align-middle border-r border-slate-200">
                    <Input
                      value={col.name}
                      onChange={(e) =>
                        handleUpdateColumn(col.id, "name", e.target.value)
                      }
                      className="h-full w-full border-0 bg-transparent px-2 text-[11px] font-medium text-slate-800 focus:ring-inset focus:ring-2 focus:ring-[#107C41] shadow-none rounded-sm"
                      placeholder="Field name..."
                    />
                  </TableCell>

                  {/* Data Type */}
                  <TableCell className="p-0 align-middle border-r border-slate-200 bg-white">
                    <Select
                      value={col.type}
                      onValueChange={(val) =>
                        handleUpdateColumn(col.id, "type", val as ColumnType)
                      }
                    >
                      <SelectTrigger className="h-full w-full border-0 bg-transparent hover:bg-slate-50 focus:ring-inset focus:ring-2 focus:ring-[#107C41] shadow-none text-xs font-medium text-slate-700 px-2 py-0">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-sm shadow-md border-slate-300 text-xs">
                        <SelectItem value="String" className="text-xs py-1">
                          <div className="flex items-center gap-2">
                            <Type className="h-3 w-3 text-slate-400" /> Text
                          </div>
                        </SelectItem>
                        <SelectItem value="Number" className="text-xs py-1">
                          <div className="flex items-center gap-2">
                            <Hash className="h-3 w-3 text-slate-400" /> Number
                          </div>
                        </SelectItem>
                        <SelectItem value="Date" className="text-xs py-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-slate-400" /> Date
                          </div>
                        </SelectItem>
                        <SelectItem value="Boolean" className="text-xs py-1">
                          <div className="flex items-center gap-2">
                            <ToggleLeft className="h-3 w-3 text-slate-400" />{" "}
                            Boolean
                          </div>
                        </SelectItem>
                        <SelectItem value="Enum" className="text-xs py-1">
                          <div className="flex items-center gap-2">
                            <List className="h-3 w-3 text-slate-400" /> Enum
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Configuration (Dynamic based on Type) */}
                  <TableCell className="p-0 align-middle border-r border-slate-200 bg-slate-50/30">
                    <div className="flex items-center h-full w-full gap-2 px-2 overflow-visible">
                      {/* COMMON REQUIRED TOGGLE */}
                      <label
                        className="flex flex-col md:flex-row items-center gap-1 cursor-pointer shrink-0"
                        title="Required Field"
                      >
                        <input
                          type="checkbox"
                          title="Mark Required"
                          checked={col.required || false}
                          onChange={(e) =>
                            handleUpdateColumn(
                              col.id,
                              "required",
                              e.target.checked,
                            )
                          }
                          className="h-3 w-3 rounded-sm border-slate-300 text-[#107C41] focus:ring-[#107C41] cursor-pointer"
                        />
                        <span className="text-[10px] font-medium text-slate-500 select-none hidden md:inline">
                          Req
                        </span>
                      </label>

                      {/* FORMULA TOGGLE (COMPUTED FIELD) */}
                      <button
                        onClick={() =>
                          handleUpdateColumn(
                            col.id,
                            "isFormula",
                            !col.isFormula,
                          )
                        }
                        title="Toggle Formula (Computed Field)"
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                          col.isFormula
                            ? "border-green-600 bg-green-50 text-green-700"
                            : "border-slate-300 bg-slate-50 text-slate-400 hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-[10px] font-bold font-mono">
                          ƒx
                        </span>
                      </button>

                      <div className="h-4 w-[1px] bg-slate-300 opacity-50 shrink-0"></div>

                      {/* FORMULA CONFIG */}
                      {col.isFormula ? (
                        <FormulaInput
                          value={col.formula || ""}
                          onChange={(val) =>
                            handleUpdateColumn(col.id, "formula", val)
                          }
                        />
                      ) : col.type === "Enum" ? (
                        /* ENUM CONFIG */
                        <div className="flex flex-1 items-center gap-2 h-full w-full">
                          <Input
                            value={col.options || ""}
                            onChange={(e) =>
                              handleUpdateColumn(
                                col.id,
                                "options",
                                e.target.value,
                              )
                            }
                            placeholder="Comma separated options (Item1, Item2)"
                            className="h-full w-full font-mono text-[11px] px-2 border-0 bg-transparent focus:bg-white focus:ring-inset focus:ring-2 focus:ring-[#107C41] shadow-none placeholder:text-slate-300 text-slate-800"
                          />
                        </div>
                      ) : (
                        /* STANDARD FIELDS CONFIG */
                        <div className="flex flex-1 items-center gap-1.5 h-full py-1">
                          <Input
                            value={col.defaultValue || ""}
                            onChange={(e) =>
                              handleUpdateColumn(
                                col.id,
                                "defaultValue",
                                e.target.value,
                              )
                            }
                            placeholder="Default Val"
                            title="Default fall-back value"
                            className="h-full w-[80px] lg:w-[100px] text-[11px] border border-slate-200 bg-white focus:bg-white focus:ring-1 focus:ring-[#107C41] shadow-none placeholder:text-slate-300 text-slate-800 px-1.5 rounded-sm shrink-0"
                          />
                          <Input
                            value={col.formatting || ""}
                            onChange={(e) =>
                              handleUpdateColumn(
                                col.id,
                                "formatting",
                                e.target.value,
                              )
                            }
                            placeholder="Format Mask"
                            title="Formatting mask (e.g. DD/MM/YYYY, 0.00)"
                            className="h-full w-[80px] lg:w-[100px] text-[11px] border border-slate-200 bg-white focus:bg-white focus:ring-1 focus:ring-[#107C41] shadow-none placeholder:text-slate-300 text-slate-800 px-1.5 rounded-sm shrink-0"
                          />
                          <Input
                            value={col.validation || ""}
                            onChange={(e) =>
                              handleUpdateColumn(
                                col.id,
                                "validation",
                                e.target.value,
                              )
                            }
                            placeholder="Validation Rule"
                            title="Data validation boundaries or regex constraint"
                            className="h-full min-w-[80px] flex-1 text-[11px] border border-slate-200 bg-white focus:bg-white focus:ring-1 focus:ring-[#107C41] shadow-none placeholder:text-slate-300 text-slate-800 px-1.5 rounded-sm"
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="p-0 align-middle text-center w-8">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveColumn(col.id)}
                      className="h-full w-full text-slate-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
