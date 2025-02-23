
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";
import { MAPBOX_TOKEN } from "@/_token";

interface MapProps {
  className?: string;
}

export const Map = ({ className }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const rotationTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      projection: "mercator",
      zoom: 11,
      center: [-80.1738, 25.7617],
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

    map.current.scrollZoom.disable();

    map.current.on("style.load", () => {
      // Add bounds to restrict the view to Biscayne Bay area
      map.current?.setMaxBounds([
        [-80.3, 25.5], // Southwest coordinates
        [-80.0, 25.9], // Northeast coordinates
      ]);

      // Add the Biscayne Bay polygon outline
      map.current?.addSource("biscayne-bay", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-80.2, 25.6],
                [-80.15, 25.65],
                [-80.12, 25.75],
                [-80.15, 25.85],
                [-80.2, 25.8],
                [-80.2, 25.6],
              ],
            ],
          },
        },
      });

      map.current?.addLayer({
        id: "bay-outline",
        type: "line",
        source: "biscayne-bay",
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
          "line-opacity": 0.8,
        },
      });
    });

    return () => {
      if (rotationTimer.current) {
        window.clearTimeout(rotationTimer.current);
      }
      map.current?.remove();
    };
  }, []);

  return (
    <div className={cn("relative w-full h-[calc(100vh-4rem)]", className)}>
      <div
        ref={mapContainer}
        className="absolute inset-0 rounded-lg shadow-lg"
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
};
