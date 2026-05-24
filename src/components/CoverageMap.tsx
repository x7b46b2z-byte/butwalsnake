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
  polygon: [number, number][]; // Lat, Lng array
  status: 'active' | 'busy';
  responders: number;
};

const INITIAL_ZONES: Zone[] = [
  { name: 'Butwal', nameNe: 'बुटवल', lat: 27.7006, lng: 83.4532, 
    polygon: [[27.732, 83.415], [27.745, 83.468], [27.712, 83.485], [27.675, 83.480], [27.670, 83.422]], 
    status: 'busy', responders: 0 },
  { name: 'Tilottama', nameNe: 'तिलोत्तमा', lat: 27.6623, lng: 83.5232, 
    polygon: [[27.675, 83.480], [27.665, 83.515], [27.580, 83.510], [27.565, 83.450], [27.575, 83.425], [27.670, 83.422]], 
    status: 'busy', responders: 0 },
  { name: 'Siddharthanagar', nameNe: 'सिद्धार्थनगर', lat: 27.5038, lng: 83.4540, 
    polygon: [[27.565, 83.450], [27.550, 83.490], [27.495, 83.485], [27.485, 83.445], [27.500, 83.420], [27.575, 83.425]], 
    status: 'busy', responders: 0 },
  { name: 'Devdaha', nameNe: 'देवदहा', lat: 27.6060, lng: 83.5760, 
    polygon: [[27.712, 83.485], [27.725, 83.610], [27.650, 83.630], [27.580, 83.560], [27.580, 83.510], [27.665, 83.515]], 
    status: 'busy', responders: 0 },
  { name: 'Sainamaina', nameNe: 'सैनामैना', lat: 27.6780, lng: 83.3450, 
    polygon: [[27.710, 83.290], [27.732, 83.415], [27.670, 83.422], [27.655, 83.390], [27.640, 83.295]], 
    status: 'busy', responders: 0 },
];

export default function CoverageMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [zones, setZones] = useState<Zone[]>(INITIAL_ZONES);
  const [totalActive, setTotalActive] = useState(0);

  useEffect(() => {
    fetch('/api/volunteer?status=APPROVED')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const vols = data.data;
          let activeCount = 0;
          const updatedZones = INITIAL_ZONES.map(zone => {
            const zVols = vols.filter((v: any) => v.municipality === zone.name || (v.assignedZone && v.assignedZone.includes(zone.name)));
            const activeVols = zVols.filter((v: any) => v.isAvailableNow);
            activeCount += activeVols.length;
            return {
              ...zone,
              responders: zVols.length,
              status: activeVols.length > 0 ? 'active' : 'busy',
            } as Zone;
          });
          setZones(updatedZones);
          setTotalActive(activeCount);
        }
      });
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current || zones === INITIAL_ZONES) return;

    fixLeafletIcons();

    const map = L.map(mapContainer.current, {
      center: [27.6100, 83.5100],
      zoom: 10,
      scrollWheelZoom: false,
    });

    mapRef.current = map;

    // Use ESRI Satellite Imagery
    const tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18,
    });

    tileLayer.addTo(map);

    // Add layers for each coverage zone
    zones.forEach((zone) => {
      // Draw coverage polygon overlay
      const circle = L.polygon(zone.polygon, {
        color: zone.status === 'active' ? '#2ECC71' : '#F1C40F',
        fillColor: zone.status === 'active' ? '#2ECC71' : '#F1C40F',
        fillOpacity: 0.15,
        weight: 2,
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
          <h4 class="text-base font-bold text-primary font-poppins border-b border-white/10 pb-1 mb-2">${zone.name}</h4>
          <p class="text-xs text-gray-300 mb-1"><strong>Active Rescuers:</strong> ${zone.responders} Available</p>
          <p class="text-xs text-gray-300 mb-2"><strong>Coverage:</strong> Full Municipality</p>
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
  }, [zones]);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch font-manrope">
      {/* Map Pane */}
      <div className="flex-grow min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden border border-white/5 shadow-2xl relative z-10">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Info Sidebar Pane */}
      <div className="lg:w-80 flex flex-col gap-4">
        <div className="p-6 rounded-2xl glass border border-white/5 space-y-4 flex-grow bg-slate-dark/90 backdrop-blur-md">
          <h3 className="text-lg font-bold text-white font-poppins border-b border-white/5 pb-2">
            Coverage Municipalities
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
                  <p className="text-xs text-gray-400 font-manrope">Full Municipal Coverage</p>
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
        <div className="p-5 rounded-2xl glass border border-white/5 flex items-center justify-between bg-primary/10">
          <div>
            <span className="text-xs text-gray-400 font-medium block">Ready Responders</span>
            <span className="text-2xl font-black text-primary font-mono block">{totalActive} Online</span>
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
