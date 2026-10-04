'use client';

import React, { useEffect, useRef, useState } from 'react';
import { InfrastructureItem, InfrastructureStatus } from '../types/infrastructure';
import { getStatusColor, INFRA_TYPE_LABELS } from '../utils/infraHelpers';
import {
  Layers,
  Crosshair,
  Maximize2,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Navigation,
} from 'lucide-react';

interface MapComponentProps {
  items: InfrastructureItem[];
  selectedItem: InfrastructureItem | null;
  onSelectItem: (item: InfrastructureItem) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
  onLocationPick?: (lat: number, lng: number) => void;
  pickMode?: boolean;
}

// Default center (Nashik city center)
const DEFAULT_CENTER: [number, number] = [19.9975, 73.7898];
const DEFAULT_ZOOM = 13;

export const MapComponent: React.FC<MapComponentProps> = ({
  items,
  selectedItem,
  onSelectItem,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  className = '',
  onLocationPick,
  pickMode = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const pickMarkerRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tileMode, setTileMode] = useState<'voyager' | 'osm' | 'dark'>('voyager');

  // Load Leaflet JS dynamically to prevent any SSR hydration bugs
  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      // If Leaflet is not yet on window, inject script
      if (!(window as any).L) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          script.crossOrigin = '';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      if (!isMounted || !mapContainerRef.current) return;
      const L = (window as any).L;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        const initialCenter = selectedItem
          ? [selectedItem.latitude, selectedItem.longitude]
          : center;

        const map = L.map(mapContainerRef.current, {
          center: initialCenter,
          zoom: zoom,
          zoomControl: false,
        });

        // Add Base Tile Layer
        const tileUrl =
          tileMode === 'voyager'
            ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
            : tileMode === 'dark'
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

        L.tileLayer(tileUrl, {
          attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
          maxZoom: 19,
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;
        setMapLoaded(true);

        // Click to pick location in report mode
        map.on('click', (e: any) => {
          if (onLocationPick) {
            onLocationPick(e.latlng.lat, e.latlng.lng);

            if (pickMarkerRef.current) {
              pickMarkerRef.current.setLatLng(e.latlng);
            } else {
              const pickIcon = L.divIcon({
                className: 'custom-pick-pin',
                html: `<div style="background-color: #e11d48; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">
                        <span style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 14px;">+</span>
                       </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
              });
              pickMarkerRef.current = L.marker(e.latlng, { icon: pickIcon }).addTo(map);
            }
          }
        });
      }
    };

    loadLeaflet().catch((err) => console.error('Failed to load Leaflet:', err));

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update tile layer when tileMode changes
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    mapInstanceRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) {
        mapInstanceRef.current.removeLayer(layer);
      }
    });

    const tileUrl =
      tileMode === 'voyager'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : tileMode === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  }, [tileMode, mapLoaded]);

  // Render and update markers on items change
  useEffect(() => {
    if (!mapLoaded || !markersLayerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    markersLayerRef.current.clearLayers();

    items.forEach((item) => {
      const isSelected = selectedItem?.id === item.id;
      const isBroken = item.status === 'broken';
      const isWarning = item.status === 'warning';
      const isWorking = item.status === 'working';

      const pinBg = isBroken
        ? '#e11d48'
        : isWarning
        ? '#d97706'
        : isWorking
        ? '#059669'
        : '#64748b';

      const typeLabel = INFRA_TYPE_LABELS[item.type] || item.type;

      // Custom HTML Marker Pin
      const iconHtml = `
        <div style="position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          ${
            isBroken
              ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: rgba(225, 29, 72, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
              : ''
          }
          <div style="
            background: ${pinBg};
            width: ${isSelected ? '36px' : '28px'};
            height: ${isSelected ? '36px' : '28px'};
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: ${isSelected ? '3px solid white' : '2px solid white'};
            color: white;
            font-weight: bold;
            font-size: 11px;
            transition: all 0.2s ease;
          ">
            ${
              isBroken
                ? '✕'
                : isWarning
                ? '!'
                : isWorking
                ? '✓'
                : '?'
            }
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-infra-marker',
        html: iconHtml,
        iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
        iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([item.latitude, item.longitude], {
        icon: customIcon,
      });

      // Interactive Popup
      const popupHtml = `
        <div style="min-width: 200px; padding: 12px; font-family: inherit;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b;">${typeLabel}</span>
            <span style="font-size: 10px; font-weight: 700; color: ${pinBg};">${item.status.toUpperCase()}</span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; margin: 0 0 4px 0; color: #0f172a;">${item.name}</h4>
          <p style="font-size: 11px; color: #475569; margin: 0 0 8px 0; line-height: 1.3;">${item.address}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <span>${item.reportCount} reports</span>
            <span style="color: #e11d48; font-weight: 600;">Click to inspect →</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: false });

      marker.on('click', () => {
        onSelectItem(item);
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [items, selectedItem, mapLoaded]);

  // Center on selected item
  useEffect(() => {
    if (!mapLoaded || !mapInstanceRef.current || !selectedItem) return;
    mapInstanceRef.current.flyTo(
      [selectedItem.latitude, selectedItem.longitude],
      15,
      { duration: 0.8 }
    );
  }, [selectedItem, mapLoaded]);

  // Geolocation button
  const handleLocateMe = () => {
    if (!navigator.geolocation || !mapInstanceRef.current) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        mapInstanceRef.current.flyTo(coords, 15, { duration: 1 });
        if (onLocationPick) {
          onLocationPick(coords[0], coords[1]);
        }
      },
      () => {
        alert('Unable to retrieve your current location.');
      }
    );
  };

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 0.8 });
  };

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomOut();
  };

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="flex flex-col rounded-xl border border-slate-200 bg-white/95 shadow-md backdrop-blur-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900/95">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <div className="h-px bg-slate-200 dark:bg-slate-800" />
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
        </div>

        {/* Locate Me */}
        <button
          type="button"
          onClick={handleLocateMe}
          className="rounded-xl border border-slate-200 bg-white/95 p-2.5 text-slate-700 shadow-md backdrop-blur-xs hover:bg-slate-100 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-300 transition-colors"
          title="Locate my position"
        >
          <Crosshair size={18} />
        </button>

        {/* Reset City View */}
        <button
          type="button"
          onClick={handleResetView}
          className="rounded-xl border border-slate-200 bg-white/95 p-2.5 text-slate-700 shadow-md backdrop-blur-xs hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-300 transition-colors"
          title="Reset city overview"
        >
          <Maximize2 size={18} />
        </button>

        {/* Layer style switcher */}
        <div className="relative group">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white/95 p-2.5 text-slate-700 shadow-md backdrop-blur-xs hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-300 transition-colors"
            title="Switch map layer"
          >
            <Layers size={18} />
          </button>
          <div className="absolute right-0 top-0 hidden group-hover:flex flex-col rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-xs w-32 space-y-1">
            <button
              type="button"
              onClick={() => setTileMode('voyager')}
              className={`w-full text-left px-2 py-1 rounded font-medium ${
                tileMode === 'voyager' ? 'bg-rose-50 text-rose-700 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              Voyager (Clean)
            </button>
            <button
              type="button"
              onClick={() => setTileMode('osm')}
              className={`w-full text-left px-2 py-1 rounded font-medium ${
                tileMode === 'osm' ? 'bg-rose-50 text-rose-700 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              OpenStreetMap
            </button>
            <button
              type="button"
              onClick={() => setTileMode('dark')}
              className={`w-full text-left px-2 py-1 rounded font-medium ${
                tileMode === 'dark' ? 'bg-rose-50 text-rose-700 font-bold' : 'hover:bg-slate-100'
              }`}
            >
              Night Audit
            </button>
          </div>
        </div>
      </div>

      {/* Floating Status Legend (Bottom-Left) */}
      <div className="absolute bottom-5 left-5 z-20 hidden sm:flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Working</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">Warning</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="font-semibold text-rose-700 dark:text-rose-400">Dead / Broken</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
          <span className="font-semibold text-slate-600 dark:text-slate-400">Unknown</span>
        </div>
      </div>
    </div>
  );
};
