export interface CityConfig {
  city: string;         // URL slug, e.g. "new-york"
  state: string;        // URL slug, e.g. "ny"
  displayCity: string;  // e.g. "New York"
  displayState: string; // e.g. "NY"
  lat: number;
  lng: number;
  nearby: Array<{ city: string; state: string; displayCity: string; displayState: string }>;
}

export const CITIES: CityConfig[] = [
  {
    city: "lexington", state: "ky",
    displayCity: "Lexington", displayState: "KY",
    lat: 38.0406, lng: -84.5037,
    nearby: [
      { city: "louisville", state: "ky", displayCity: "Louisville", displayState: "KY" },
      { city: "columbus", state: "oh", displayCity: "Columbus", displayState: "OH" },
    ],
  },
  {
    city: "louisville", state: "ky",
    displayCity: "Louisville", displayState: "KY",
    lat: 38.2527, lng: -85.7585,
    nearby: [
      { city: "lexington", state: "ky", displayCity: "Lexington", displayState: "KY" },
      { city: "columbus", state: "oh", displayCity: "Columbus", displayState: "OH" },
    ],
  },
  {
    city: "new-york", state: "ny",
    displayCity: "New York", displayState: "NY",
    lat: 40.7128, lng: -74.0060,
    nearby: [],
  },
  {
    city: "los-angeles", state: "ca",
    displayCity: "Los Angeles", displayState: "CA",
    lat: 34.0522, lng: -118.2437,
    nearby: [],
  },
  {
    city: "chicago", state: "il",
    displayCity: "Chicago", displayState: "IL",
    lat: 41.8781, lng: -87.6298,
    nearby: [],
  },
  {
    city: "austin", state: "tx",
    displayCity: "Austin", displayState: "TX",
    lat: 30.2672, lng: -97.7431,
    nearby: [],
  },
  {
    city: "columbus", state: "oh",
    displayCity: "Columbus", displayState: "OH",
    lat: 39.9612, lng: -82.9988,
    nearby: [
      { city: "lexington", state: "ky", displayCity: "Lexington", displayState: "KY" },
      { city: "ann-arbor", state: "mi", displayCity: "Ann Arbor", displayState: "MI" },
    ],
  },
  {
    city: "ann-arbor", state: "mi",
    displayCity: "Ann Arbor", displayState: "MI",
    lat: 42.2808, lng: -83.7430,
    nearby: [
      { city: "chicago", state: "il", displayCity: "Chicago", displayState: "IL" },
      { city: "columbus", state: "oh", displayCity: "Columbus", displayState: "OH" },
    ],
  },
];

export function findCity(city: string, state: string): CityConfig | undefined {
  return CITIES.find((c) => c.city === city && c.state === state);
}
