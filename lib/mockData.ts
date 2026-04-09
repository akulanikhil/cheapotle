// Static location metadata — real Lexington KY Chipotle stores.
// Prices are fetched live from /api/prices (Chipotle API), not stored here.

export interface ChipotleLocation {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  deliveryPrice?: number;
  image: string;
  isLive?: boolean;
}

// Used as instant fallback while API loads or if it fails entirely
export const FALLBACK_LOCATIONS: ChipotleLocation[] = [
  {
    id: 499,
    name: "Chipotle – UK Campus",
    address: "345 S Limestone, Lexington, KY 40508",
    lat: 38.0282,
    lng: -84.5012,
    price: 8.45,
    deliveryPrice: 11.00,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
  },
  {
    id: 545,
    name: "Chipotle – Hamburg Place",
    address: "1869 Plaudit Pl Ste 140, Lexington, KY 40509",
    lat: 38.0135,
    lng: -84.4397,
    price: 8.45,
    deliveryPrice: 11.00,
    image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&q=80",
  },
  {
    id: 572,
    name: "Chipotle – Richmond Rd",
    address: "2905 Richmond Rd, Lexington, KY 40509",
    lat: 38.0224,
    lng: -84.4616,
    price: 8.45,
    deliveryPrice: 11.00,
    image: "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&q=80",
  },
  {
    id: 2429,
    name: "Chipotle – Fayette Mall",
    address: "3565 Nicholasville Rd, Lexington, KY 40503",
    lat: 38.0019,
    lng: -84.5198,
    price: 8.45,
    deliveryPrice: 11.00,
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80",
  },
  {
    id: 4132,
    name: "Chipotle – Leestown Rd",
    address: "1584 Leestown Rd, Lexington, KY 40511",
    lat: 38.0571,
    lng: -84.5346,
    price: 8.45,
    deliveryPrice: 11.00,
    image: "https://images.unsplash.com/photo-1640423396498-82a3ac46fbd5?w=400&q=80",
  },
  {
    id: 4923,
    name: "Chipotle – War Admiral",
    address: "2212 War Admiral Way, Lexington, KY 40509",
    lat: 38.0098,
    lng: -84.4301,
    price: 8.45,
    deliveryPrice: 11.00,
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=80",
  },
];
