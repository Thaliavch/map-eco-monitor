
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Terminal, Navigation, Tree } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold">EcoMonitor</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/pollution"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/pollution"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Biscayne Bay
            </Link>
            <Link
              to="/deforestation"
              className={cn(
                "transition-colors hover:text-foreground/80",
                location.pathname === "/deforestation"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Deforestation
            </Link>
          </nav>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/environment" className="flex items-center">
                <Terminal className="mr-2 h-4 w-4" />
                Environment
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href="https://www.marinetraffic.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Navigation className="mr-2 h-4 w-4" />
                AIS Hub
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="https://www.globalforestwatch.org/dashboards/country/USA/7/FLA/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Tree className="mr-2 h-4 w-4" />
                Miami Forest Watch
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
