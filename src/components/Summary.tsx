
import { Card } from "@/components/ui/card";
import { ChartBarIcon, TreeIcon } from "lucide-react";

interface SummaryProps {
  volume?: "High" | "Medium" | "Low";
  treeCount?: number;
}

export const Summary = ({ volume = "Low", treeCount = 0 }: SummaryProps) => {
  return (
    <div className="space-y-4 bg-white/5 backdrop-blur-sm rounded-lg p-4">
      <h3 className="text-lg font-semibold">Deforestation Summary</h3>
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <ChartBarIcon className="h-5 w-5" />
          <span className="font-medium">Deforestation Volume:</span>
          <span className={`font-bold ${
            volume === "High" ? "text-red-500" :
            volume === "Medium" ? "text-yellow-500" :
            "text-green-500"
          }`}>
            {volume}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <TreeIcon className="h-5 w-5" />
          <span className="font-medium">Approximate Tree Count:</span>
          <span className="font-bold">{treeCount.toLocaleString()}</span>
        </div>
      </Card>
    </div>
  );
};
