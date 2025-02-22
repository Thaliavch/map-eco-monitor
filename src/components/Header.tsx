
import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">EcoMonitor</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link
            to="/pollution"
            className={cn(
              "transition-colors hover:text-foreground/80",
              location.pathname === "/pollution" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Pollution
          </Link>
          <Link
            to="/deforestation"
            className={cn(
              "transition-colors hover:text-foreground/80",
              location.pathname === "/deforestation" ? "text-foreground" : "text-foreground/60"
            )}
          >
            Deforestation
          </Link>
        </nav>
      </div>
    </header>
  );
}
