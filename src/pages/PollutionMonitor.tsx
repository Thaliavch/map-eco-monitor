
import { Header } from "@/components/Header";
import { Map } from "@/components/Map";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

// Mock algae bloom data for demonstration
const MOCK_ALGAE_BLOOMS: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { intensity: 0.8 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-80.18, 25.77],
          [-80.17, 25.77],
          [-80.17, 25.78],
          [-80.18, 25.78],
          [-80.18, 25.77]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { intensity: 0.6 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-80.16, 25.75],
          [-80.15, 25.75],
          [-80.15, 25.76],
          [-80.16, 25.76],
          [-80.16, 25.75]
        ]]
      }
    }
  ]
};

export default function PollutionMonitor() {
  const { toast } = useToast();
  const [algaeBloomData, setAlgaeBloomData] = useState<GeoJSON.FeatureCollection | undefined>(undefined);

  const handleSearch = async (filters: {
    dateRange: { from: Date | undefined; to: Date | undefined };
    pollutant: string;
    radius: number;
    location: { lat: number; lng: number } | null;
  }) => {
    console.log("Searching with filters:", filters);

    if (filters.pollutant === 'algal_blooms') {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock data instead of real API call
        setAlgaeBloomData(MOCK_ALGAE_BLOOMS);
        toast({
          title: "Algae Bloom Data Retrieved",
          description: "Successfully fetched algae bloom detection data.",
        });
      } catch (error) {
        console.error('Error fetching algae bloom data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch algae bloom data. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      setAlgaeBloomData(undefined);
      toast({
        title: "Filters Applied",
        description: "Updating pollution data for Biscayne Bay...",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex pt-16">
        <Sidebar onSearch={handleSearch} />
        <main className="flex-1 p-4">
          <div className="glass-panel rounded-lg p-4 h-full animate-in">
            <h1 className="text-2xl font-semibold mb-4">Biscayne Bay Pollution Monitor</h1>
            <Map algaeBloomData={algaeBloomData} />
          </div>
        </main>
      </div>
    </div>
  );
}
