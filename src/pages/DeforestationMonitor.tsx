
import { Header } from "@/components/Header";
import { Map } from "@/components/Map";
import { Sidebar } from "@/components/Sidebar";
import { useToast } from "@/components/ui/use-toast";

export default function DeforestationMonitor() {
  const { toast } = useToast();

  const handleSearch = (filters: any) => {
    console.log("Searching with filters:", filters);
    toast({
      title: "Filters Applied",
      description: "Updating deforestation data on the map...",
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex pt-16">
        <Sidebar onSearch={handleSearch} />
        <main className="flex-1 p-4">
          <div className="glass-panel rounded-lg p-4 h-full animate-in">
            <h1 className="text-2xl font-semibold mb-4">Deforestation Monitor</h1>
            <Map />
          </div>
        </main>
      </div>
    </div>
  );
}
