
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Terminal } from "lucide-react";
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
