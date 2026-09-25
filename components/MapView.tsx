"use client";

import { useEffect, useRef } from "react";
import { ZONES } from "@/lib/zones";

type Props = {
  onZoneClick?: (id: string) => void;
};

export default function MapView({ onZoneClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    if (!containerRef.current) return;
    initialised.current = true;

    const cartoKey = process.env.NEXT_PUBLIC_CARTO_KEY || "";

    import("leaflet").then((L) => {
      const map = L.map(containerRef.current!, {
        center: [-19.0154, 29.1549],
        zoom: 6,
        zoomControl: true,
        attributionControl: true,
        minZoom: 5,
        maxZoom: 12,
      });

      // 1. OpenTopoMap topographic base (free, no key required)
      //    Dimmed heavily so it reads as a subtle terrain layer,
      //    not a bright map. Gives Zimbabwe's relief shape.
      L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
          subdomains: "abc",
          maxZoom: 17,
          opacity: 0.55,
          attribution:
            'Map data: &copy; OpenStreetMap contributors, SRTM | Style: &copy; OpenTopoMap (CC-BY-SA)',
        }
      ).addTo(map);

      // 2. CARTO dark matter overlay (with API key)
      //    This paints the dark Anduril-style canvas over the topo layer
      //    while letting the terrain contours bleed through.
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=" + cartoKey,
        {
          subdomains: "abcd",
          maxZoom: 19,
          opacity: 0.78,
          attribution:
            '&copy; OpenStreetMap &copy; CARTO',
        }
      ).addTo(map);

      // 3. Command post marker (Harare)
      const cmdIcon = L.divIcon({
        className: "",
        html: `
          <div style="position:relative;width:18px;height:18px;">
            <div style="position:absolute;inset:0;border:1px solid #00D9FF;transform:rotate(45deg);"></div>
            <div style="position:absolute;inset:4px;background:#00D9FF;"></div>
          </div>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      L.marker([-17.8252, 31.0335], { icon: cmdIcon })
        .addTo(map)
        .bindPopup(
          '<div style="font-family:ui-monospace,monospace;font-size:11px;">' +
            '<div style="color:#00D9FF;letter-spacing:2px;margin-bottom:4px;">CMD</div>' +
            '<div style="color:#8A8F99;">HARARE // 17.83S 31.03E</div>' +
          '</div>'
        );

      // 4. Zone markers
      ZONES.forEach((zone) => {
        const isTriggered = zone.threshold >= 0.72;
        const cls = isTriggered ? "zone-marker alert" : "zone-marker";
        const icon = L.divIcon({
          className: "",
          html: `
            <div class="${cls}">
              <div class="ring"></div>
              <div class="core"></div>
            </div>
          `,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        const marker = L.marker([zone.lat, zone.lon], { icon }).addTo(map);

        marker.bindPopup(
          '<div style="font-family:ui-monospace,monospace;font-size:11px;min-width:200px;">' +
            '<div style="color:#00D9FF;letter-spacing:2px;margin-bottom:6px;">' +
              zone.id.toUpperCase() +
            '</div>' +
            '<div style="color:#E8EAED;font-size:13px;margin-bottom:8px;">' +
              zone.name +
            '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;color:#8A8F99;">' +
              '<div>FARMERS</div><div style="color:#E8EAED;text-align:right;">' +
                zone.farmersEnrolled.toLocaleString() +
              '</div>' +
              '<div>POLICIES</div><div style="color:#E8EAED;text-align:right;">' +
                zone.policiesActive.toLocaleString() +
              '</div>' +
              '<div>THRESHOLD</div><div style="color:#E8EAED;text-align:right;">' +
                zone.threshold.toFixed(2) +
              '</div>' +
              '<div>LAT/LON</div><div style="color:#E8EAED;text-align:right;">' +
                zone.lat.toFixed(2) + ', ' + zone.lon.toFixed(2) +
              '</div>' +
            '</div>' +
            '<div style="margin-top:10px;padding-top:8px;border-top:1px solid #1F2126;">' +
              '<a href="/zones" style="color:#00D9FF;font-size:10px;letter-spacing:2px;text-decoration:none;">VIEW DETAIL →</a>' +
            '</div>' +
          '</div>'
        );

        if (onZoneClick) {
          marker.on("click", () => onZoneClick(zone.id));
        }
      });

      // 5. Zimbabwe bounding box outline
      L.rectangle(
        [[-22.5, 25.2], [-15.6, 33.1]],
        {
          color: "#2A2D33",
          weight: 1,
          fill: false,
          dashArray: "4 4",
        }
      ).addTo(map);

      mapRef.current = map;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        initialised.current = false;
      }
    };
  }, [onZoneClick]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
