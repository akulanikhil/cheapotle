export default function WhyPricesVary() {
  return (
    <section className="bg-gray-50 border border-gray-200 rounded-xl p-6 mt-8">
      <h2
        className="text-xl font-bold mb-3 text-gray-900"
        style={{ fontFamily: "var(--font-barlow-condensed)", fontWeight: 700, letterSpacing: "0.02em" }}
      >
        Why Do Chipotle Prices Vary by Location?
      </h2>
      <div className="space-y-2 text-sm text-gray-600 leading-relaxed">
        <p>
          Chipotle sets prices at the individual restaurant level — meaning the same chicken bowl can
          cost anywhere from <strong>$8 to $12+</strong> depending on where you order it.
        </p>
        <p>
          The biggest factors driving price differences are <strong>local rent and real estate costs</strong>,
          the overall cost of living in the area, local wage laws (minimum wage varies significantly
          by city and state), and competitive pressure from nearby restaurants.
        </p>
        <p>
          Downtown locations in high-rent markets like Manhattan or San Francisco typically charge
          a dollar or two more than suburban or college-town locations. If you&apos;re flexible about
          which Chipotle you visit, checking prices across nearby locations can lead to real savings —
          especially on repeat orders.
        </p>
      </div>
    </section>
  );
}
