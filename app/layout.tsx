import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Revenue Leak Report | Breezy",
  description: "See exactly how much money your business is losing by not being available 24/7. Free revenue analysis for local service businesses.",
  keywords: ["revenue leak", "missed calls", "after hours", "local business", "plumber", "electrician", "HVAC", "service business"],
  authors: [{ name: "Breezy" }],
  openGraph: {
    title: "Revenue Leak Report | Breezy",
    description: "See exactly how much money your business is losing by not being available 24/7.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0a0e1a] text-white">
        {children}
      </body>
    </html>
  );
}
