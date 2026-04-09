import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Chipotle API — key is embedded publicly in orderweb-cdn.chipotle.com/js/app.js
// ─────────────────────────────────────────────────────────────────────────────

const BASE = "https://services.chipotle.com";
const KEY = "b4d9f36380184a3788857063bce25d6a";

const HEADERS = {
  "Ocp-Apim-Subscription-Key": KEY,
  "Content-Type": "application/json",
  Origin: "https://chipotle.com",
  Referer: "https://chipotle.com/order",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
};

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface PriceResult {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  deliveryPrice: number;
  image: string;
  isLive: boolean;
}

interface ChipotleStore {
  restaurantNumber: number;
  restaurantName: string;
  addresses?: Array<{
    addressLine1: string;
    locality: string;
    administrativeArea: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  }>;
}

// ─────────────────────────────────────────────────────────────────────────────
// In-memory cache keyed by rounded lat/lng (2 decimal places) — 5 min TTL
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1_000;

interface CacheEntry {
  results: PriceResult[];
  cachedAt: number;
}

const cache = new Map<string, CacheEntry>();

function cacheKey(lat: number, lng: number) {
  return `${lat.toFixed(2)},${lng.toFixed(2)}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Rotating placeholder images (one per store, wraps around)
// ─────────────────────────────────────────────────────────────────────────────

const IMAGES = [
  "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
  "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&q=80",
  "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
  "https://images.unsplash.com/photo-1640423396498-82a3ac46fbd5?w=400&q=80",
];

// ─────────────────────────────────────────────────────────────────────────────
// Step 1 — Find nearby Chipotle locations
// ─────────────────────────────────────────────────────────────────────────────

async function fetchNearbyStores(
  lat: number,
  lng: number,
  limit = 15
): Promise<ChipotleStore[]> {
  const res = await fetch(`${BASE}/restaurant/v3/restaurant`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      latitude: lat,
      longitude: lng,
      radius: 9999, // miles — API filters by distance server-side
      pageSize: limit,
      pageIndex: 0,
      embeds: { addressTypes: ["MAIN"] },
    }),
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Restaurant search HTTP ${res.status}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  return (data?.data ?? []) as ChipotleStore[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 2 — Fetch Chicken Bowl price for a single store
// ─────────────────────────────────────────────────────────────────────────────

async function fetchChickenBowlPrice(
  storeId: number
): Promise<{ price: number; deliveryPrice: number } | null> {
  const url = `${BASE}/menuinnovation/v1/restaurants/${storeId}/onlinemenu?channelId=web&includeUnavailableItems=false`;

  const res = await fetch(url, {
    headers: HEADERS,
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });

  if (!res.ok) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const menu: any = await res.json();
  const entrees: unknown[] = menu?.entrees ?? [];

  for (const item of entrees as never[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = item as any;
    const name: string = e?.itemName ?? "";
    const type: string = e?.itemType ?? "";

    if (/chicken bowl/i.test(name) || (/chicken/i.test(name) && /bowl/i.test(type))) {
      const price = Number(e?.unitPrice ?? 0);
      const deliveryPrice = Number(e?.unitDeliveryPrice ?? price);
      if (price > 0) return { price, deliveryPrice };
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 3 — Combine store info + price for one location
// ─────────────────────────────────────────────────────────────────────────────

async function buildStoreResult(
  store: ChipotleStore,
  index: number
): Promise<PriceResult | null> {
  const addr = store.addresses?.[0];
  if (!addr?.latitude || !addr?.longitude) return null;

  const addressStr = [
    addr.addressLine1,
    addr.locality,
    addr.administrativeArea,
    addr.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  let price = 8.45; // sensible fallback
  let deliveryPrice = 11.0;
  let isLive = false;

  try {
    const priceData = await fetchChickenBowlPrice(store.restaurantNumber);
    if (priceData) {
      price = priceData.price;
      deliveryPrice = priceData.deliveryPrice;
      isLive = true;
    }
  } catch {
    // silent fallback — store still appears with approximate price
  }

  return {
    id: store.restaurantNumber,
    name: `Chipotle – ${store.restaurantName}`,
    address: addressStr,
    lat: addr.latitude,
    lng: addr.longitude,
    price,
    deliveryPrice,
    image: IMAGES[index % IMAGES.length],
    isLive,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Route handler — GET /api/prices?lat=XX&lng=YY
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "lat and lng query params are required" },
      { status: 400 }
    );
  }

  const key = cacheKey(lat, lng);
  const now = Date.now();
  const hit = cache.get(key);

  if (hit && now - hit.cachedAt < CACHE_TTL_MS) {
    return NextResponse.json({ results: hit.results, cachedAt: hit.cachedAt, fromCache: true });
  }

  try {
    // 1. Find nearby stores
    const stores = await fetchNearbyStores(lat, lng);

    if (stores.length === 0) {
      return NextResponse.json(
        { error: "No Chipotle locations found near these coordinates." },
        { status: 404 }
      );
    }

    // 2. Fetch all prices in parallel
    const settled = await Promise.allSettled(
      stores.map((store, i) => buildStoreResult(store, i))
    );

    const results: PriceResult[] = settled
      .filter(
        (r): r is PromiseFulfilledResult<PriceResult> =>
          r.status === "fulfilled" && r.value !== null
      )
      .map((r) => r.value);

    // 3. Cache + return
    const entry: CacheEntry = { results, cachedAt: now };
    cache.set(key, entry);

    return NextResponse.json({ results, cachedAt: now, fromCache: false });
  } catch (err) {
    console.error("[/api/prices]", err);
    return NextResponse.json({ error: "Failed to fetch locations." }, { status: 500 });
  }
}
