'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon path issues in dynamic exports
const fixLeafletIcons = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
};

type Zone = {
  name: string;
  nameNe: string;
  lat: number;
  lng: number;
  radius: number; // in meters
  status: 'active' | 'busy';
  responders: number;
};

const zones: Zone[] = [
  { name: 'Butwal', nameNe: 'बुटवल', lat: 27.7082, lng: 83.4651, radius: 6000, status: 'active', responders: 4 },
  { name: 'Tilottama', nameNe: 'तिलोत्तमा', lat: 27.6185, lng: 83.4678, radius: 7000, status: 'active', responders: 3 },
  { name: 'Siddharthanagar', nameNe: 'सिद्धार्थनगर', lat: 27.5098, lng: 83.4502, radius: 5500, status: 'active', responders: 2 },
  { name: 'Devdaha', nameNe: 'देवदहा', lat: 27.6710, lng: 83.5658, radius: 6500, status: 'busy', responders: 1 },
];

export default function CoverageMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    fixLeafletIcons();

    // Center map around Rupandehi District coordinates (Butwal/Tilottama centroid)
    const map = L.map(mapContainer.current, {
      center: [27.61, 83.48],
      zoom: 11,
      scrollWheelZoom: false,
    });

    mapRef.current = map;

    // Load OpenStreetMap tiles and apply custom dark style via CSS class in container
    const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 18,
    });

    tileLayer.addTo(map);

    // Apply dark filter to tile container for an extra cohesive deep-slate aesthetic
    tileLayer.on('tileload', (e) => {
      e.tile.classList.add('leaflet-dark-filter');
    });

    // Add layers for each coverage zone
    zones.forEach((zone) => {
      // Draw coverage radius overlay circle
      const circle = L.circle([zone.lat, zone.lng], {
        radius: zone.radius,
        color: zone.status === 'active' ? '#2ECC71' : '#F1C40F',
        fillColor: zone.status === 'active' ? '#2ECC71' : '#F1C40F',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '6, 6',
      }).addTo(map);

      // Create a premium glowing div icon for the zone pin
      const pulseHtml = `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-6 h-6 rounded-full bg-${zone.status === 'active' ? 'emerald' : 'yellow'}-500/30 animate-ping"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-${zone.status === 'active' ? 'emerald' : 'yellow'}-500 border-2 border-white shadow"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pulseHtml,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([zone.lat, zone.lng], { icon: customIcon }).addTo(map);

      // Connect popup interaction
      const popupContent = `
        <div class="p-3 bg-slate-dark text-white rounded-xl font-manrope min-w-[200px]">
          <h4 class="text-base font-bold text-primary font-poppins border-b border-white/10 pb-1 mb-2">${zone.name} Zone</h4>
          <p class="text-xs text-gray-300 mb-1"><strong>Active Rescuers:</strong> ${zone.responders} Available</p>
          <p class="text-xs text-gray-300 mb-2"><strong>Rescue Range:</strong> ${(zone.radius / 1000).toFixed(1)} km</p>
          <div class="flex items-center gap-1.5 mt-1.5">
            <span class="inline-block w-2.5 h-2.5 rounded-full bg-${zone.status === 'active' ? 'emerald' : 'yellow'}-500 animate-pulse"></span>
            <span class="text-xs font-semibold text-gray-200 uppercase">${zone.status === 'active' ? 'High Availability' : 'Limited Coverage'}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'custom-leaflet-popup',
      });

      marker.on('click', () => {
        setSelectedZone(zone);
        map.setView([zone.lat, zone.lng], 12);
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch font-manrope">
      {/* Map Pane */}
      <div className="flex-grow min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative z-10">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Info Sidebar Pane */}
      <div className="lg:w-80 flex flex-col gap-4">
        <div className="p-6 rounded-2xl glass border border-white/5 space-y-4 flex-grow">
          <h3 className="text-lg font-bold text-white font-poppins border-b border-white/5 pb-2">
            Coverage Districts
          </h3>
          <p className="text-sm text-gray-400">
            Click any pulsing zone marker on the map to inspect nearby rescuer density and dispatch status.
          </p>

          <div className="space-y-3 pt-2">
            {zones.map((z) => (
              <button
                key={z.name}
                onClick={() => {
                  setSelectedZone(z);
                  if (mapRef.current) {
                    mapRef.current.setView([z.lat, z.lng], 12);
                  }
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                  selectedZone?.name === z.name
                    ? 'bg-primary/10 border-primary/40 text-white'
                    : 'bg-white/5 border-white/5 hover:border-white/10 text-gray-300'
                }`}
              >
                <div>
                  <h4 className="font-semibold text-sm font-poppins">{z.name} ({z.nameNe})</h4>
                  <p className="text-xs text-gray-400 font-manrope">{(z.radius / 1000).toFixed(1)} km radius range</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  z.status === 'active' ? 'bg-primary/20 text-primary border border-primary/10' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/10'
                }`}>
                  {z.status === 'active' ? 'Ready' : 'Busy'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Floating Quick Stats Card */}
        <div className="p-5 rounded-2xl glass border border-white/5 flex items-center justify-between bg-primary/5">
          <div>
            <span className="text-xs text-gray-400 font-medium block">Total Responders</span>
            <span className="text-2xl font-black text-primary font-mono block">10 Active</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 font-medium block">Avg Dispatch Time</span>
            <span className="text-lg font-bold text-white block">18 Mins</span>
          </div>
        </div>
      </div>
    </div>
  );
}
