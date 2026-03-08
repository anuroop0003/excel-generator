import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { groqService } from "@/lib/groq.service";
import * as formulajs from "@formulajs/formulajs";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";

const FORMULA_FUNCTIONS = Object.keys(formulajs).map((name) => ({
  name,
  desc: `Standard Excel ${name} function`,
}));

export function FormulaInput({
  value,
  onChange,
  columnName = "",
  allColumns = [],
}: {
  value: string;
  onChange: (val: string) => void;
  columnName?: string;
  allColumns?: any[];
}) {
  const [focused, setFocused] = useState<boolean>(false);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [aiQuery, setAiQuery] = useState<string>("");
  const [showAiModal, setShowAiModal] = useState<boolean>(false);

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

  const handleAiSuggest = async () => {
    if (!aiQuery.trim()) return;
    try {
      setIsSuggesting(true);
      const suggestion = await groqService.suggestFormula(
        columnName,
        allColumns,
        aiQuery,
      );
      if (suggestion) {
        onChange(suggestion);
        setShowAiModal(false);
        setAiQuery("");
      }
    } catch (error) {
      console.error("Formula suggestion failed:", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <Popover open={showSuggestions}>
      <PopoverAnchor asChild>
        <div className="relative flex items-center flex-1 h-full w-full group">
          <InputGroup className="h-full border-0 rounded-none focus-within:ring-0 focus-within:bg-white bg-transparent transition-colors">
            <InputGroupAddon className="pl-2 pr-0 font-mono font-bold text-green-700 pointer-events-none z-10 text-[11px]">
              ƒx
            </InputGroupAddon>
            <InputGroupInput
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              placeholder="=SUM(A, B)"
              className="h-full pl-1 pr-8 text-green-900 placeholder:text-slate-300"
            />

            <Dialog open={showAiModal} onOpenChange={setShowAiModal}>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-0.5 h-6 w-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity z-10 cursor-pointer"
                  title="AI Formula Assistant"
                >
                  <Sparkles className="size-3 fill-purple-600/10" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-purple-700">
                    <Sparkles className="size-4" /> AI Formula Assistant
                  </DialogTitle>
                  <DialogDescription>
                    Describe what you want to calculate for <b>{columnName}</b>.
                    AI will generate the Excel formula for you.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Textarea
                    placeholder="e.g. Calculate 10% tax on Price column, or Sum of Qty and Cost..."
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    className="min-h-[100px] text-xs border-purple-100 focus-visible:ring-2 focus-visible:ring-purple-400"
                  />
                  <div className="text-xs text-slate-500">
                    Available columns:{" "}
                    {allColumns.map((c: any) => c.name).join(", ")}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAiSuggest}
                    disabled={isSuggesting || !aiQuery.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white w-full gap-2 h-9"
                  >
                    {isSuggesting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Wand2 className="size-4" />
                    )}
                    {isSuggesting ? "Generating..." : "Generate Formula"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </InputGroup>
        </div>
      </PopoverAnchor>
      <PopoverContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-[250px] p-1 border-slate-200 shadow-xl z-50 max-h-[180px] overflow-auto"
        align="start"
      >
        {suggestions.map((s) => (
          <div
            key={s.name}
            className="px-2 py-1.5 hover:bg-slate-100 cursor-pointer flex flex-col"
            onMouseDown={(e) => {
              e.preventDefault();
              handleSelect(s.name);
            }}
          >
            <div className="text-sm font-mono font-bold text-green-800">
              {s.name}
            </div>
            <div className="text-xs text-slate-500 truncate">{s.desc}</div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
