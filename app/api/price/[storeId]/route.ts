import { NextResponse } from "next/server";

const BASE = "https://services.chipotle.com";
const KEY = "b4d9f36380184a3788857063bce25d6a";
const HEADERS = {
  "Ocp-Apim-Subscription-Key": KEY,
  Origin: "https://chipotle.com",
  Referer: "https://chipotle.com/order",
};

export interface PriceData {
  price: number;
  deliveryPrice: number;
  isLive: boolean;
}

const CACHE_TTL = 5 * 60 * 1_000;
const cache = new Map<number, { data: PriceData; ts: number }>();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId: rawId } = await params;
  const storeId = parseInt(rawId, 10);

  if (isNaN(storeId)) {
    return NextResponse.json({ error: "Invalid store ID" }, { status: 400 });
  }

  const hit = cache.get(storeId);
  if (hit && Date.now() - hit.ts < CACHE_TTL) {
    return NextResponse.json({ ...hit.data, fromCache: true });
  }

  try {
    const res = await fetch(
      `${BASE}/menuinnovation/v1/restaurants/${storeId}/onlinemenu?channelId=web&includeUnavailableItems=false`,
      { headers: HEADERS, signal: AbortSignal.timeout(10_000), cache: "no-store" }
    );

    if (!res.ok) {
      return NextResponse.json({ price: 8.45, deliveryPrice: 11.0, isLive: false });
    }

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

        // price === 0 means the store doesn't support online ordering
        if (price > 0) {
          const data: PriceData = { price, deliveryPrice, isLive: true };
          cache.set(storeId, { data, ts: Date.now() });
          return NextResponse.json(data);
        }
        break;
      }
    }

    // Found the item but price was 0, or item not found
    return NextResponse.json({ price: 8.45, deliveryPrice: 11.0, isLive: false });
  } catch {
    return NextResponse.json({ price: 8.45, deliveryPrice: 11.0, isLive: false });
  }
}
