
import { Header } from "@/components/Header";
import { Map } from "@/components/Map";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/components/ui/use-toast";

export default function PollutionMonitor() {
  const { toast } = useToast();

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
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const imageData = await response.text();
        console.log('Received image data:', imageData.substring(0, 100) + '...');
        
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
          </div>
        </main>
      </div>
    </div>
  );
}
