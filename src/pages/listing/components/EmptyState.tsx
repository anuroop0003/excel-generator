import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileType, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EmptyState() {
  const navigate = useNavigate();

  return (
    <Card className="border-dashed border-2 bg-white/50 border-slate-300">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <FileType className="size-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700">
          No templates found
        </h3>
        <p className="text-slate-500 mb-6">
          Create your first template to start generating Excel files.
        </p>
        <Button
          size="sm"
          onClick={() => navigate("/create-template")}
          variant="outline"
          className="border-[#107C41] text-[#107C41] hover:bg-green-100 hover:text-[#107C41] cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Now
        </Button>
      </CardContent>
    </Card>
  );
}
