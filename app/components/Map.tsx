"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ChipotleLocation } from "@/lib/mockData";

// Free vector tiles — no API key required (OpenFreeMap)
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

interface MapProps {
  userLat: number;
  userLng: number;
  locations: ChipotleLocation[];
  cheapestId: number;
  selectedId: number | null;
  onSelectLocation: (id: number) => void;
}

export default function ChipotleMap({
  userLat,
  userLng,
  locations,
  cheapestId,
  selectedId,
  onSelectLocation,
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<number, maplibregl.Marker>>({});
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  // ── Init map ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [userLng, userLat],
      zoom: 11,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── User location marker ──────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (userMarkerRef.current) userMarkerRef.current.remove();

    const el = document.createElement("div");
    el.style.cssText = `
      width: 18px; height: 18px;
      border-radius: 50%;
      background: #3b82f6;
      border: 3px solid white;
      box-shadow: 0 0 0 3px rgba(59,130,246,0.35), 0 2px 8px rgba(0,0,0,0.3);
    `;

    userMarkerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat([userLng, userLat])
      .setPopup(new maplibregl.Popup({ offset: 14 }).setHTML("<strong>You are here</strong>"))
      .addTo(map);
  }, [userLat, userLng]);

  // ── Location markers ──────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    locations.forEach((loc) => {
      const isCheapest = loc.id === cheapestId;
      const isSelected = loc.id === selectedId;

      const el = document.createElement("div");
      el.style.cssText = `
        width: ${isSelected ? "38px" : "32px"};
        height: ${isSelected ? "38px" : "32px"};
        border-radius: 50%;
        background: ${isCheapest ? "#16a34a" : "#6b7280"};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,${isSelected ? "0.45" : "0.25"});
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        font-size: ${isSelected ? "16px" : "13px"};
        transition: all 0.2s ease;
        ${isSelected ? `outline: 3px solid ${isCheapest ? "#16a34a" : "#374151"}; outline-offset: 2px;` : ""}
      `;
      el.innerHTML = isCheapest ? "⭐" : "🌯";
      el.title = loc.name;
      el.addEventListener("click", () => onSelectLocation(loc.id));

      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([loc.lng, loc.lat])
        .setPopup(
          new maplibregl.Popup({ offset: 20 }).setHTML(
            `<div style="font-family:sans-serif;padding:4px 2px">
              <strong>${loc.name}</strong><br/>
              <span style="color:#16a34a;font-weight:700">$${loc.price.toFixed(2)}</span>
              ${isCheapest ? ' <span style="color:#b45309">⭐ Cheapest</span>' : ""}
            </div>`
          )
        )
        .addTo(map);

      markersRef.current[loc.id] = marker;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locations, cheapestId, selectedId]);

  // ── Fly to selected ───────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedId === null) return;
    const loc = locations.find((l) => l.id === selectedId);
    if (!loc) return;
    map.flyTo({ center: [loc.lng, loc.lat], zoom: 14, duration: 900 });
  }, [selectedId, locations]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
