
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { cn } from "@/lib/utils";
import { MAPBOX_TOKEN } from "@/_token";

interface MapProps {
  className?: string;
  pollutionData?: GeoJSON.FeatureCollection;
  pollutantType?: string;
  center?: [number, number];
}

export const Map = ({ className, pollutionData, pollutantType, center }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      projection: "mercator",
      zoom: 11,
      center: center || [-80.17, 25.77], // Biscayne Bay coordinates
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

    map.current.on("style.load", () => {
      // Add bounds to restrict the view to Biscayne Bay area
      map.current?.setMaxBounds([
        [-80.25, 25.70], // Southwest coordinates for Biscayne Bay
        [-80.10, 25.85], // Northeast coordinates for Biscayne Bay
      ]);

      if (!map.current?.getSource("pollution-data") && pollutionData) {
        map.current?.addSource("pollution-data", {
          type: "geojson",
          data: pollutionData,
        });

        map.current?.addLayer({
          id: "pollution-fill",
          type: "fill",
          source: "pollution-data",
          paint: {
            "fill-color": [
              "match",
              ["get", "pollutantType"],
              "algal_blooms", "rgba(0, 255, 0, 0.5)",
              "oil_spills", "rgba(255, 0, 0, 0.5)",
              "turbidity", "rgba(255, 255, 0, 0.5)",
              "rgba(0, 0, 255, 0.5)",
            ],
            "fill-opacity": ["get", "intensity"],
          },
        });
      }
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update center when it changes
  useEffect(() => {
    if (map.current && center) {
      map.current.flyTo({
        center: center,
        essential: true
      });
    }
  }, [center]);

  // Update pollution data when it changes
  useEffect(() => {
    if (map.current && pollutionData) {
      if (!map.current.getSource("pollution-data")) {
        map.current.addSource("pollution-data", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [],
          },
        });

        map.current.addLayer({
          id: "pollution-fill",
          type: "fill",
          source: "pollution-data",
          paint: {
            "fill-color": [
              "match",
              ["get", "pollutantType"],
              "algal_blooms", "rgba(0, 255, 0, 0.5)",
              "oil_spills", "rgba(255, 0, 0, 0.5)",
              "turbidity", "rgba(255, 255, 0, 0.5)",
              "rgba(0, 0, 255, 0.5)",
            ],
            "fill-opacity": ["get", "intensity"],
          },
        });
      }

      const enhancedData = {
        ...pollutionData,
        features: pollutionData.features.map(feature => ({
          ...feature,
          properties: {
            ...feature.properties,
            pollutantType: pollutantType
          }
        }))
      };
      (map.current.getSource("pollution-data") as mapboxgl.GeoJSONSource).setData(enhancedData);
    }
  }, [pollutionData, pollutantType]);

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
