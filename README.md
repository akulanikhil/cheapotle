<div align="center">

# 🌯 Cheapotle

### Find the cheapest Chipotle chicken bowl near you — with live pricing

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL_JS-396CB2?logo=mapbox&logoColor=white)](https://maplibre.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

---

## What is this?

**Cheapotle** is a web app that fetches **real, live Chipotle chicken bowl prices** from Chipotle's own API — across every location near you — and ranks them cheapest to most expensive on an interactive map.

Prices genuinely vary by location (sometimes by over **$1.50**). Cheapotle helps you find the deal before you drive.

---

## Features

- 🗺 **Live map** — MapLibre GL JS with OpenFreeMap tiles (no API key needed)
- 🔍 **Address/ZIP search** — geocode any city, address, or ZIP to find stores there
- 📍 **Your location** — browser Geolocation API, distances via Haversine formula
- 🗺 **Map-based searching** — pan the map and tap "Search this area" to find stores anywhere
- 💰 **Real pricing** — pulled server-side from `services.chipotle.com` on every request
- ⚡ **Progressive loading** — 10 closest stores priced immediately, rest load in the background
- ⭐ **Cheapest highlighted** — distinct green marker + badge on the best deal
- 🚗 **Pickup & delivery prices** — both shown per location
- 🔀 **Sort by price or distance** — toggle between the two
- 🖼 **Store photos** — food imagery for each location
- 🛡 **Graceful fallback** — estimated prices shown when API is unreachable
- 📱 **Mobile-first** — full-height layout, scrollable card list beneath the map

---

## How it works

```
Browser (Geolocation / Search)
        │
        ▼
Next.js frontend ──fetch──▶ /api/geocode     (Nominatim — address → lat/lng)
                        ──fetch──▶ /api/stores     (Chipotle restaurant search)
                                       │
                              returns ~40 stores sorted by distance
                                       │
                        ──fetch──▶ /api/price/[storeId]   (per-store, parallel)
                                       │
                             services.chipotle.com
                             /menuinnovation/v1/restaurants/{id}/onlinemenu
                                       │
                               entrees[] → "Chicken Bowl"
                               extract unitPrice + unitDeliveryPrice
                                       │
                   ◀──────────────── JSON ──────────────────
                   { price, deliveryPrice, isLive: true }
```

The subscription key is embedded publicly in Chipotle's own frontend JS bundle (`orderweb-cdn.chipotle.com/js/app.js`). No scraping, no auth, no reverse engineering.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Map | [MapLibre GL JS](https://maplibre.org) + [OpenFreeMap](https://openfreemap.org) tiles |
| Geocoding | [Nominatim](https://nominatim.org) (OpenStreetMap, free, no key) |
| Store images | Unsplash (deterministic, no key needed) |
| Language | TypeScript 5 |
| Pricing data | Chipotle's internal menu API |
| Deployment | Vercel / any Node.js host |

---

## Getting started

```bash
git clone https://github.com/akulanikhil/cheapotle.git
cd cheapotle
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and either:
- Click **Use My Location** to find stores near you, or
- Type any city, address, or ZIP code in the search bar

> **No API keys required.** The map uses [OpenFreeMap](https://openfreemap.org) (free, no signup), geocoding uses [Nominatim](https://nominatim.org) (free, no signup), and pricing uses Chipotle's public-facing menu API.

## Project structure

```
cheapotle/
├── app/
│   ├── page.tsx                      # Main UI — search, map, card list, sort
│   ├── components/
│   │   ├── Map.tsx                   # MapLibre GL map, markers, "Search this area"
│   │   ├── LocationCard.tsx          # Price card with live/cheapest badges + skeleton
│   │   └── SearchBar.tsx             # Geocoding input with loading/error states
│   └── api/
│       ├── stores/route.ts           # Dynamic Chipotle store discovery by lat/lng
│       ├── price/[storeId]/route.ts  # Per-store pricing with 5-min cache
│       └── geocode/route.ts          # Nominatim address → lat/lng wrapper
├── lib/
│   ├── images.ts                     # Centralized food image map + getStoreImage()
│   └── haversine.ts                  # Great-circle distance formula
└── README.md
```

---

## API reference

### `GET /api/stores?lat=41.88&lng=-87.63`
Returns up to ~60 Chipotle locations near a coordinate (multi-page fetch, 5-min cache).

### `GET /api/price/499`
Returns `{ price, deliveryPrice, isLive }` for a single store (5-min cache).

### `GET /api/geocode?q=Chicago+IL`
Returns `{ lat, lng, displayName }` via Nominatim (US + CA only).

---

## Finding store IDs manually

```bash
curl -s -X POST https://services.chipotle.com/restaurant/v3/restaurant \
  -H "Ocp-Apim-Subscription-Key: b4d9f36380184a3788857063bce25d6a" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": YOUR_LAT,
    "longitude": YOUR_LNG,
    "radius": 25,
    "conceptIds": ["CMG"],
    "orderBy": "distance",
    "pageSize": 20,
    "pageIndex": 0
  }' | jq '[.data[] | { id: .restaurantNumber, name: .name }]'
```

Fetch a store's menu to confirm the Chicken Bowl price:

```bash
curl -s \
  -H "Ocp-Apim-Subscription-Key: b4d9f36380184a3788857063bce25d6a" \
  -H "Origin: https://chipotle.com" \
  "https://services.chipotle.com/menuinnovation/v1/restaurants/STORE_ID/onlinemenu?channelId=web" \
  | jq '[.entrees[] | select(.itemType == "Bowl") | { name: .itemName, price: .unitPrice, delivery: .unitDeliveryPrice }]'
```

---

## Caveats

- Prices reflect **in-store pickup** from Chipotle's ordering API and may differ from walk-in menu prices.
- Delivery prices shown are from the same API and include Chipotle's own delivery surcharge.
- If Chipotle's API changes structure or blocks requests, the app falls back to approximate prices silently.
- This is an **unofficial** integration — not affiliated with or endorsed by Chipotle Mexican Grill.

---

## License

MIT — do whatever you want with it.

---

<div align="center">
  Made with ❤️ and too many chicken bowls
</div>
