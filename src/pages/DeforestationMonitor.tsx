import { Header } from "@/components/Header";
import { Map } from "@/components/Map";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Summary } from "@/components/Summary";
import { DataDownload } from "@/components/DataDownload";
import { DeforestationMap } from "@/components/DeforestationMap";

const AREAS = [
  { id: "everglades1", name: "Everglades Zone 1", coordinates: [-80.68623, 25.40478] as [number, number] },
  { id: "everglades2", name: "Everglades Zone 2", coordinates: [-80.67623, 25.41478] as [number, number] },
];

export default function DeforestationMonitor() {
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const [analysisResults, setAnalysisResults] = useState<{
    volume: "High" | "Medium" | "Low";
    treeCount: number;
  }>({
    volume: "Low",
    treeCount: 0,
  });
  
  const [comparisonDates, setComparisonDates] = useState<{
    first: Date | undefined;
    second: Date | undefined;
  }>({
    first: undefined,
    second: undefined,
  });

  const [compareArea, setCompareArea] = useState<string>("");

  const handleAnalyze = () => {
    toast({
      title: "Analysis Started",
      description: "Analyzing deforestation data for the selected area and dates...",
    });
    setAnalysisResults({
      volume: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)] as "High" | "Medium" | "Low",
      treeCount: Math.floor(Math.random() * 10000),
    });
    console.log("Analyzing with params:", { selectedArea, dateRange });
  };

  const handleCompare = () => {
    if (!compareArea) {
      toast({
        title: "Area Required",
        description: "Please select an area to compare.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Comparison Started",
      description: "Comparing deforestation data between selected dates...",
    });
    setAnalysisResults({
      volume: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)] as "High" | "Medium" | "Low",
      treeCount: Math.floor(Math.random() * 10000),
    });
    console.log("Comparing dates:", { compareArea, comparisonDates });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex pt-16">
        <div
          className={cn(
            "relative h-screen border-r transition-all duration-300",
            isCollapsed ? "w-16" : "w-80"
          )}
        >
          <div className="flex h-full flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <h2 className={cn("text-lg font-semibold", isCollapsed && "hidden")}>
                Analysis Tools
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="h-8 w-8"
              >
                {isCollapsed ? (
                  <ChevronRightIcon className="h-4 w-4" />
                ) : (
                  <ChevronLeftIcon className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className={cn("space-y-4", isCollapsed && "hidden")}>
              <Tabs defaultValue="analyze" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analyze">Analyze</TabsTrigger>
                  <TabsTrigger value="compare">Compare</TabsTrigger>
                </TabsList>

                <TabsContent value="analyze" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Area</Label>
                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {AREAS.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange.from ? (
                            dateRange.to ? (
                              <>
                                {format(dateRange.from, "LLL dd, y")} -{" "}
                                {format(dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          selected={dateRange}
                          onSelect={(range: any) => setDateRange(range)}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button className="w-full" onClick={handleAnalyze}>
                    Analyze Area
                  </Button>
                </TabsContent>

                <TabsContent value="compare" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Area</Label>
                    <Select value={compareArea} onValueChange={setCompareArea}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {AREAS.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>First Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !comparisonDates.first && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {comparisonDates.first ? (
                            format(comparisonDates.first, "LLL dd, y")
                          ) : (
                            <span>Pick first date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={comparisonDates.first}
                          onSelect={(date) =>
                            setComparisonDates((prev) => ({ ...prev, first: date }))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Second Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !comparisonDates.second && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {comparisonDates.second ? (
                            format(comparisonDates.second, "LLL dd, y")
                          ) : (
                            <span>Pick second date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={comparisonDates.second}
                          onSelect={(date) =>
                            setComparisonDates((prev) => ({ ...prev, second: date }))
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleCompare}
                    disabled={!compareArea || !comparisonDates.first || !comparisonDates.second}
                  >
                    Compare Dates
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        <main className="flex-1 p-4">
          <div className="glass-panel rounded-lg p-4 h-full animate-in">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-semibold">Deforestation Monitor</h1>
              <DataDownload />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-3">
                <DeforestationMap
                  center={
                    (selectedArea || compareArea) 
                      ? AREAS.find(a => a.id === (selectedArea || compareArea))?.coordinates 
                      : undefined
                  }
                  className="w-full h-[calc(100vh-12rem)]"
                />
              </div>
              <div className="space-y-4">
                <Summary 
                  volume={analysisResults.volume}
                  treeCount={analysisResults.treeCount}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
