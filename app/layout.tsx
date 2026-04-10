import type { Metadata } from "next";
import { Montserrat, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cheapotle — Find the Cheapest Chipotle Near You",
  description: "Compare Chipotle bowl prices at nearby locations on a live map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${montserrat.variable} ${barlowCondensed.variable}`}
    >
      <body className="h-full">{children}</body>
    </html>
  );
}
