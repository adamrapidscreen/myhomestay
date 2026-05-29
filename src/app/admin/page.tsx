import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/server/auth";
import { listAllListingsForAdmin } from "@/server/admin-data";
import { signOutAction } from "@/app/login/actions";
import { LISTING_STATUS_DISPLAY } from "@/lib/listing-status-display";
import { AdminListingRow } from "@/components/admin/admin-listing-row";

export const metadata: Metadata = {
  title: "Admin review",
};

export default async function AdminPage() {
  const admin = await requireAdmin();
  const listings = await listAllListingsForAdmin();

  const counts = listings.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-stone bg-paper">
        <div className="mx-auto flex w-full max-w-public flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-lg font-medium tracking-tight text-ink">
              MyHomestay
            </span>
            <span className="rounded-full bg-danger px-2 py-0.5 text-xs font-medium text-paper">
              Admin
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="text-muted-ink">{admin.displayName}</span>
            <Link
              href="/dashboard"
              className="text-muted-ink underline-offset-4 hover:text-ink hover:underline"
            >
              Owner dashboard
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-control border border-stone bg-paper px-3 py-1.5 text-sm text-muted-ink hover:text-ink"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-public px-4 py-8 sm:px-6 sm:py-10">
        <section>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-ink">
            Moderation
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
            All listings
          </h1>
          <p className="mt-2 max-w-prose text-base leading-relaxed text-muted-ink">
            Pause a live listing, flag one for owner review, or clear a flagged
            listing back to draft. Every action is recorded.
          </p>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {(["published", "paused", "needs_review", "draft"] as const).map(
              (s) => (
                <div key={s} className="flex items-center gap-2">
                  <dt className="text-muted-ink">
                    {LISTING_STATUS_DISPLAY[s].label}
                  </dt>
                  <dd className="font-medium tabular-nums text-ink">
                    {counts[s] ?? 0}
                  </dd>
                </div>
              ),
            )}
          </dl>
        </section>

        {listings.length === 0 ? (
          <p className="mt-8 rounded-card border border-dashed border-stone bg-white p-6 text-center text-sm text-muted-ink">
            No listings exist yet.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {listings.map((listing) => (
              <AdminListingRow key={listing.id} listing={listing} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
