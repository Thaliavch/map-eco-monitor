
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, Search } from "lucide-react";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface SidebarProps {
  className?: string;
  onSearch: (filters: any) => void;
}

const POLLUTANT_TYPES = [
  { value: "all", label: "All Pollutants" },
  { value: "algal_blooms", label: "Algal Blooms" },
  { value: "turbidity", label: "Turbidity" },
  { value: "oil_slick", label: "Oil Slick" },
];

export function Sidebar({ className, onSearch }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [pollutant, setPollutant] = React.useState("all");
  const [radius, setRadius] = React.useState([1]); // Radius in kilometers
  const [location, setLocation] = React.useState<{ lat: number; lng: number } | null>(null);

  const handleSearch = () => {
    onSearch({
      dateRange,
      pollutant,
      radius: radius[0],
      location,
    });
  };

  return (
    <div
      className={cn(
        "relative h-screen border-r transition-all duration-300",
        isCollapsed ? "w-16" : "w-80",
        className
      )}
    >
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className={cn("text-lg font-semibold", isCollapsed && "hidden")}>
            Filters
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
          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="grid gap-2">
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
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Pollutant Type</Label>
            <Select value={pollutant} onValueChange={setPollutant}>
              <SelectTrigger>
                <SelectValue placeholder="Select pollutant type" />
              </SelectTrigger>
              <SelectContent>
                {POLLUTANT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Search Radius (km)</Label>
            <Slider
              value={radius}
              onValueChange={setRadius}
              min={1}
              max={10}
              step={0.5}
              className="my-4"
            />
            <div className="text-sm text-muted-foreground text-center">
              {radius[0]} km
            </div>
          </div>

          <div className="space-y-2">
            <Label>Click on map to set location</Label>
            {location ? (
              <div className="text-sm">
                Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No location selected</div>
            )}
          </div>

          <Button className="w-full" onClick={handleSearch}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
