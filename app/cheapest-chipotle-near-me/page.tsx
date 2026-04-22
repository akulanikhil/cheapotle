import { Metadata } from "next";
import Link from "next/link";
import { CITIES } from "@/lib/cities";
import WhyPricesVary from "@/app/components/WhyPricesVary";
import NearMeClient from "./NearMeClient";

const URL = "https://cheapotle.akula.me/cheapest-chipotle-near-me";
const TITLE = "Cheapest Chipotle Near Me — Find Low Prices by Location";
const DESCRIPTION =
  "Instantly compare Chipotle chicken bowl prices at locations near you. Use your GPS to find the cheapest Chipotle in your area right now.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "Cheapotle",
    type: "website",
  },
};

export default function NearMePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link
            href="/"
            className="text-[#2563eb] font-bold text-lg hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, letterSpacing: "0.03em" }}
          >
            Cheapotle
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">Near Me</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero */}
        <h1
          className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
          style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, letterSpacing: "0.02em" }}
        >
          Find the Cheapest Chipotle Near Me
        </h1>
        <p className="text-gray-500 mt-2 text-sm max-w-xl">
          Chipotle prices differ by location — sometimes by over a dollar per bowl. Use your
          location to instantly compare every nearby Chipotle and find the best deal.
        </p>

        {/* Client geolocation component */}
        <NearMeClient />

        {/* Static city links */}
        <section className="mt-12">
          <h2
            className="text-xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700 }}
          >
            Popular Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {CITIES.map((c) => (
              <Link
                key={`${c.city}-${c.state}`}
                href={`/cheapest-chipotle/${c.city}/${c.state}`}
                className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:border-[#2563eb] hover:text-[#2563eb] transition-colors bg-white group"
              >
                <span>{c.displayCity}, {c.displayState}</span>
                <svg
                  className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#2563eb] transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </section>

        <WhyPricesVary />
      </div>

      <footer className="border-t border-gray-100 bg-white px-4 py-4 text-center mt-8">
        <p className="text-xs text-gray-400 leading-relaxed max-w-2xl mx-auto">
          This tool compares publicly available pricing data to help you find the best deal.
          Cheapotle is an independent project and is not affiliated with, endorsed by, or sponsored by any restaurant chain.
          All trademarks and brand names are the property of their respective owners.
        </p>
      </footer>
    </main>
  );
}
