'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Loader2 } from 'lucide-react';
import { MapSearch } from './map-search';

interface HeatmapProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCityClick: (cityData: any) => void;
  flyToCoords?: [number, number] | null;
}

export default function Heatmap({ onCityClick, flyToCoords }: HeatmapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Create MapLibre map instance using OSM tiles
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [78.9629, 20.5937], // Centered on India
      zoom: 4.5,
      maxZoom: 14,
      minZoom: 3
    });

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-left');

    map.on('load', async () => {
      setMapLoaded(true);
      mapRef.current = map;

      // Load Heatmap Data
      try {
        const response = await fetch('/api/map/data');
        const geojson = await response.json();

        // Add source for heatmap
        map.addSource('cities-submissions', {
          type: 'geojson',
          data: geojson
        });

        // Add Heatmap Layer
        map.addLayer({
          id: 'heatmap-layer',
          type: 'heatmap',
          source: 'cities-submissions',
          maxzoom: 9,
          paint: {
            // Increase weight as zoom level increases
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'total_voices'],
              0, 0,
              100, 1
            ],
            // Heatmap intensity changes by zoom level
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              3, 1,
              9, 3
            ],
            // Heatmap color gradient (saffron-orange scheme)
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0,0,0,0)',
              0.2, 'rgba(29, 131, 72, 0.5)',   // Forest green base
              0.5, 'rgba(245, 166, 35, 0.7)',  // Orange middle
              0.8, 'rgba(224, 90, 22, 0.8)',   // Saffron orange
              1.0, 'rgba(224, 90, 22, 1.0)'    // High density saffron
            ],
            // Adjust radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              3, 15,
              9, 30
            ],
            // Fade out heatmap as zoom increases to show circles
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 0.95,
              9, 0
            ]
          }
        });

        // Add Point Circle Layer (shows up at higher zoom levels)
        map.addLayer({
          id: 'circle-layer',
          type: 'circle',
          source: 'cities-submissions',
          minzoom: 6,
          paint: {
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              6, 6,
              12, 18
            ],
            'circle-color': '#E05A16',
            'circle-stroke-color': '#2D1419',
            'circle-stroke-width': 2,
            'circle-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              6, 0,
              8, 0.9
            ]
          }
        });

        // Click event on circles/heatmap points
        map.on('click', 'circle-layer', (e) => {
          if (!e.features || e.features.length === 0) return;
          const properties = e.features[0].properties;
          onCityClick(properties);
        });

        // Pointer cursor change
        map.on('mouseenter', 'circle-layer', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'circle-layer', () => {
          map.getCanvas().style.cursor = '';
        });

      } catch (error) {
        console.error('Error loading heatmap features:', error);
      } finally {
        setLoadingData(false);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onCityClick]);

  // Handle flyTo when flyToCoords prop updates
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !flyToCoords) return;

    mapRef.current.flyTo({
      center: flyToCoords,
      zoom: 8.5,
      essential: true,
      duration: 2000
    });
  }, [flyToCoords, mapLoaded]);

  const handleLocationSelect = (coords: [number, number]) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center: coords,
      zoom: 8.5,
      essential: true,
      duration: 2000
    });
  };

  return (
    <div className="relative w-full h-full">
      {/* Search Input Overlay */}
      <div className="absolute top-4 left-4 z-10 w-full pr-8 sm:pr-0">
        <MapSearch onLocationSelect={handleLocationSelect} />
      </div>

      {/* Loading Overlay */}
      {loadingData && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <span className="text-sm font-medium text-foreground">Rendering Heatmap...</span>
        </div>
      )}

      {/* Map Element Container - Styled with CSS Filters for Dark OSM Theme */}
      <div 
        ref={mapContainer} 
        className="w-full h-full bg-[#121212] overflow-hidden" 
        style={{
          filter: 'invert(1) hue-rotate(180deg) brightness(0.9) contrast(1.1)'
        }}
      />

      {/* OSM Dark Filter Layer Color Corrections */}
      <style jsx global>{`
        /* Avoid filters impacting popup card contents */
        .maplibregl-popup {
          filter: invert(1) hue-rotate(180deg) !important;
        }
        /* Keep OSM copyright logo readable */
        .maplibregl-ctrl-attrib {
          filter: invert(1) hue-rotate(180deg) !important;
        }
      `}</style>
    </div>
  );
}
