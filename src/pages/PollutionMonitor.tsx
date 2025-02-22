
import { Header } from "@/components/Header";
import { Map } from "@/components/Map";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/components/ui/use-toast";

export default function PollutionMonitor() {
  const { toast } = useToast();

  const handleSearch = (filters: {
    dateRange: { from: Date | undefined; to: Date | undefined };
    pollutant: string;
    radius: number;
    location: { lat: number; lng: number } | null;
  }) => {
    console.log("Searching with filters:", filters);
    toast({
      title: "Filters Applied",
      description: "Updating pollution data for Biscayne Bay...",
    });
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
