import { MetadataRoute } from "next";
import { CITIES } from "@/lib/cities";

const BASE_URL = "https://cheapotle.akula.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const cityPages: MetadataRoute.Sitemap = CITIES.map((c) => ({
    url: `${BASE_URL}/cheapest-chipotle/${c.city}/${c.state}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/cheapest-chipotle-near-me`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...cityPages,
  ];
}
