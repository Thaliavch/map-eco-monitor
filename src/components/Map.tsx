
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

    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [30, 15],
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
      map.current?.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });
    });

    const secondsPerRevolution = 240;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;
    let spinEnabled = true;

    function spinGlobe() {
      if (!map.current || !spinEnabled || userInteracting) return;
      
      const zoom = map.current.getZoom();
      if (zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        
        // Clear any existing timer
        if (rotationTimer.current) {
          window.clearTimeout(rotationTimer.current);
        }
        
        // Schedule the next rotation
        rotationTimer.current = window.setTimeout(() => {
          if (map.current && !userInteracting) {
            map.current.easeTo({ center, duration: 1000, easing: (n) => n });
          }
        }, 1000);
      }
    }

    map.current.on('mousedown', () => {
      userInteracting = true;
      if (rotationTimer.current) {
        window.clearTimeout(rotationTimer.current);
      }
    });
    
    map.current.on('dragstart', () => {
      userInteracting = true;
      if (rotationTimer.current) {
        window.clearTimeout(rotationTimer.current);
      }
    });
    
    map.current.on('mouseup', () => {
      userInteracting = false;
      spinGlobe();
    });
    
    map.current.on('touchend', () => {
      userInteracting = false;
      spinGlobe();
    });

    map.current.on('moveend', spinGlobe);

    // Start the initial rotation
    spinGlobe();

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
