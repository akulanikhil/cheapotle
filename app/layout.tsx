import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cheapotle 🌯 — Find the Cheapest Chipotle Near You",
  description: "Compare Chipotle chicken bowl prices at nearby locations on a live map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full">{children}</body>
    </html>
  );
}
