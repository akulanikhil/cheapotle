import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CITIES, findCity } from "@/lib/cities";
import { fetchCityStoresWithPrices, StoreWithPrice } from "@/lib/seo-data";
import WhyPricesVary from "@/app/components/WhyPricesVary";

export const revalidate = 3600;

export async function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.city, state: c.state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; state: string }>;
}): Promise<Metadata> {
  const { city, state } = await params;
  const cfg = findCity(city, state);
  if (!cfg) return {};

  const title = `Cheapest Chipotle in ${cfg.displayCity}, ${cfg.displayState} (${new Date().getFullYear()} Prices)`;
  const description = `Compare real-time chicken bowl prices at every Chipotle in ${cfg.displayCity}, ${cfg.displayState}. Find the cheapest location and save money on your next order.`;
  const url = `https://cheapotle.akula.me/cheapest-chipotle/${city}/${state}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Cheapotle",
      type: "website",
    },
  };
}

function PriceTable({ stores }: { stores: StoreWithPrice[] }) {
  const withPrices = stores.filter((s) => s.price !== null);
  const cheapest = withPrices[0];

  if (withPrices.length === 0) {
    return (
      <p className="text-gray-500 text-sm mt-4">
        Price data is temporarily unavailable. Check back soon.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto mt-6 rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Location</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Address</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-700">Bowl Price</th>
            <th className="text-right px-4 py-3 font-semibold text-gray-700">Delivery</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store, i) => {
            const isCheapest = store.id === cheapest?.id;
            return (
              <tr
                key={store.id}
                className={`border-b border-gray-100 last:border-0 ${
                  isCheapest ? "bg-green-50" : i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">
                    {isCheapest && (
                      <span className="inline-block mr-1.5 text-green-600 font-bold">⭐</span>
                    )}
                    {store.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(store.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#2563eb] transition-colors"
                  >
                    {store.address.split(",")[0]}
                  </a>
                </td>
                <td className="px-4 py-3 text-right">
                  {store.price !== null ? (
                    <span
                      className={`font-bold ${isCheapest ? "text-green-600" : "text-gray-900"}`}
                    >
                      ${store.price.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-gray-500">
                  {store.deliveryPrice !== null ? (
                    <span>${store.deliveryPrice.toFixed(2)}</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string; state: string }>;
}) {
  const { city, state } = await params;
  const cfg = findCity(city, state);
  if (!cfg) notFound();

  const stores = await fetchCityStoresWithPrices(cfg.lat, cfg.lng);
  const cheapest = stores.find((s) => s.price !== null);
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-[#2563eb] font-bold text-lg hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, letterSpacing: "0.03em" }}
          >
            Cheapotle
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-500">
            {cfg.displayCity}, {cfg.displayState}
          </span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="mb-2">
          <h1
            className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 800, letterSpacing: "0.02em" }}
          >
            Cheapest Chipotle in {cfg.displayCity}, {cfg.displayState}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">{year} Chicken Bowl Prices — Updated Hourly</p>
        </div>

        {cheapest && cheapest.price !== null && (
          <div className="mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <span className="text-green-600 font-bold text-lg">${cheapest.price.toFixed(2)}</span>
            <span className="text-gray-600 text-sm">
              — lowest price at{" "}
              <strong>{cheapest.address.split(",")[0]}</strong>
            </span>
          </div>
        )}

        {/* Price table */}
        <PriceTable stores={stores} />

        {/* CTA */}
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#2563eb] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#1d4ed8] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Find Cheapest Near Me (Live Map)
          </Link>
          <Link
            href="/cheapest-chipotle-near-me"
            className="text-sm text-gray-500 hover:text-[#2563eb] transition-colors"
          >
            Use my location instead →
          </Link>
        </div>

        {/* Nearby cities */}
        {cfg.nearby.length > 0 && (
          <section className="mt-10">
            <h2
              className="text-lg font-bold text-gray-800 mb-3"
              style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700 }}
            >
              Compare Nearby Cities
            </h2>
            <div className="flex flex-wrap gap-2">
              {cfg.nearby.map((n) => (
                <Link
                  key={`${n.city}-${n.state}`}
                  href={`/cheapest-chipotle/${n.city}/${n.state}`}
                  className="inline-flex items-center gap-1 border border-gray-200 rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-[#2563eb] hover:text-[#2563eb] transition-colors bg-white"
                >
                  {n.displayCity}, {n.displayState}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All cities */}
        <section className="mt-8">
          <h2
            className="text-lg font-bold text-gray-800 mb-3"
            style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700 }}
          >
            Browse Other Cities
          </h2>
          <div className="flex flex-wrap gap-2">
            {CITIES.filter((c) => !(c.city === cfg.city && c.state === cfg.state)).map((c) => (
              <Link
                key={`${c.city}-${c.state}`}
                href={`/cheapest-chipotle/${c.city}/${c.state}`}
                className="inline-flex items-center border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-600 hover:border-[#2563eb] hover:text-[#2563eb] transition-colors bg-white"
              >
                {c.displayCity}, {c.displayState}
              </Link>
            ))}
          </div>
        </section>

        <WhyPricesVary />
      </div>
    </main>
  );
}
