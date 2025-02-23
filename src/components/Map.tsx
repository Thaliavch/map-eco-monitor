
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
      center: center || [-80.1738, 25.7617],
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
            coordinates: [[
              [-80.2, 25.6],
              [-80.15, 25.65],
              [-80.12, 25.75],
              [-80.15, 25.85],
              [-80.2, 25.8],
              [-80.2, 25.6],
            ]],
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

      // Add source for pollution data
      map.current?.addSource("pollution-data", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      // Add layer for pollution polygons
      map.current?.addLayer({
        id: "pollution-layer",
        type: "fill",
        source: "pollution-data",
        paint: {
          "fill-color": [
            "match",
            ["get", "pollutantType"],
            "oil_spills", "#8B0000",
            "turbidity", "#CD853F",
            "#00ff00" // default color (algae)
          ],
          "fill-opacity": 0.4,
        },
      });
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
    if (map.current && map.current.getSource("pollution-data") && pollutionData) {
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
