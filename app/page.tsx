"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { StoreLocation } from "@/app/api/stores/route";
import { PriceData } from "@/app/api/price/[storeId]/route";
import { haversineDistance } from "@/lib/haversine";
import LocationCard from "./components/LocationCard";
import SearchBar from "./components/SearchBar";
import type { MapHandle } from "./components/Map";

const ChipotleMap = dynamic(() => import("./components/Map"), { ssr: false });

type SortMode = "price" | "distance";
type AppStatus = "idle" | "locating" | "loading" | "success" | "error";

export default function Home() {
  // ── Core state ────────────────────────────────────────────────────────────
  const [appStatus, setAppStatus] = useState<AppStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // User's physical position (blue dot on map)
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  // The lat/lng of the latest successful store search (may differ from user pos)
  const [searchLat, setSearchLat] = useState<number | null>(null);
  const [searchLng, setSearchLng] = useState<number | null>(null);

  // Stores + prices (separate so locations render immediately)
  const [stores, setStores] = useState<StoreLocation[]>([]);
  const [prices, setPrices] = useState<Record<number, PriceData>>({});
  const [loadingPriceIds, setLoadingPriceIds] = useState<Set<number>>(new Set());

  // UI
  const [sortMode, setSortMode] = useState<SortMode>("price");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showSearchAreaButton, setShowSearchAreaButton] = useState(false);
  const [cachedAt, setCachedAt] = useState<number | null>(null);
  const [minutesAgo, setMinutesAgo] = useState(0);

  const mapRef = useRef<MapHandle>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // ── "Updated X min ago" ticker ────────────────────────────────────────────
  useEffect(() => {
    if (!cachedAt) return;
    const tick = () => setMinutesAgo(Math.floor((Date.now() - cachedAt) / 60_000));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [cachedAt]);

  // ── Scroll selected card into view ────────────────────────────────────────
  useEffect(() => {
    if (selectedId === null) return;
    const el = cardRefs.current.get(selectedId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  // ── Progressive price fetching ────────────────────────────────────────────
  const fetchPrice = useCallback(async (storeId: number) => {
    try {
      const res = await fetch(`/api/price/${storeId}`);
      if (!res.ok) return;
      const data: PriceData = await res.json();
      if (!data.isLive) {
        // Store has no online ordering — remove it entirely
        setStores((prev) => prev.filter((s) => s.id !== storeId));
        return;
      }
      setPrices((prev) => ({ ...prev, [storeId]: data }));
    } finally {
      setLoadingPriceIds((prev) => {
        const next = new Set(prev);
        next.delete(storeId);
        return next;
      });
    }
  }, []);

  const fetchPricesProgressively = useCallback(
    async (storeList: StoreLocation[], refLat: number, refLng: number) => {
      // Sort by distance from reference point
      const sorted = [...storeList].sort(
        (a, b) =>
          haversineDistance(refLat, refLng, a.lat, a.lng) -
          haversineDistance(refLat, refLng, b.lat, b.lng)
      );

      // Mark all as loading
      setLoadingPriceIds(new Set(sorted.map((s) => s.id)));

      // First batch: 10 closest — fetch in parallel
      const first = sorted.slice(0, 10);
      const rest = sorted.slice(10);

      await Promise.allSettled(first.map((s) => fetchPrice(s.id)));

      // Remaining in parallel
      if (rest.length > 0) {
        await Promise.allSettled(rest.map((s) => fetchPrice(s.id)));
      }
    },
    [fetchPrice]
  );

  // ── Store search ──────────────────────────────────────────────────────────
  const searchStores = useCallback(
    async (lat: number, lng: number) => {
      setAppStatus("loading");
      setShowSearchAreaButton(false);
      setSelectedId(null);
      setPrices({});

      try {
        const res = await fetch(`/api/stores?lat=${lat}&lng=${lng}`);
        if (res.status === 404) {
          setErrorMsg("No Chipotle locations found in this area.");
          setAppStatus("error");
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const storeList: StoreLocation[] = data.stores;

        setStores(storeList);
        setSearchLat(lat);
        setSearchLng(lng);
        setCachedAt(Date.now());
        setAppStatus("success");

        // Fly map to search point
        mapRef.current?.flyTo(lat, lng, 12);

        // Start progressive price fetching (non-blocking)
        fetchPricesProgressively(storeList, lat, lng);
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to fetch locations. Please try again.");
        setAppStatus("error");
      }
    },
    [fetchPricesProgressively]
  );

  // ── Get user GPS location ─────────────────────────────────────────────────
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
        searchStores(coords.latitude, coords.longitude);
      },
      () => {
        setErrorMsg("Location access denied. Please allow location or search manually.");
        setAppStatus("error");
      }
    );
  }

  // ── Address search ────────────────────────────────────────────────────────
  function handleAddressSearch(lat: number, lng: number) {
    // If we don't have a user position yet, use search point as the reference
    if (!userLat || !userLng) {
      setUserLat(lat);
      setUserLng(lng);
    }
    searchStores(lat, lng);
  }

  // ── Map move detection ────────────────────────────────────────────────────
  const handleMoveEnd = useCallback(
    (lat: number, lng: number) => {
      if (appStatus !== "success" || !searchLat || !searchLng) return;
      // Show "Search this area" if map moved > ~0.5 miles from last search
      const dist = haversineDistance(lat, lng, searchLat, searchLng);
      setShowSearchAreaButton(dist > 0.5);
    },
    [appStatus, searchLat, searchLng]
  );

  const handleSearchArea = useCallback(() => {
    const map = mapRef.current as MapHandle & { _center?: { lat: number; lng: number } };
    // We get the center from the last moveEnd event stored via a ref
    if (mapCenterRef.current) {
      const { lat, lng } = mapCenterRef.current;
      if (!userLat || !userLng) {
        setUserLat(lat);
        setUserLng(lng);
      }
      searchStores(lat, lng);
    }
  }, [searchStores, userLat, userLng]);

  // Store the latest map center so handleSearchArea can use it
  const mapCenterRef = useRef<{ lat: number; lng: number } | null>(null);
  const handleMoveEndWithRef = useCallback(
    (lat: number, lng: number) => {
      mapCenterRef.current = { lat, lng };
      handleMoveEnd(lat, lng);
    },
    [handleMoveEnd]
  );

  // ── Derived data ──────────────────────────────────────────────────────────
  const refLat = userLat ?? searchLat ?? 0;
  const refLng = userLng ?? searchLng ?? 0;

  const storesWithDistance = useMemo(
    () =>
      stores.map((s) => ({
        ...s,
        distance: haversineDistance(refLat, refLng, s.lat, s.lng),
      })),
    [stores, refLat, refLng]
  );

  const sorted = useMemo(() => {
    const withPrices = storesWithDistance.filter((s) => prices[s.id]);
    const withoutPrices = storesWithDistance.filter((s) => !prices[s.id]);

    // Sort whichever subset has prices, put unpriced at bottom
    const sortedPriced = [...withPrices].sort((a, b) =>
      sortMode === "price"
        ? prices[a.id].price - prices[b.id].price
        : a.distance - b.distance
    );
    const sortedUnpriced = [...withoutPrices].sort((a, b) => a.distance - b.distance);

    return [...sortedPriced, ...sortedUnpriced];
  }, [storesWithDistance, prices, sortMode]);

  const cheapestId = useMemo(() => {
    const priced = sorted.filter((s) => prices[s.id]?.isLive);
    if (!priced.length) return -1;
    return priced.reduce((min, s) =>
      prices[s.id].price < prices[min].price ? s.id : min,
      priced[0].id
    );
  }, [sorted, prices]);

  const isLiveData = Object.values(prices).some((p) => p.isLive);
  const isBusy = appStatus === "locating" || appStatus === "loading";

  return (
    <div className="flex flex-col h-screen bg-[#faf8f5] overflow-hidden">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="shrink-0 bg-[#3d1500] text-white px-4 py-3 shadow-md z-20">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xl">🌯</span>
            <span className="font-bold text-base leading-none tracking-tight">Cheapotle</span>
          </div>

          {/* Search bar */}
          <div className="flex-1 min-w-0">
            <SearchBar onSearch={handleAddressSearch} disabled={isBusy} />
          </div>

          {/* Location button / status */}
          <div className="shrink-0">
            {appStatus === "success" ? (
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2.5 py-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLiveData ? "bg-green-400 animate-pulse" : "bg-yellow-400"
                  }`}
                />
                <span className="text-xs font-medium text-white/90 hidden sm:block">
                  {isLiveData ? "Live" : "Est."}
                </span>
              </div>
            ) : (
              <button
                onClick={handleGetLocation}
                disabled={isBusy}
                className="flex items-center gap-1.5 bg-white text-[#3d1500] text-xs font-semibold px-3 py-2 rounded-full shadow transition hover:bg-red-50 disabled:opacity-60 whitespace-nowrap"
              >
                {isBusy ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {appStatus === "locating" ? "Locating…" : "Loading…"}
                  </>
                ) : (
                  <>
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Near me
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Idle splash ─────────────────────────────────────────────────────── */}
      {appStatus === "idle" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 text-center">
          <div className="text-7xl">🌯</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Find the Cheapest Chipotle</h2>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">
              Search any city or ZIP code above, or use your current location.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGetLocation}
              className="flex items-center justify-center gap-2 bg-[#3d1500] hover:bg-[#5a1f00] text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-colors text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use My Location
            </button>
            <div className="text-sm text-gray-400 flex items-center justify-center">or search above ↑</div>
          </div>
        </div>
      )}

      {/* ── Loading ───────────────────────────────────────────────────────────── */}
      {isBusy && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-red-100 border-t-[#3d1500] animate-spin" />
            <span className="absolute inset-0 flex items-center justify-center text-2xl">🌯</span>
          </div>
          <p className="text-gray-600 text-sm font-medium">
            {appStatus === "locating" ? "Getting your location…" : "Finding nearby Chipotles…"}
          </p>
        </div>
      )}

      {/* ── Error ─────────────────────────────────────────────────────────────── */}
      {appStatus === "error" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="text-5xl">😕</div>
          <p className="text-red-600 font-medium text-sm max-w-xs">{errorMsg}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleGetLocation}
              className="bg-[#3d1500] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#5a1f00] transition-colors"
            >
              Try My Location
            </button>
            <button
              onClick={() => setAppStatus("idle")}
              className="border border-gray-300 text-gray-600 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              Search Instead
            </button>
          </div>
        </div>
      )}

      {/* ── Main layout ──────────────────────────────────────────────────────── */}
      {appStatus === "success" && userLat !== null && userLng !== null && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Map */}
          <div className="shrink-0" style={{ height: "50vh" }}>
            <ChipotleMap
              ref={mapRef}
              userLat={userLat}
              userLng={userLng}
              stores={stores}
              prices={prices}
              cheapestId={cheapestId}
              selectedId={selectedId}
              onSelectStore={(id) => setSelectedId((prev) => (prev === id ? null : id))}
              onMoveEnd={handleMoveEndWithRef}
              showSearchAreaButton={showSearchAreaButton}
              onSearchArea={handleSearchArea}
            />
          </div>

          {/* Sort + meta bar */}
          <div className="shrink-0 px-4 pt-3 pb-2 flex items-center justify-between bg-[#faf8f5] border-t border-gray-100">
            <div className="flex flex-col">
              <p className="text-xs text-gray-500 font-medium">
                {stores.length} locations
                {loadingPriceIds.size > 0 && (
                  <span className="text-gray-400">
                    {" · "}
                    <span className="inline-flex items-center gap-1">
                      <svg className="animate-spin h-3 w-3 text-[#3d1500]" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Loading {loadingPriceIds.size} prices
                    </span>
                  </span>
                )}
              </p>
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
                  {mode === "price" ? "By Price" : "By Distance"}
                </button>
              ))}
            </div>
          </div>

          {/* Card list */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
            {sorted.map((store, index) => (
              <div
                key={store.id}
                ref={(el) => { if (el) cardRefs.current.set(store.id, el); }}
              >
                <LocationCard
                  store={store}
                  price={prices[store.id]}
                  priceLoading={loadingPriceIds.has(store.id)}
                  distance={store.distance}
                  rank={index + 1}
                  isCheapest={store.id === cheapestId}
                  isSelected={selectedId === store.id}
                  onClick={() => setSelectedId((prev) => (prev === store.id ? null : store.id))}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
