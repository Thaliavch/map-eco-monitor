
import { Header } from "@/components/Header";
import { Map } from "@/components/Map";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { DataDownload } from "@/components/DataDownload";

// Mock data for different pollution types
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

const MOCK_OIL_SPILLS: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { intensity: 0.9 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-80.19, 25.76],
          [-80.18, 25.76],
          [-80.18, 25.77],
          [-80.19, 25.77],
          [-80.19, 25.76]
        ]]
      }
    }
  ]
};

const MOCK_TURBIDITY: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { intensity: 0.7 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-80.15, 25.79],
          [-80.14, 25.79],
          [-80.14, 25.80],
          [-80.15, 25.80],
          [-80.15, 25.79]
        ]]
      }
    }
  ]
};

export default function PollutionMonitor() {
  const { toast } = useToast();
  const [pollutionData, setPollutionData] = useState<GeoJSON.FeatureCollection | undefined>(undefined);
  const [currentPollutant, setCurrentPollutant] = useState<string>('');

  const handleSearch = async (filters: {
    dateRange: { from: Date | undefined; to: Date | undefined };
    pollutant: string;
    radius: number;
    location: { lat: number; lng: number } | null;
  }) => {
    console.log("Searching with filters:", filters);
    setCurrentPollutant(filters.pollutant);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let mockData;
      switch (filters.pollutant) {
        case 'algal_blooms':
          mockData = MOCK_ALGAE_BLOOMS;
          break;
        case 'oil_spills':
          mockData = MOCK_OIL_SPILLS;
          break;
        case 'turbidity':
          mockData = MOCK_TURBIDITY;
          break;
        default:
          mockData = undefined;
      }

      setPollutionData(mockData);
      
      if (mockData) {
        toast({
          title: "Data Retrieved",
          description: `Successfully fetched ${filters.pollutant.replace('_', ' ')} data.`,
        });
      }
    } catch (error) {
      console.error('Error fetching pollution data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch pollution data. Please try again.",
        variant: "destructive",
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
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-semibold">Biscayne Bay Pollution Monitor</h1>
              <DataDownload data={pollutionData} />
            </div>
            <Map pollutionData={pollutionData} pollutantType={currentPollutant} />
          </div>
        </main>
      </div>
    </div>
  );
}
