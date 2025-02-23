
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DataDownloadProps {
  data?: GeoJSON.FeatureCollection;
}

export const DataDownload = ({ data }: DataDownloadProps) => {
  const { toast } = useToast();

  const downloadData = (format: string) => {
    if (!data) {
      toast({
        title: "No Data Available",
        description: "Please apply filters to get data first.",
        variant: "destructive",
      });
      return;
    }

    let content = '';
    let fileName = `algae-bloom-data-${new Date().toISOString().split('T')[0]}`;
    let mimeType = '';

    switch (format) {
      case 'csv':
        content = 'Latitude,Longitude,Intensity\n' +
          data.features.map(feature => {
            const coords = feature.geometry.coordinates[0][0];
            return `${coords[1]},${coords[0]},${feature.properties?.intensity || ''}`;
          }).join('\n');
        fileName += '.csv';
        mimeType = 'text/csv';
        break;
      
      case 'json':
        content = JSON.stringify(data, null, 2);
        fileName += '.json';
        mimeType = 'application/json';
        break;
      
      case 'geojson':
        content = JSON.stringify(data, null, 2);
        fileName += '.geojson';
        mimeType = 'application/geo+json';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `Your data is being downloaded in ${format.toUpperCase()} format.`,
    });
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-white/5 rounded-lg backdrop-blur-sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Data
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => downloadData('csv')}>
            Download as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => downloadData('json')}>
            Download as JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => downloadData('geojson')}>
            Download as GeoJSON
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
