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
  // ── Original 8 ──────────────────────────────────────────────────────────────
  {
    city: "new-york", state: "ny",
    displayCity: "New York", displayState: "NY",
    lat: 40.7128, lng: -74.0060,
    nearby: [
      { city: "philadelphia", state: "pa", displayCity: "Philadelphia", displayState: "PA" },
      { city: "boston", state: "ma", displayCity: "Boston", displayState: "MA" },
      { city: "buffalo", state: "ny", displayCity: "Buffalo", displayState: "NY" },
    ],
  },
  {
    city: "los-angeles", state: "ca",
    displayCity: "Los Angeles", displayState: "CA",
    lat: 34.0522, lng: -118.2437,
    nearby: [
      { city: "san-diego", state: "ca", displayCity: "San Diego", displayState: "CA" },
      { city: "san-francisco", state: "ca", displayCity: "San Francisco", displayState: "CA" },
      { city: "las-vegas", state: "nv", displayCity: "Las Vegas", displayState: "NV" },
    ],
  },
  {
    city: "chicago", state: "il",
    displayCity: "Chicago", displayState: "IL",
    lat: 41.8781, lng: -87.6298,
    nearby: [
      { city: "milwaukee", state: "wi", displayCity: "Milwaukee", displayState: "WI" },
      { city: "indianapolis", state: "in", displayCity: "Indianapolis", displayState: "IN" },
      { city: "madison", state: "wi", displayCity: "Madison", displayState: "WI" },
    ],
  },
  {
    city: "austin", state: "tx",
    displayCity: "Austin", displayState: "TX",
    lat: 30.2672, lng: -97.7431,
    nearby: [
      { city: "houston", state: "tx", displayCity: "Houston", displayState: "TX" },
      { city: "san-antonio", state: "tx", displayCity: "San Antonio", displayState: "TX" },
      { city: "dallas", state: "tx", displayCity: "Dallas", displayState: "TX" },
    ],
  },
  {
    city: "columbus", state: "oh",
    displayCity: "Columbus", displayState: "OH",
    lat: 39.9612, lng: -82.9988,
    nearby: [
      { city: "lexington", state: "ky", displayCity: "Lexington", displayState: "KY" },
      { city: "cincinnati", state: "oh", displayCity: "Cincinnati", displayState: "OH" },
      { city: "cleveland", state: "oh", displayCity: "Cleveland", displayState: "OH" },
      { city: "ann-arbor", state: "mi", displayCity: "Ann Arbor", displayState: "MI" },
    ],
  },
  {
    city: "lexington", state: "ky",
    displayCity: "Lexington", displayState: "KY",
    lat: 38.0406, lng: -84.5037,
    nearby: [
      { city: "louisville", state: "ky", displayCity: "Louisville", displayState: "KY" },
      { city: "columbus", state: "oh", displayCity: "Columbus", displayState: "OH" },
      { city: "cincinnati", state: "oh", displayCity: "Cincinnati", displayState: "OH" },
    ],
  },
  {
    city: "louisville", state: "ky",
    displayCity: "Louisville", displayState: "KY",
    lat: 38.2527, lng: -85.7585,
    nearby: [
      { city: "lexington", state: "ky", displayCity: "Lexington", displayState: "KY" },
      { city: "indianapolis", state: "in", displayCity: "Indianapolis", displayState: "IN" },
      { city: "nashville", state: "tn", displayCity: "Nashville", displayState: "TN" },
    ],
  },
  {
    city: "ann-arbor", state: "mi",
    displayCity: "Ann Arbor", displayState: "MI",
    lat: 42.2808, lng: -83.7430,
    nearby: [
      { city: "detroit", state: "mi", displayCity: "Detroit", displayState: "MI" },
      { city: "columbus", state: "oh", displayCity: "Columbus", displayState: "OH" },
      { city: "chicago", state: "il", displayCity: "Chicago", displayState: "IL" },
    ],
  },

  // ── Top 50 by population / Chipotle density ──────────────────────────────
  {
    city: "houston", state: "tx",
    displayCity: "Houston", displayState: "TX",
    lat: 29.7604, lng: -95.3698,
    nearby: [
      { city: "san-antonio", state: "tx", displayCity: "San Antonio", displayState: "TX" },
      { city: "dallas", state: "tx", displayCity: "Dallas", displayState: "TX" },
      { city: "austin", state: "tx", displayCity: "Austin", displayState: "TX" },
      { city: "baton-rouge", state: "la", displayCity: "Baton Rouge", displayState: "LA" },
    ],
  },
  {
    city: "phoenix", state: "az",
    displayCity: "Phoenix", displayState: "AZ",
    lat: 33.4484, lng: -112.0740,
    nearby: [
      { city: "tucson", state: "az", displayCity: "Tucson", displayState: "AZ" },
      { city: "las-vegas", state: "nv", displayCity: "Las Vegas", displayState: "NV" },
      { city: "albuquerque", state: "nm", displayCity: "Albuquerque", displayState: "NM" },
    ],
  },
  {
    city: "philadelphia", state: "pa",
    displayCity: "Philadelphia", displayState: "PA",
    lat: 39.9526, lng: -75.1652,
    nearby: [
      { city: "new-york", state: "ny", displayCity: "New York", displayState: "NY" },
      { city: "baltimore", state: "md", displayCity: "Baltimore", displayState: "MD" },
      { city: "pittsburgh", state: "pa", displayCity: "Pittsburgh", displayState: "PA" },
    ],
  },
  {
    city: "san-antonio", state: "tx",
    displayCity: "San Antonio", displayState: "TX",
    lat: 29.4241, lng: -98.4936,
    nearby: [
      { city: "houston", state: "tx", displayCity: "Houston", displayState: "TX" },
      { city: "austin", state: "tx", displayCity: "Austin", displayState: "TX" },
      { city: "dallas", state: "tx", displayCity: "Dallas", displayState: "TX" },
    ],
  },
  {
    city: "san-diego", state: "ca",
    displayCity: "San Diego", displayState: "CA",
    lat: 32.7157, lng: -117.1611,
    nearby: [
      { city: "los-angeles", state: "ca", displayCity: "Los Angeles", displayState: "CA" },
      { city: "san-jose", state: "ca", displayCity: "San Jose", displayState: "CA" },
    ],
  },
  {
    city: "dallas", state: "tx",
    displayCity: "Dallas", displayState: "TX",
    lat: 32.7767, lng: -96.7970,
    nearby: [
      { city: "fort-worth", state: "tx", displayCity: "Fort Worth", displayState: "TX" },
      { city: "houston", state: "tx", displayCity: "Houston", displayState: "TX" },
      { city: "austin", state: "tx", displayCity: "Austin", displayState: "TX" },
      { city: "oklahoma-city", state: "ok", displayCity: "Oklahoma City", displayState: "OK" },
    ],
  },
  {
    city: "san-jose", state: "ca",
    displayCity: "San Jose", displayState: "CA",
    lat: 37.3382, lng: -121.8863,
    nearby: [
      { city: "san-francisco", state: "ca", displayCity: "San Francisco", displayState: "CA" },
      { city: "los-angeles", state: "ca", displayCity: "Los Angeles", displayState: "CA" },
      { city: "sacramento", state: "ca", displayCity: "Sacramento", displayState: "CA" },
    ],
  },
  {
    city: "jacksonville", state: "fl",
    displayCity: "Jacksonville", displayState: "FL",
    lat: 30.3322, lng: -81.6557,
    nearby: [
      { city: "orlando", state: "fl", displayCity: "Orlando", displayState: "FL" },
      { city: "tampa", state: "fl", displayCity: "Tampa", displayState: "FL" },
      { city: "gainesville", state: "fl", displayCity: "Gainesville", displayState: "FL" },
    ],
  },
  {
    city: "fort-worth", state: "tx",
    displayCity: "Fort Worth", displayState: "TX",
    lat: 32.7555, lng: -97.3308,
    nearby: [
      { city: "dallas", state: "tx", displayCity: "Dallas", displayState: "TX" },
      { city: "houston", state: "tx", displayCity: "Houston", displayState: "TX" },
      { city: "austin", state: "tx", displayCity: "Austin", displayState: "TX" },
    ],
  },
  {
    city: "charlotte", state: "nc",
    displayCity: "Charlotte", displayState: "NC",
    lat: 35.2271, lng: -80.8431,
    nearby: [
      { city: "raleigh", state: "nc", displayCity: "Raleigh", displayState: "NC" },
      { city: "durham", state: "nc", displayCity: "Durham", displayState: "NC" },
      { city: "atlanta", state: "ga", displayCity: "Atlanta", displayState: "GA" },
    ],
  },
  {
    city: "indianapolis", state: "in",
    displayCity: "Indianapolis", displayState: "IN",
    lat: 39.7684, lng: -86.1581,
    nearby: [
      { city: "louisville", state: "ky", displayCity: "Louisville", displayState: "KY" },
      { city: "columbus", state: "oh", displayCity: "Columbus", displayState: "OH" },
      { city: "cincinnati", state: "oh", displayCity: "Cincinnati", displayState: "OH" },
      { city: "chicago", state: "il", displayCity: "Chicago", displayState: "IL" },
    ],
  },
  {
    city: "san-francisco", state: "ca",
    displayCity: "San Francisco", displayState: "CA",
    lat: 37.7749, lng: -122.4194,
    nearby: [
      { city: "san-jose", state: "ca", displayCity: "San Jose", displayState: "CA" },
      { city: "sacramento", state: "ca", displayCity: "Sacramento", displayState: "CA" },
      { city: "los-angeles", state: "ca", displayCity: "Los Angeles", displayState: "CA" },
    ],
  },
  {
    city: "seattle", state: "wa",
    displayCity: "Seattle", displayState: "WA",
    lat: 47.6062, lng: -122.3321,
    nearby: [
      { city: "portland", state: "or", displayCity: "Portland", displayState: "OR" },
    ],
  },
  {
    city: "denver", state: "co",
    displayCity: "Denver", displayState: "CO",
    lat: 39.7392, lng: -104.9903,
    nearby: [
      { city: "colorado-springs", state: "co", displayCity: "Colorado Springs", displayState: "CO" },
      { city: "salt-lake-city", state: "ut", displayCity: "Salt Lake City", displayState: "UT" },
      { city: "albuquerque", state: "nm", displayCity: "Albuquerque", displayState: "NM" },
    ],
  },
  {
    city: "nashville", state: "tn",
    displayCity: "Nashville", displayState: "TN",
    lat: 36.1627, lng: -86.7816,
    nearby: [
      { city: "memphis", state: "tn", displayCity: "Memphis", displayState: "TN" },
      { city: "knoxville", state: "tn", displayCity: "Knoxville", displayState: "TN" },
      { city: "louisville", state: "ky", displayCity: "Louisville", displayState: "KY" },
      { city: "atlanta", state: "ga", displayCity: "Atlanta", displayState: "GA" },
    ],
  },
  {
    city: "oklahoma-city", state: "ok",
    displayCity: "Oklahoma City", displayState: "OK",
    lat: 35.4676, lng: -97.5164,
    nearby: [
      { city: "dallas", state: "tx", displayCity: "Dallas", displayState: "TX" },
      { city: "kansas-city", state: "mo", displayCity: "Kansas City", displayState: "MO" },
      { city: "tulsa", state: "ok", displayCity: "Tulsa", displayState: "OK" },
    ],
  },
  {
    city: "boston", state: "ma",
    displayCity: "Boston", displayState: "MA",
    lat: 42.3601, lng: -71.0589,
    nearby: [
      { city: "new-york", state: "ny", displayCity: "New York", displayState: "NY" },
      { city: "providence", state: "ri", displayCity: "Providence", displayState: "RI" },
      { city: "hartford", state: "ct", displayCity: "Hartford", displayState: "CT" },
    ],
  },
  {
    city: "portland", state: "or",
    displayCity: "Portland", displayState: "OR",
    lat: 45.5152, lng: -122.6784,
    nearby: [
      { city: "seattle", state: "wa", displayCity: "Seattle", displayState: "WA" },
      { city: "eugene", state: "or", displayCity: "Eugene", displayState: "OR" },
    ],
  },
  {
    city: "las-vegas", state: "nv",
    displayCity: "Las Vegas", displayState: "NV",
    lat: 36.1699, lng: -115.1398,
    nearby: [
      { city: "phoenix", state: "az", displayCity: "Phoenix", displayState: "AZ" },
      { city: "los-angeles", state: "ca", displayCity: "Los Angeles", displayState: "CA" },
      { city: "salt-lake-city", state: "ut", displayCity: "Salt Lake City", displayState: "UT" },
    ],
  },
  {
    city: "memphis", state: "tn",
    displayCity: "Memphis", displayState: "TN",
    lat: 35.1495, lng: -90.0490,
    nearby: [
      { city: "nashville", state: "tn", displayCity: "Nashville", displayState: "TN" },
      { city: "new-orleans", state: "la", displayCity: "New Orleans", displayState: "LA" },
      { city: "birmingham", state: "al", displayCity: "Birmingham", displayState: "AL" },
    ],
  },
  {
    city: "baltimore", state: "md",
    displayCity: "Baltimore", displayState: "MD",
    lat: 39.2904, lng: -76.6122,
    nearby: [
      { city: "philadelphia", state: "pa", displayCity: "Philadelphia", displayState: "PA" },
      { city: "richmond", state: "va", displayCity: "Richmond", displayState: "VA" },
      { city: "pittsburgh", state: "pa", displayCity: "Pittsburgh", displayState: "PA" },
    ],
  },
  {
    city: "milwaukee", state: "wi",
    displayCity: "Milwaukee", displayState: "WI",
    lat: 43.0389, lng: -87.9065,
    nearby: [
      { city: "chicago", state: "il", displayCity: "Chicago", displayState: "IL" },
      { city: "madison", state: "wi", displayCity: "Madison", displayState: "WI" },
      { city: "minneapolis", state: "mn", displayCity: "Minneapolis", displayState: "MN" },
    ],
  },
  {
    city: "albuquerque", state: "nm",
    displayCity: "Albuquerque", displayState: "NM",
    lat: 35.0853, lng: -106.6056,
    nearby: [
      { city: "phoenix", state: "az", displayCity: "Phoenix", displayState: "AZ" },
      { city: "tucson", state: "az", displayCity: "Tucson", displayState: "AZ" },
      { city: "denver", state: "co", displayCity: "Denver", displayState: "CO" },
    ],
  },
  {
    city: "tucson", state: "az",
    displayCity: "Tucson", displayState: "AZ",
    lat: 32.2226, lng: -110.9747,
    nearby: [
      { city: "phoenix", state: "az", displayCity: "Phoenix", displayState: "AZ" },
      { city: "albuquerque", state: "nm", displayCity: "Albuquerque", displayState: "NM" },
    ],
  },
  {
    city: "fresno", state: "ca",
    displayCity: "Fresno", displayState: "CA",
    lat: 36.7378, lng: -119.7871,
    nearby: [
      { city: "sacramento", state: "ca", displayCity: "Sacramento", displayState: "CA" },
      { city: "los-angeles", state: "ca", displayCity: "Los Angeles", displayState: "CA" },
      { city: "san-francisco", state: "ca", displayCity: "San Francisco", displayState: "CA" },
    ],
  },
  {
    city: "sacramento", state: "ca",
    displayCity: "Sacramento", displayState: "CA",
    lat: 38.5816, lng: -121.4944,
    nearby: [
      { city: "san-francisco", state: "ca", displayCity: "San Francisco", displayState: "CA" },
      { city: "san-jose", state: "ca", displayCity: "San Jose", displayState: "CA" },
      { city: "fresno", state: "ca", displayCity: "Fresno", displayState: "CA" },
    ],
  },
  {
    city: "kansas-city", state: "mo",
    displayCity: "Kansas City", displayState: "MO",
    lat: 39.0997, lng: -94.5786,
    nearby: [
      { city: "st-louis", state: "mo", displayCity: "St. Louis", displayState: "MO" },
      { city: "omaha", state: "ne", displayCity: "Omaha", displayState: "NE" },
      { city: "oklahoma-city", state: "ok", displayCity: "Oklahoma City", displayState: "OK" },
    ],
  },
  {
    city: "atlanta", state: "ga",
    displayCity: "Atlanta", displayState: "GA",
    lat: 33.7490, lng: -84.3880,
    nearby: [
      { city: "charlotte", state: "nc", displayCity: "Charlotte", displayState: "NC" },
      { city: "nashville", state: "tn", displayCity: "Nashville", displayState: "TN" },
      { city: "athens", state: "ga", displayCity: "Athens", displayState: "GA" },
      { city: "birmingham", state: "al", displayCity: "Birmingham", displayState: "AL" },
    ],
  },
  {
    city: "omaha", state: "ne",
    displayCity: "Omaha", displayState: "NE",
    lat: 41.2565, lng: -95.9345,
    nearby: [
      { city: "kansas-city", state: "mo", displayCity: "Kansas City", displayState: "MO" },
      { city: "minneapolis", state: "mn", displayCity: "Minneapolis", displayState: "MN" },
    ],
  },
  {
    city: "colorado-springs", state: "co",
    displayCity: "Colorado Springs", displayState: "CO",
    lat: 38.8339, lng: -104.8214,
    nearby: [
      { city: "denver", state: "co", displayCity: "Denver", displayState: "CO" },
      { city: "albuquerque", state: "nm", displayCity: "Albuquerque", displayState: "NM" },
    ],
  },
  {
    city: "raleigh", state: "nc",
    displayCity: "Raleigh", displayState: "NC",
    lat: 35.7796, lng: -78.6382,
    nearby: [
      { city: "durham", state: "nc", displayCity: "Durham", displayState: "NC" },
      { city: "charlotte", state: "nc", displayCity: "Charlotte", displayState: "NC" },
      { city: "richmond", state: "va", displayCity: "Richmond", displayState: "VA" },
    ],
  },
  {
    city: "minneapolis", state: "mn",
    displayCity: "Minneapolis", displayState: "MN",
    lat: 44.9778, lng: -93.2650,
    nearby: [
      { city: "milwaukee", state: "wi", displayCity: "Milwaukee", displayState: "WI" },
      { city: "madison", state: "wi", displayCity: "Madison", displayState: "WI" },
      { city: "omaha", state: "ne", displayCity: "Omaha", displayState: "NE" },
    ],
  },
  {
    city: "tampa", state: "fl",
    displayCity: "Tampa", displayState: "FL",
    lat: 27.9506, lng: -82.4572,
    nearby: [
      { city: "orlando", state: "fl", displayCity: "Orlando", displayState: "FL" },
      { city: "jacksonville", state: "fl", displayCity: "Jacksonville", displayState: "FL" },
      { city: "miami", state: "fl", displayCity: "Miami", displayState: "FL" },
    ],
  },
  {
    city: "new-orleans", state: "la",
    displayCity: "New Orleans", displayState: "LA",
    lat: 29.9511, lng: -90.0715,
    nearby: [
      { city: "baton-rouge", state: "la", displayCity: "Baton Rouge", displayState: "LA" },
      { city: "houston", state: "tx", displayCity: "Houston", displayState: "TX" },
      { city: "memphis", state: "tn", displayCity: "Memphis", displayState: "TN" },
    ],
  },
  {
    city: "cleveland", state: "oh",
    displayCity: "Cleveland", displayState: "OH",
    lat: 41.4993, lng: -81.6944,
    nearby: [
      { city: "pittsburgh", state: "pa", displayCity: "Pittsburgh", displayState: "PA" },
      { city: "columbus", state: "oh", displayCity: "Columbus", displayState: "OH" },
      { city: "cincinnati", state: "oh", displayCity: "Cincinnati", displayState: "OH" },
      { city: "buffalo", state: "ny", displayCity: "Buffalo", displayState: "NY" },
    ],
  },
  {
    city: "miami", state: "fl",
    displayCity: "Miami", displayState: "FL",
    lat: 25.7617, lng: -80.1918,
    nearby: [
      { city: "tampa", state: "fl", displayCity: "Tampa", displayState: "FL" },
      { city: "orlando", state: "fl", displayCity: "Orlando", displayState: "FL" },
    ],
  },
  {
    city: "orlando", state: "fl",
    displayCity: "Orlando", displayState: "FL",
    lat: 28.5383, lng: -81.3792,
    nearby: [
      { city: "tampa", state: "fl", displayCity: "Tampa", displayState: "FL" },
      { city: "jacksonville", state: "fl", displayCity: "Jacksonville", displayState: "FL" },
      { city: "miami", state: "fl", displayCity: "Miami", displayState: "FL" },
      { city: "gainesville", state: "fl", displayCity: "Gainesville", displayState: "FL" },
    ],
  },
  {
    city: "pittsburgh", state: "pa",
    displayCity: "Pittsburgh", displayState: "PA",
    lat: 40.4406, lng: -79.9959,
    nearby: [
      { city: "cleveland", state: "oh", displayCity: "Cleveland", displayState: "OH" },
      { city: "philadelphia", state: "pa", displayCity: "Philadelphia", displayState: "PA" },
      { city: "buffalo", state: "ny", displayCity: "Buffalo", displayState: "NY" },
    ],
  },
  {
    city: "cincinnati", state: "oh",
    displayCity: "Cincinnati", displayState: "OH",
    lat: 39.1031, lng: -84.5120,
    nearby: [
      { city: "columbus", state: "oh", displayCity: "Columbus", displayState: "OH" },
      { city: "lexington", state: "ky", displayCity: "Lexington", displayState: "KY" },
      { city: "louisville", state: "ky", displayCity: "Louisville", displayState: "KY" },
      { city: "indianapolis", state: "in", displayCity: "Indianapolis", displayState: "IN" },
    ],
  },
  {
    city: "detroit", state: "mi",
    displayCity: "Detroit", displayState: "MI",
    lat: 42.3314, lng: -83.0458,
    nearby: [
      { city: "ann-arbor", state: "mi", displayCity: "Ann Arbor", displayState: "MI" },
      { city: "cleveland", state: "oh", displayCity: "Cleveland", displayState: "OH" },
      { city: "columbus", state: "oh", displayCity: "Columbus", displayState: "OH" },
    ],
  },
  {
    city: "st-louis", state: "mo",
    displayCity: "St. Louis", displayState: "MO",
    lat: 38.6270, lng: -90.1994,
    nearby: [
      { city: "kansas-city", state: "mo", displayCity: "Kansas City", displayState: "MO" },
      { city: "cincinnati", state: "oh", displayCity: "Cincinnati", displayState: "OH" },
      { city: "nashville", state: "tn", displayCity: "Nashville", displayState: "TN" },
    ],
  },
  {
    city: "salt-lake-city", state: "ut",
    displayCity: "Salt Lake City", displayState: "UT",
    lat: 40.7608, lng: -111.8910,
    nearby: [
      { city: "denver", state: "co", displayCity: "Denver", displayState: "CO" },
      { city: "las-vegas", state: "nv", displayCity: "Las Vegas", displayState: "NV" },
    ],
  },
  {
    city: "durham", state: "nc",
    displayCity: "Durham", displayState: "NC",
    lat: 35.9940, lng: -78.8986,
    nearby: [
      { city: "raleigh", state: "nc", displayCity: "Raleigh", displayState: "NC" },
      { city: "charlotte", state: "nc", displayCity: "Charlotte", displayState: "NC" },
      { city: "chapel-hill", state: "nc", displayCity: "Chapel Hill", displayState: "NC" },
    ],
  },
  {
    city: "buffalo", state: "ny",
    displayCity: "Buffalo", displayState: "NY",
    lat: 42.8864, lng: -78.8784,
    nearby: [
      { city: "cleveland", state: "oh", displayCity: "Cleveland", displayState: "OH" },
      { city: "pittsburgh", state: "pa", displayCity: "Pittsburgh", displayState: "PA" },
      { city: "new-york", state: "ny", displayCity: "New York", displayState: "NY" },
    ],
  },
  {
    city: "richmond", state: "va",
    displayCity: "Richmond", displayState: "VA",
    lat: 37.5407, lng: -77.4360,
    nearby: [
      { city: "baltimore", state: "md", displayCity: "Baltimore", displayState: "MD" },
      { city: "raleigh", state: "nc", displayCity: "Raleigh", displayState: "NC" },
      { city: "charlotte", state: "nc", displayCity: "Charlotte", displayState: "NC" },
    ],
  },
  {
    city: "madison", state: "wi",
    displayCity: "Madison", displayState: "WI",
    lat: 43.0731, lng: -89.4012,
    nearby: [
      { city: "milwaukee", state: "wi", displayCity: "Milwaukee", displayState: "WI" },
      { city: "chicago", state: "il", displayCity: "Chicago", displayState: "IL" },
      { city: "minneapolis", state: "mn", displayCity: "Minneapolis", displayState: "MN" },
    ],
  },
  {
    city: "baton-rouge", state: "la",
    displayCity: "Baton Rouge", displayState: "LA",
    lat: 30.4515, lng: -91.1871,
    nearby: [
      { city: "new-orleans", state: "la", displayCity: "New Orleans", displayState: "LA" },
      { city: "houston", state: "tx", displayCity: "Houston", displayState: "TX" },
    ],
  },
  {
    city: "knoxville", state: "tn",
    displayCity: "Knoxville", displayState: "TN",
    lat: 35.9606, lng: -83.9207,
    nearby: [
      { city: "nashville", state: "tn", displayCity: "Nashville", displayState: "TN" },
      { city: "memphis", state: "tn", displayCity: "Memphis", displayState: "TN" },
      { city: "charlotte", state: "nc", displayCity: "Charlotte", displayState: "NC" },
    ],
  },
  {
    city: "gainesville", state: "fl",
    displayCity: "Gainesville", displayState: "FL",
    lat: 29.6516, lng: -82.3248,
    nearby: [
      { city: "jacksonville", state: "fl", displayCity: "Jacksonville", displayState: "FL" },
      { city: "orlando", state: "fl", displayCity: "Orlando", displayState: "FL" },
      { city: "tampa", state: "fl", displayCity: "Tampa", displayState: "FL" },
    ],
  },
  {
    city: "athens", state: "ga",
    displayCity: "Athens", displayState: "GA",
    lat: 33.9519, lng: -83.3576,
    nearby: [
      { city: "atlanta", state: "ga", displayCity: "Atlanta", displayState: "GA" },
      { city: "charlotte", state: "nc", displayCity: "Charlotte", displayState: "NC" },
    ],
  },
  {
    city: "tulsa", state: "ok",
    displayCity: "Tulsa", displayState: "OK",
    lat: 36.1540, lng: -95.9928,
    nearby: [
      { city: "oklahoma-city", state: "ok", displayCity: "Oklahoma City", displayState: "OK" },
      { city: "kansas-city", state: "mo", displayCity: "Kansas City", displayState: "MO" },
    ],
  },
  {
    city: "birmingham", state: "al",
    displayCity: "Birmingham", displayState: "AL",
    lat: 33.5186, lng: -86.8104,
    nearby: [
      { city: "nashville", state: "tn", displayCity: "Nashville", displayState: "TN" },
      { city: "atlanta", state: "ga", displayCity: "Atlanta", displayState: "GA" },
      { city: "memphis", state: "tn", displayCity: "Memphis", displayState: "TN" },
    ],
  },
  {
    city: "providence", state: "ri",
    displayCity: "Providence", displayState: "RI",
    lat: 41.8240, lng: -71.4128,
    nearby: [
      { city: "boston", state: "ma", displayCity: "Boston", displayState: "MA" },
      { city: "hartford", state: "ct", displayCity: "Hartford", displayState: "CT" },
      { city: "new-york", state: "ny", displayCity: "New York", displayState: "NY" },
    ],
  },
  {
    city: "hartford", state: "ct",
    displayCity: "Hartford", displayState: "CT",
    lat: 41.7658, lng: -72.6851,
    nearby: [
      { city: "boston", state: "ma", displayCity: "Boston", displayState: "MA" },
      { city: "providence", state: "ri", displayCity: "Providence", displayState: "RI" },
      { city: "new-york", state: "ny", displayCity: "New York", displayState: "NY" },
    ],
  },
  {
    city: "chapel-hill", state: "nc",
    displayCity: "Chapel Hill", displayState: "NC",
    lat: 35.9132, lng: -79.0558,
    nearby: [
      { city: "durham", state: "nc", displayCity: "Durham", displayState: "NC" },
      { city: "raleigh", state: "nc", displayCity: "Raleigh", displayState: "NC" },
      { city: "charlotte", state: "nc", displayCity: "Charlotte", displayState: "NC" },
    ],
  },
  {
    city: "eugene", state: "or",
    displayCity: "Eugene", displayState: "OR",
    lat: 44.0521, lng: -123.0868,
    nearby: [
      { city: "portland", state: "or", displayCity: "Portland", displayState: "OR" },
      { city: "seattle", state: "wa", displayCity: "Seattle", displayState: "WA" },
    ],
  },
];

export function findCity(city: string, state: string): CityConfig | undefined {
  return CITIES.find((c) => c.city === city && c.state === state);
}
