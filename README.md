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
- 💰 **Real pricing** — pulled server-side from `services.chipotle.com` on every request
- 📍 **Your location** — browser Geolocation API, distances via Haversine formula
- ⭐ **Cheapest highlighted** — distinct green marker + badge on the best deal
- 🚗 **Pickup & delivery prices** — both shown per location
- 🔀 **Sort by price or distance** — toggle between the two
- ⚡ **5-minute server cache** — fast repeat loads, no hammering the API
- 🛡 **Graceful fallback** — hardcoded prices kick in if the API is unreachable
- 📱 **Mobile-first** — full-height layout, scrollable card list beneath the map

---

## How it works

```
Browser (Geolocation API)
        │
        ▼
Next.js frontend ──fetch──▶ /api/prices  (Next.js API Route)
                                   │
           ┌───────────────────────┼───────────────────────┐
           ▼                       ▼                       ▼
      store #499              store #545              store #572  ...
     (UK Campus)           (Hamburg Place)          (Richmond Rd)
           │                       │                       │
           └───────────────────────┴───────────────────────┘
                                   │
                     services.chipotle.com
                     /menuinnovation/v1/restaurants/{id}/onlinemenu
                                   │
                         entrees[] → find "Chicken Bowl"
                         extract unitPrice + unitDeliveryPrice
                                   │
           ◀──────────────────── JSON ──────────────────────
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
| Language | TypeScript 5 |
| Pricing data | Chipotle's internal menu API |
| Deployment | Vercel / any Node.js host |

---

## Getting started

```bash
git clone https://github.com/nikhilakula/cheapotle.git
cd cheapotle
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), click **Use My Location**, and see live prices.

> **No API keys required.** The map uses [OpenFreeMap](https://openfreemap.org) (free, no signup) and pricing uses Chipotle's public-facing menu API.

---

## Project structure

```
cheapotle/
├── app/
│   ├── page.tsx                   # Main UI — splash, map, card list, sort
│   ├── components/
│   │   ├── Map.tsx                # MapLibre GL map with custom markers
│   │   └── LocationCard.tsx       # Price card with live/cheapest badges
│   └── api/
│       └── prices/
│           └── route.ts           # Server-side Chipotle API + 5-min cache
├── lib/
│   ├── mockData.ts                # Fallback locations (Lexington, KY)
│   └── haversine.ts               # Great-circle distance formula
└── README.md
```

---

## Adding your city

Update `LEXINGTON_STORES` in `app/api/prices/route.ts` with your local store IDs. Find them using Chipotle's restaurant search API:

```bash
curl -s -X POST https://services.chipotle.com/restaurant/v3/restaurant \
  -H "Ocp-Apim-Subscription-Key: b4d9f36380184a3788857063bce25d6a" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": YOUR_LAT,
    "longitude": YOUR_LNG,
    "radius": 25,
    "restaurantStatuses": ["OPEN", "LAB"],
    "conceptIds": ["CMG"],
    "orderBy": "distance",
    "pageSize": 10,
    "pageIndex": 0
  }' | jq '[.data[] | { id: .restaurantNumber, name: .name, address: .address }]'
```

Then fetch its menu to confirm the Chicken Bowl price:

```bash
curl -s \
  -H "Ocp-Apim-Subscription-Key: b4d9f36380184a3788857063bce25d6a" \
  -H "Origin: https://chipotle.com" \
  "https://services.chipotle.com/menuinnovation/v1/restaurants/STORE_ID/onlinemenu?channelId=web" \
  | jq '[.entrees[] | select(.itemType == "Bowl") | { name: .itemName, price: .unitPrice, delivery: .unitDeliveryPrice }]'
```

---

## Deploying to Vercel

```bash
npm i -g vercel
vercel
```

The `/api/prices` route runs as a serverless function. The 5-minute in-memory cache works per-instance (good enough for personal/small traffic use).

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
