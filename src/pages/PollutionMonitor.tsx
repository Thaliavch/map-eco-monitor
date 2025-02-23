
import { Header } from "@/components/Header";
import { Map } from "@/components/Map";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export default function PollutionMonitor() {
  const { toast } = useToast();
  const [algaeImage, setAlgaeImage] = useState<string | null>(null);

  const handleSearch = async (filters: {
    dateRange: { from: Date | undefined; to: Date | undefined };
    pollutant: string;
    radius: number;
    location: { lat: number; lng: number } | null;
  }) => {
    console.log("Searching with filters:", filters);

    if (filters.pollutant === 'algal_blooms') {
      try {
        const response = await fetch('http://f7a5-34-148-131-57.ngrok-free.app/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            date: filters.dateRange.from ? filters.dateRange.from.toISOString() : new Date().toISOString(),
            location: filters.location || { lat: 25.7617, lng: -80.1738 },
            radius: filters.radius
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received response:', data);
        
        if (data.image) {
          setAlgaeImage(data.image);
          toast({
            title: "Algae Bloom Data Retrieved",
            description: "Successfully fetched algae bloom detection data.",
          });
        } else {
          throw new Error('No image data received');
        }
      } catch (error) {
        console.error('Error fetching algae bloom data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch algae bloom data. The service might be temporarily unavailable.",
          variant: "destructive",
        });
      }
    } else {
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
            <Map />
            {algaeImage && (
              <div className="fixed bottom-4 right-4 p-2 bg-white rounded-lg shadow-lg">
                <p className="text-sm font-medium mb-2">Algae Bloom Detection Result</p>
                <img 
                  src={`data:image/png;base64,${algaeImage}`} 
                  alt="Algae bloom detection"
                  className="max-w-[300px] h-auto rounded"
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
