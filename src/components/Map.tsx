
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
      center: center || [-80.68623, 25.40478],
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      "top-right"
    );

    map.current.on("style.load", () => {
      // Add bounds to restrict the view to Everglades areas
      map.current?.setMaxBounds([
        [-80.8, 25.2], // Southwest coordinates
        [-80.5, 25.6], // Northeast coordinates
      ]);

      // Add the Everglades Zone 1 polygon outline
      map.current?.addSource("everglades-zone1", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [[
              [-80.69623, 25.39478], // Create a polygon around the center point
              [-80.67623, 25.39478],
              [-80.67623, 25.41478],
              [-80.69623, 25.41478],
              [-80.69623, 25.39478],
            ]],
          },
        },
      });

      // Add the Everglades Zone 2 polygon outline
      map.current?.addSource("everglades-zone2", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: [[
              [-80.68623, 25.40478],
              [-80.66623, 25.40478],
              [-80.66623, 25.42478],
              [-80.68623, 25.42478],
              [-80.68623, 25.40478],
            ]],
          },
        },
      });

      // Add layer for Zone 1
      map.current?.addLayer({
        id: "zone1-outline",
        type: "line",
        source: "everglades-zone1",
        paint: {
          "line-color": "#ffffff",
          "line-width": 2,
          "line-opacity": 0.8,
        },
      });

      // Add fill layer for Zone 1
      map.current?.addLayer({
        id: "zone1-fill",
        type: "fill",
        source: "everglades-zone1",
        paint: {
          "fill-color": "#ffffff",
          "fill-opacity": 0.1,
        },
      });

      // Add layer for Zone 2
      map.current?.addLayer({
        id: "zone2-outline",
        type: "line",
        source: "everglades-zone2",
        paint: {
          "line-color": "#00ff00",
          "line-width": 2,
          "line-opacity": 0.8,
        },
      });

      // Add fill layer for Zone 2
      map.current?.addLayer({
        id: "zone2-fill",
        type: "fill",
        source: "everglades-zone2",
        paint: {
          "fill-color": "#00ff00",
          "fill-opacity": 0.1,
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
