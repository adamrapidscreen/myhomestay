import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyHomestay — Homestay Directory",
  description: "Browse local homestays and contact owners directly via WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-soft-border">
          <nav className="max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">
            <a href="/" className="relative flex h-10 w-48 items-center gap-2 overflow-visible">
              <Image
                src="/images/logo.png"
                alt="MyHomestay"
                width={420}
                height={120}
                className="absolute left-0 top-1/2 h-44 w-auto -translate-y-1/2"
                priority
              />
            </a>
            <a
              href="/directory"
              className="text-sm font-medium text-muted hover:text-primary px-4 py-2 rounded-lg hover:bg-primary/5 transition-all"
            >
              Browse Homestays
            </a>
          </nav>
        </header>

        {/* Main content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="w-full border-t border-soft-border bg-white/50">
          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-muted">
              MyHomestay — Find your perfect homestay
            </span>
            <span className="text-xs text-muted/60">
              Made with care for homestay lovers
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
