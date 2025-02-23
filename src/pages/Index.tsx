
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navigation, Trees, Database } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to EcoMonitor</h1>
          <p className="text-xl text-muted-foreground">
            Monitoring and analyzing environmental changes in Miami's ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link to="/pollution" className="group">
            <div className="glass-panel rounded-lg p-6 text-center hover:scale-105 transition-transform">
              <Navigation className="w-12 h-12 mx-auto mb-4 group-hover:text-primary" />
              <h2 className="text-xl font-semibold mb-2">Biscayne Bay</h2>
              <p className="text-muted-foreground">
                Monitor water quality and pollution levels in Biscayne Bay
              </p>
            </div>
          </Link>

          <Link to="/deforestation" className="group">
            <div className="glass-panel rounded-lg p-6 text-center hover:scale-105 transition-transform">
              <Trees className="w-12 h-12 mx-auto mb-4 group-hover:text-primary" />
              <h2 className="text-xl font-semibold mb-2">Deforestation</h2>
              <p className="text-muted-foreground">
                Track forest coverage changes in Miami-Dade County
              </p>
            </div>
          </Link>

          <Link to="/environment" className="group">
            <div className="glass-panel rounded-lg p-6 text-center hover:scale-105 transition-transform">
              <Database className="w-12 h-12 mx-auto mb-4 group-hover:text-primary" />
              <h2 className="text-xl font-semibold mb-2">Environment</h2>
              <p className="text-muted-foreground">
                Access environmental data analysis tools and AI assistance
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
