import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { getSiteUrl } from "@/lib/supabase/env";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "MyHomestay",
    template: "%s · MyHomestay",
  },
  description:
    "Owner-first, Malaysia-first homestay platform. Help local hosts publish trustworthy stays and continue with travellers on WhatsApp.",
  openGraph: {
    title: "MyHomestay",
    description:
      "Owner-first, Malaysia-first homestay platform with direct WhatsApp booking handoff.",
    siteName: "MyHomestay",
    type: "website",
    locale: "en_MY",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
