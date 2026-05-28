import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listMockListingsByStatus } from "@/data/listings";
import {
  applyListingFilters,
  isFilterStateEmpty,
  parseListingFilters,
} from "@/lib/listing-filters";
import { ListingCard } from "@/components/listings/listing-card";
import { DirectoryFilters } from "@/components/listings/directory-filters";

export const metadata: Metadata = {
  title: "Browse homestays",
  description:
    "Trustworthy local homestays in Malaysia. Browse by state, capacity, price, and Muslim-friendly or family-friendly details.",
};

interface ListingsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const resolved = await searchParams;
  const filters = parseListingFilters(resolved);
  const published = listMockListingsByStatus("published");
  const results = applyListingFilters(published, filters);
  const totalPublished = published.length;

  return (
    <main className="min-h-screen">
      <header className="border-b border-stone bg-paper">
        <div className="mx-auto flex w-full max-w-public items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-lg font-medium tracking-tight text-ink">
              MyHomestay
            </span>
            <span className="rounded-full bg-rice px-2 py-0.5 text-xs font-medium text-muted-ink">
              Beta
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link
              href="/listings"
              className="text-ink underline-offset-4 hover:underline"
            >
              Browse stays
            </Link>
            <Link
              href="/"
              className="hidden text-muted-ink hover:text-ink sm:inline"
            >
              For owners
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto w-full max-w-public px-4 pt-10 pb-6 sm:px-6 sm:pt-14 sm:pb-8">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-ink">
          Public directory · Malaysia
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Browse homestays
        </h1>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-ink">
          Calm, trustworthy listings from local owners. Continue with the
          owner directly on WhatsApp once a stay looks right for you.
        </p>
      </section>

      <section className="mx-auto w-full max-w-public px-4 pb-6 sm:px-6">
        <Suspense
          fallback={
            <div className="rounded-card border border-stone bg-white p-4 text-sm text-muted-ink sm:p-5">
              Loading filters…
            </div>
          }
        >
          <DirectoryFilters />
        </Suspense>
      </section>

      <section className="mx-auto w-full max-w-public px-4 pb-16 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 pb-4 pt-2 text-sm text-muted-ink">
          <p>
            <span className="font-medium text-ink">
              {results.length}
            </span>{" "}
            of {totalPublished} listing{totalPublished === 1 ? "" : "s"}
            {!isFilterStateEmpty(filters) && " match your filters"}
          </p>
          {!isFilterStateEmpty(filters) && (
            <Link
              href="/listings"
              className="text-leaf hover:text-deep-leaf"
            >
              Clear filters
            </Link>
          )}
        </div>

        {results.length === 0 ? (
          <div className="rounded-card border border-dashed border-stone bg-white p-6 text-center sm:p-10">
            <h2 className="font-display text-xl text-ink">
              No listings match
            </h2>
            <p className="mt-2 text-sm text-muted-ink">
              Try widening your filters, or browse all listings to see what is
              currently available.
            </p>
            <Link
              href="/listings"
              className="mt-5 inline-flex items-center justify-center rounded-control bg-leaf px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-deep-leaf"
            >
              Show all listings
            </Link>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((listing) => (
              <li key={listing.id} className="flex">
                <div className="flex flex-1">
                  <ListingCard listing={listing} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="border-t border-stone bg-paper">
        <div className="mx-auto flex w-full max-w-public flex-col gap-2 px-4 py-8 text-xs text-muted-ink sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            <span className="font-display text-sm text-ink">
              MyHomestay
            </span>
            {" · "}
            Owner-first homestay platform for Malaysia.
          </p>
          <p>Public directory · Beta</p>
        </div>
      </footer>
    </main>
  );
}
