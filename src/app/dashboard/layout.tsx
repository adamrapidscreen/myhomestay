import type { Metadata } from "next";
import Link from "next/link";
import { getMockCurrentOwner } from "@/data/owners";
import { listListingsByOwner } from "@/server/owner-store";

export const metadata: Metadata = {
  title: {
    default: "Owner dashboard",
    template: "%s · Owner dashboard · MyHomestay",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const owner = getMockCurrentOwner();
  const listings = listListingsByOwner(owner.id);
  const usedFreeListings = listings.length;

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-stone bg-paper">
        <div className="mx-auto flex w-full max-w-public flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-lg font-medium tracking-tight text-ink">
              MyHomestay
            </span>
            <span className="rounded-full bg-rice px-2 py-0.5 text-xs font-medium text-muted-ink">
              Owner
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-ink">
              <span className="font-medium text-ink">{owner.displayName}</span>
              <span className="mx-2 text-stone">·</span>
              {usedFreeListings} of 3 free listings
            </span>
            <Link
              href="/dashboard/listings/new"
              className="inline-flex items-center justify-center rounded-control bg-leaf px-3 py-1.5 text-sm font-medium text-paper hover:bg-deep-leaf"
            >
              + New listing
            </Link>
          </div>
        </div>
        <nav className="border-t border-stone">
          <div className="mx-auto flex w-full max-w-public gap-1 overflow-x-auto px-4 sm:px-6">
            <DashboardNavLink href="/dashboard" label="Listings" />
            <DashboardNavLink href="/dashboard/onboarding" label="Profile" />
            <DashboardNavLink href="/listings" label="Public site" external />
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-public px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t border-stone bg-paper">
        <div className="mx-auto flex w-full max-w-public flex-col gap-2 px-4 py-6 text-xs text-muted-ink sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            Owner workspace · Mock data session. Changes reset when the dev server restarts.
          </p>
          <p>MyHomestay Beta</p>
        </div>
      </footer>
    </div>
  );
}

function DashboardNavLink({
  href,
  label,
  external,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      className="border-b-2 border-transparent px-3 py-3 text-sm text-muted-ink hover:border-stone hover:text-ink"
    >
      {label}
      {external && <span aria-hidden className="ml-1">↗</span>}
    </Link>
  );
}
