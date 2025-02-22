
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cn } from "@/lib/utils";

interface MapProps {
  className?: string;
}

export const Map = ({ className }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const rotationTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoidGhhbGlhdmNoIiwiYSI6ImNtN2dqazg5dDA4dXYycm9qaGxtdWVkdHAifQ.miFSyd4ZFQmnRbkP69lD5A';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      projection: 'mercator',
      zoom: 11,
      center: [-80.1738, 25.7617],
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.scrollZoom.disable();

    map.current.on('style.load', () => {
      map.current?.setMaxBounds([
        [-80.3, 25.5],
        [-80.0, 25.9]
      ]);
    });

    map.current.on('mousedown', () => {
    });
    
    map.current.on('dragstart', () => {
    });
    
    map.current.on('mouseup', () => {
    });
    
    map.current.on('touchend', () => {
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
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/10 rounded-lg" />
    </div>
  );
};
