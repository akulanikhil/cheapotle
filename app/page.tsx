"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { ChipotleLocation, FALLBACK_LOCATIONS } from "@/lib/mockData";
import { haversineDistance } from "@/lib/haversine";
import LocationCard from "./components/LocationCard";

const ChipotleMap = dynamic(() => import("./components/Map"), { ssr: false });

interface LocationResult extends ChipotleLocation {
  distance: number;
}

type SortMode = "price" | "distance";
type AppStatus = "idle" | "locating" | "fetching" | "success" | "error";

export default function Home() {
  const [appStatus, setAppStatus] = useState<AppStatus>("idle");
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locations, setLocations] = useState<ChipotleLocation[]>([]);
  const [isLiveData, setIsLiveData] = useState(false);
  const [cachedAt, setCachedAt] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("price");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [minutesAgo, setMinutesAgo] = useState(0);

  // ── Tick "updated X min ago" every minute ─────────────────────────────────
  useEffect(() => {
    if (!cachedAt) return;
    const tick = () => setMinutesAgo(Math.floor((Date.now() - cachedAt) / 60_000));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [cachedAt]);

  // ── Fetch prices from API route ───────────────────────────────────────────
  const fetchPrices = useCallback(async () => {
    setAppStatus("fetching");
    try {
      const res = await fetch("/api/prices");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const locs: ChipotleLocation[] = data.results.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (r: any) => ({
          id: r.id,
          name: r.name,
          address: r.address,
          lat: r.lat,
          lng: r.lng,
          price: r.price,
          deliveryPrice: r.deliveryPrice,
          image: r.image,
          isLive: r.isLive,
        })
      );
      setLocations(locs);
      setIsLiveData(locs.some((l) => l.isLive));
      setCachedAt(data.cachedAt);
      setAppStatus("success");
    } catch (err) {
      console.warn("Price API failed, using fallback:", err);
      setLocations(FALLBACK_LOCATIONS);
      setIsLiveData(false);
      setCachedAt(Date.now());
      setAppStatus("success"); // still show results with fallback data
    }
  }, []);

  // ── Get user location, then fetch prices ─────────────────────────────────
  function handleGetLocation() {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation is not supported by your browser.");
      setAppStatus("error");
      return;
    }
    setAppStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLat(coords.latitude);
        setUserLng(coords.longitude);
        fetchPrices();
      },
      () => {
        setErrorMsg("Location access denied. Please allow location and try again.");
        setAppStatus("error");
      }
    );
  }

  // ── Distances + sorting ───────────────────────────────────────────────────
  const results: LocationResult[] = useMemo(() => {
    if (userLat === null || userLng === null) return [];
    return locations.map((loc) => ({
      ...loc,
      distance: haversineDistance(userLat, userLng, loc.lat, loc.lng),
    }));
  }, [locations, userLat, userLng]);

  const sorted = useMemo(
    () =>
      [...results].sort((a, b) =>
        sortMode === "price" ? a.price - b.price : a.distance - b.distance
      ),
    [results, sortMode]
  );

  const cheapestId = sorted[0]?.id ?? -1;

  // ── Scroll selected card into view ────────────────────────────────────────
  useEffect(() => {
    if (selectedId === null) return;
    const el = cardRefs.current.get(selectedId);
    if (el && listRef.current) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  function handleSelectLocation(id: number) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  const isBusy = appStatus === "locating" || appStatus === "fetching";

  return (
    <div className="flex flex-col h-screen bg-[#faf8f5] overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="shrink-0 bg-[#3d1500] text-white px-5 py-3 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌯</span>
          <div>
            <h1 className="text-lg font-bold leading-none tracking-tight">Cheapotle</h1>
            <p className="text-xs text-red-200 leading-none mt-0.5">Cheapest chicken bowl near you</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live pricing badge */}
          {appStatus === "success" && (
            <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1">
              <div className={`w-1.5 h-1.5 rounded-full ${isLiveData ? "bg-green-400 animate-pulse" : "bg-yellow-400"}`} />
              <span className="text-xs font-medium text-white/90">
                {isLiveData ? "Live Pricing" : "Est. Pricing"}
              </span>
            </div>
          )}

          {appStatus !== "success" && (
            <button
              onClick={handleGetLocation}
              disabled={isBusy}
              className="flex items-center gap-1.5 bg-white text-[#3d1500] text-sm font-semibold px-4 py-2 rounded-full shadow transition hover:bg-red-50 disabled:opacity-60"
            >
              {isBusy ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {appStatus === "locating" ? "Locating…" : "Loading prices…"}
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Use My Location
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* ── Idle splash ─────────────────────────────────────────────────────── */}
      {appStatus === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="text-7xl">🌯</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Find the Cheapest Chipotle Near You</h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              We pull live chicken bowl prices from DoorDash and show you the best deal on a map.
            </p>
          </div>
          <button
            onClick={handleGetLocation}
            className="flex items-center gap-2 bg-[#3d1500] hover:bg-[#5a1f00] text-white font-semibold py-3.5 px-8 rounded-full shadow-lg transition-colors text-sm"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use My Location
          </button>
        </div>
      )}

      {/* ── Loading ──────────────────────────────────────────────────────────── */}
      {isBusy && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-red-100 border-t-[#3d1500] animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl">🌯</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">
            {appStatus === "locating" ? "Getting your location…" : "Fetching live prices from DoorDash…"}
          </p>
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────────────── */}
      {appStatus === "error" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="text-5xl">😕</div>
          <p className="text-red-600 font-medium text-sm max-w-xs">{errorMsg}</p>
          <button
            onClick={handleGetLocation}
            className="bg-[#3d1500] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#5a1f00] transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── Main (map + list) ────────────────────────────────────────────────── */}
      {appStatus === "success" && userLat !== null && userLng !== null && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Map */}
          <div className="shrink-0" style={{ height: "50vh" }}>
            <ChipotleMap
              userLat={userLat}
              userLng={userLng}
              locations={locations}
              cheapestId={cheapestId}
              selectedId={selectedId}
              onSelectLocation={handleSelectLocation}
            />
          </div>

          {/* Sort + meta bar */}
          <div className="shrink-0 px-4 pt-3 pb-2 flex items-center justify-between bg-[#faf8f5] border-t border-gray-100">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">{sorted.length} locations</p>
              {cachedAt !== null && (
                <p className="text-xs text-gray-400">
                  {minutesAgo === 0 ? "Updated just now" : `Updated ${minutesAgo}m ago`}
                </p>
              )}
            </div>
            <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg">
              {(["price", "distance"] as SortMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortMode(mode)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    sortMode === mode
                      ? "bg-[#3d1500] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Sort by {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Card list */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
            {sorted.map((loc, index) => (
              <div
                key={loc.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(loc.id, el);
                }}
              >
                <LocationCard
                  location={loc}
                  distance={loc.distance}
                  rank={index + 1}
                  isCheapest={loc.id === cheapestId}
                  isSelected={selectedId === loc.id}
                  onClick={() => handleSelectLocation(loc.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
