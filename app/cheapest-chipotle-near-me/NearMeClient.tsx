"use client";

import { useState } from "react";
import Link from "next/link";

interface StoreResult {
  id: number;
  name: string;
  address: string;
  price: number | null;
  deliveryPrice: number | null;
}

export default function NearMeClient() {
  const [status, setStatus] = useState<"idle" | "locating" | "loading" | "done" | "error">("idle");
  const [stores, setStores] = useState<StoreResult[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLocate() {
    setStatus("locating");
    setStores([]);
    setErrorMsg("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setStatus("loading");

        try {
          // Fetch stores
          const storesRes = await fetch(`/api/stores?lat=${lat}&lng=${lng}`);
          if (!storesRes.ok) throw new Error("No locations found");
          const { stores: rawStores } = await storesRes.json();

          if (!rawStores?.length) {
            setErrorMsg("No locations found near you.");
            setStatus("error");
            return;
          }

          // Fetch prices in parallel
          const priceResults = await Promise.allSettled(
            rawStores.slice(0, 10).map((s: { id: number }) =>
              fetch(`/api/price/${s.id}?protein=chicken`).then((r) => r.json())
            )
          );

          const enriched: StoreResult[] = rawStores.slice(0, 10).map(
            (s: { id: number; name: string; address: string }, i: number) => {
              const r = priceResults[i];
              const priceData = r.status === "fulfilled" ? r.value : null;
              return {
                id: s.id,
                name: s.name,
                address: s.address,
                price: priceData?.price > 0 ? priceData.price : null,
                deliveryPrice: priceData?.deliveryPrice > 0 ? priceData.deliveryPrice : null,
              };
            }
          );

          enriched.sort((a, b) => {
            if (a.price === null && b.price === null) return 0;
            if (a.price === null) return 1;
            if (b.price === null) return -1;
            return a.price - b.price;
          });

          setStores(enriched);
          setStatus("done");
        } catch {
          setErrorMsg("Failed to load prices. Please try again.");
          setStatus("error");
        }
      },
      () => {
        setErrorMsg("Location access denied. Please enable location permissions and try again.");
        setStatus("error");
      },
      { timeout: 10000 }
    );
  }

  const cheapest = stores.find((s) => s.price !== null);

  return (
    <div className="mt-6">
      {status === "idle" || status === "error" ? (
        <div className="space-y-3">
          <button
            onClick={handleLocate}
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-[#1d4ed8] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Use My Location
          </button>
          {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          <p className="text-xs text-gray-400">
            Or{" "}
            <Link href="/" className="text-[#2563eb] hover:underline">
              open the live map
            </Link>{" "}
            to compare prices interactively.
          </p>
        </div>
      ) : status === "locating" ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Getting your location…
        </div>
      ) : status === "loading" ? (
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Fetching prices…
        </div>
      ) : (
        /* done */
        <div>
          {cheapest && cheapest.price !== null && (
            <div className="mb-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
              <span className="text-green-600 font-bold text-lg">${cheapest.price.toFixed(2)}</span>
              <span className="text-gray-600 text-sm">
                — cheapest at <strong>{cheapest.address.split(",")[0]}</strong>
              </span>
            </div>
          )}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Location</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Bowl</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Delivery</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store, i) => {
                  const isCheapest = store.id === cheapest?.id;
                  return (
                    <tr
                      key={store.id}
                      className={`border-b border-gray-100 last:border-0 ${
                        isCheapest ? "bg-green-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {isCheapest && <span className="mr-1.5 text-green-600 font-bold">⭐</span>}
                          {store.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#2563eb] transition-colors"
                          >
                            {store.address.split(",")[0]}
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {store.price !== null ? (
                          <span className={`font-bold ${isCheapest ? "text-green-600" : "text-gray-900"}`}>
                            ${store.price.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500">
                        {store.deliveryPrice !== null ? (
                          <span>${store.deliveryPrice.toFixed(2)}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex gap-3">
            <Link
              href="/"
              className="text-sm text-[#2563eb] hover:underline font-medium"
            >
              Open live map →
            </Link>
            <button
              onClick={handleLocate}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Refresh prices
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
