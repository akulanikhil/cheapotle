import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Chipotle API
// Key is embedded publicly in https://orderweb-cdn.chipotle.com/js/app.js
// ─────────────────────────────────────────────────────────────────────────────

const CHIPOTLE_API = "https://services.chipotle.com";
const CHIPOTLE_KEY = "b4d9f36380184a3788857063bce25d6a";

const CHIPOTLE_HEADERS = {
  "Ocp-Apim-Subscription-Key": CHIPOTLE_KEY,
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

// ─────────────────────────────────────────────────────────────────────────────
// Lexington KY stores — restaurant numbers confirmed via Chipotle API
// Coordinates fetched from the restaurant search endpoint
// ─────────────────────────────────────────────────────────────────────────────

const LEXINGTON_STORES = [
  {
    id: 499,
    name: "Chipotle – UK Campus",
    address: "345 S Limestone, Lexington, KY 40508",
    lat: 38.0282,
    lng: -84.5012,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
  },
  {
    id: 545,
    name: "Chipotle – Hamburg Place",
    address: "1869 Plaudit Pl Ste 140, Lexington, KY 40509",
    lat: 38.0135,
    lng: -84.4397,
    image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&q=80",
  },
  {
    id: 572,
    name: "Chipotle – Richmond Rd",
    address: "2905 Richmond Rd, Lexington, KY 40509",
    lat: 38.0224,
    lng: -84.4616,
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80",
  },
  {
    id: 2429,
    name: "Chipotle – Fayette Mall",
    address: "3565 Nicholasville Rd, Lexington, KY 40503",
    lat: 38.0019,
    lng: -84.5198,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
  },
  {
    id: 4132,
    name: "Chipotle – Leestown Rd",
    address: "1584 Leestown Rd, Lexington, KY 40511",
    lat: 38.0571,
    lng: -84.5346,
    image: "https://images.unsplash.com/photo-1640423396498-82a3ac46fbd5?w=400&q=80",
  },
  {
    id: 4923,
    name: "Chipotle – War Admiral",
    address: "2212 War Admiral Way, Lexington, KY 40509",
    lat: 38.0098,
    lng: -84.4301,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// In-memory cache  (5 minute TTL)
// ─────────────────────────────────────────────────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1_000;
let cachedResults: PriceResult[] | null = null;
let cacheTimestamp = 0;

// ─────────────────────────────────────────────────────────────────────────────
// Parse Chicken Bowl price from Chipotle's menu JSON
// Response structure: { menus: [{ categories: [{ items: [{ name, unitPrice }] }] }] }
// unitPrice is in dollars (e.g. 8.45), NOT cents
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractChickenBowlPrice(menu: any): { price: number; deliveryPrice: number } | null {
  // Real structure: { entrees: [{ itemName, itemType, unitPrice, unitDeliveryPrice }] }
  // itemType === "Bowl" and itemName === "Chicken Bowl"
  const entrees: unknown[] = menu?.entrees ?? [];

  for (const item of entrees as never[]) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = item as any;
    const name: string = e?.itemName ?? e?.name ?? "";
    const type: string = e?.itemType ?? "";

    if (/chicken bowl/i.test(name) || (/chicken/i.test(name) && /bowl/i.test(type))) {
      const price = Number(e?.unitPrice ?? e?.price ?? 0);
      const deliveryPrice = Number(e?.unitDeliveryPrice ?? e?.deliveryPrice ?? price);
      if (price > 0) return { price, deliveryPrice };
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fetch menu for one store
// ─────────────────────────────────────────────────────────────────────────────

async function fetchStorePrice(
  storeId: number
): Promise<{ price: number; deliveryPrice: number } | null> {
  const url = `${CHIPOTLE_API}/menuinnovation/v1/restaurants/${storeId}/onlinemenu?channelId=web&includeUnavailableItems=false`;

  const res = await fetch(url, {
    headers: CHIPOTLE_HEADERS,
    signal: AbortSignal.timeout(10_000),
    next: { revalidate: 0 }, // never use Next.js fetch cache for this
  });

  if (!res.ok) {
    console.warn(`[Chipotle] store ${storeId} returned HTTP ${res.status}`);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  return extractChickenBowlPrice(data);
}

// ─────────────────────────────────────────────────────────────────────────────
// Build result list
// ─────────────────────────────────────────────────────────────────────────────

// Fallback prices (approximate, used only when API fails per-store)
const FALLBACK_PRICES: Record<number, number> = {
  499: 8.45,
  545: 8.45,
  572: 8.45,
  2429: 8.45,
  4132: 8.45,
  4923: 8.45,
};

async function buildResults(): Promise<PriceResult[]> {
  const results = await Promise.all(
    LEXINGTON_STORES.map(async (store) => {
      let priceData: { price: number; deliveryPrice: number } | null = null;
      let isLive = false;

      try {
        priceData = await fetchStorePrice(store.id);
        if (priceData) isLive = true;
      } catch (err) {
        console.warn(`[Chipotle] fetch failed for store ${store.id}:`, err);
      }

      const price = priceData?.price ?? FALLBACK_PRICES[store.id] ?? 8.45;
      const deliveryPrice = priceData?.deliveryPrice ?? price * 1.3;

      return { ...store, price, deliveryPrice, isLive };
    })
  );

  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// Route handler
// ─────────────────────────────────────────────────────────────────────────────

export async function GET() {
  const now = Date.now();

  if (cachedResults && now - cacheTimestamp < CACHE_TTL_MS) {
    return NextResponse.json({ results: cachedResults, cachedAt: cacheTimestamp, fromCache: true });
  }

  try {
    const results = await buildResults();
    cachedResults = results;
    cacheTimestamp = now;
    return NextResponse.json({ results, cachedAt: now, fromCache: false });
  } catch (err) {
    console.error("[/api/prices] Unhandled error:", err);

    // Last-resort full fallback
    const fallback: PriceResult[] = LEXINGTON_STORES.map((s) => ({
      ...s,
      price: FALLBACK_PRICES[s.id] ?? 8.45,
      deliveryPrice: (FALLBACK_PRICES[s.id] ?? 8.45) * 1.3,
      isLive: false,
    }));

    return NextResponse.json({ results: fallback, cachedAt: now, fromCache: false });
  }
}
