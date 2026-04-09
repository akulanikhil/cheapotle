import { NextResponse } from "next/server";

// Optional: set GOOGLE_PLACES_API_KEY in .env.local for real store photos.
// Without it, a deterministic food placeholder is returned — no broken images.
const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY;

const PLACEHOLDERS = [
  "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
  "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&q=80",
  "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
  "https://images.unsplash.com/photo-1640423396498-82a3ac46fbd5?w=400&q=80",
  "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=400&q=80",
  "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&q=80",
];

// In-memory image cache (store ID → URL)
const cache = new Map<number, { url: string; ts: number }>();
const CACHE_TTL = 60 * 60 * 1_000; // 1 hour — images rarely change

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeId = parseInt(searchParams.get("storeId") ?? "", 10);
  const storeName = searchParams.get("name") ?? "";
  const address = searchParams.get("address") ?? "";

  if (isNaN(storeId)) {
    return NextResponse.json({ error: "storeId required" }, { status: 400 });
  }

  // Serve from cache
  const hit = cache.get(storeId);
  if (hit && Date.now() - hit.ts < CACHE_TTL) {
    return NextResponse.json({ imageUrl: hit.url });
  }

  // No Google key → return deterministic placeholder immediately
  if (!GOOGLE_KEY) {
    const url = PLACEHOLDERS[storeId % PLACEHOLDERS.length];
    cache.set(storeId, { url, ts: Date.now() });
    return NextResponse.json({ imageUrl: url });
  }

  // Google Places: Find Place → get photo reference → proxy image
  try {
    const query = encodeURIComponent(`${storeName} ${address}`);
    const findUrl =
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
      `?input=${query}&inputtype=textquery&fields=place_id,photos&key=${GOOGLE_KEY}`;

    const findRes = await fetch(findUrl, { signal: AbortSignal.timeout(6_000) });
    if (!findRes.ok) throw new Error(`Places find HTTP ${findRes.status}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const findData: any = await findRes.json();
    const photoRef = findData?.candidates?.[0]?.photos?.[0]?.photo_reference;

    if (!photoRef) throw new Error("No photo reference");

    // Fetch the actual image and proxy it (keeps GOOGLE_KEY server-side)
    const photoUrl =
      `https://maps.googleapis.com/maps/api/place/photo` +
      `?maxwidth=400&photo_reference=${photoRef}&key=${GOOGLE_KEY}`;

    const imgRes = await fetch(photoUrl, { signal: AbortSignal.timeout(8_000) });
    if (!imgRes.ok) throw new Error(`Photo HTTP ${imgRes.status}`);

    const buf = await imgRes.arrayBuffer();
    const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";

    cache.set(storeId, { url: `data:placeholder`, ts: Date.now() }); // mark as fetched

    return new NextResponse(Buffer.from(buf), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.warn(`[store-image] store ${storeId} fell back to placeholder:`, err);
    const url = PLACEHOLDERS[storeId % PLACEHOLDERS.length];
    cache.set(storeId, { url, ts: Date.now() });
    return NextResponse.json({ imageUrl: url });
  }
}
