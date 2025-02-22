
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, Search } from "lucide-react";
import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

interface SidebarProps {
  className?: string;
  onSearch: (filters: any) => void;
}

export function Sidebar({ className, onSearch }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [date, setDate] = React.useState<Date>();
  const [location, setLocation] = React.useState("");

  const handleSearch = () => {
    onSearch({
      date,
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
            <Label>Location</Label>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button className="w-full" onClick={handleSearch}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
