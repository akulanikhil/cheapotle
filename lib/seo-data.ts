const BASE = "https://services.chipotle.com";
const KEY = "b4d9f36380184a3788857063bce25d6a";
const HEADERS = {
  "Ocp-Apim-Subscription-Key": KEY,
  "Content-Type": "application/json",
  Origin: "https://chipotle.com",
  Referer: "https://chipotle.com/order",
};

export interface StoreWithPrice {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  price: number | null;
  deliveryPrice: number | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseStore(s: any): StoreWithPrice | null {
  if (s?.restaurantStatus !== "OPEN") return null;
  const addr = s?.addresses?.[0];
  if (!addr?.latitude || !addr?.longitude) return null;

  const addressStr = [
    addr.addressLine1,
    addr.locality,
    addr.administrativeArea,
    addr.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    id: s.restaurantNumber,
    name: `Chipotle – ${s.restaurantName}`,
    address: addressStr,
    lat: addr.latitude,
    lng: addr.longitude,
    price: null,
    deliveryPrice: null,
  };
}

async function fetchNearbyStores(lat: number, lng: number): Promise<StoreWithPrice[]> {
  const res = await fetch(`${BASE}/restaurant/v3/restaurant`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      latitude: lat,
      longitude: lng,
      radius: 9999,
      pageSize: 20,
      pageIndex: 0,
      embeds: { addressTypes: ["MAIN"] },
    }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  const stores: StoreWithPrice[] = (data?.data ?? [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((s: any) => parseStore(s))
    .filter(Boolean) as StoreWithPrice[];

  return stores;
}

function matchesChickenBowl(itemName: string, itemType: string): boolean {
  const n = itemName.toLowerCase();
  const t = itemType.toLowerCase();
  const isBowl = n.includes("bowl") || t.includes("bowl");
  return n.includes("chicken") && isBowl;
}

async function fetchChickenBowlPrice(
  storeId: number
): Promise<{ price: number; deliveryPrice: number } | null> {
  try {
    const res = await fetch(
      `${BASE}/menuinnovation/v1/restaurants/${storeId}/onlinemenu?channelId=web&includeUnavailableItems=false`,
      {
        headers: { "Ocp-Apim-Subscription-Key": KEY, Origin: "https://chipotle.com", Referer: "https://chipotle.com/order" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const menu: any = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entrees: any[] = menu?.entrees ?? [];

    for (const e of entrees) {
      const name: string = e?.itemName ?? "";
      const type: string = e?.itemType ?? "";
      if (matchesChickenBowl(name, type)) {
        const price = Number(e?.unitPrice ?? 0);
        const deliveryPrice = Number(e?.unitDeliveryPrice ?? price);
        if (price > 0) return { price, deliveryPrice };
        break;
      }
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchCityStoresWithPrices(
  lat: number,
  lng: number
): Promise<StoreWithPrice[]> {
  const stores = await fetchNearbyStores(lat, lng);
  if (stores.length === 0) return [];

  const results = await Promise.allSettled(
    stores.map((s) => fetchChickenBowlPrice(s.id))
  );

  const enriched: StoreWithPrice[] = stores.map((store, i) => {
    const r = results[i];
    if (r.status === "fulfilled" && r.value) {
      return { ...store, price: r.value.price, deliveryPrice: r.value.deliveryPrice };
    }
    return store;
  });

  // Sort cheapest first (nulls last)
  enriched.sort((a, b) => {
    if (a.price === null && b.price === null) return 0;
    if (a.price === null) return 1;
    if (b.price === null) return -1;
    return a.price - b.price;
  });

  return enriched;
}
