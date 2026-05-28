import Link from "next/link";
import { getMockCurrentOwner } from "@/data/owners";
import { listListingsByOwner } from "@/server/owner-store";
import { DashboardListingRow } from "@/components/dashboard/dashboard-listing-row";

export default function DashboardPage() {
  const owner = getMockCurrentOwner();
  const listings = listListingsByOwner(owner.id);
  const onboardingComplete = owner.onboardingComplete;

  return (
    <div className="space-y-8">
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-ink">
          Owner workspace
        </p>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          Your listings
        </h1>
        <p className="mt-2 max-w-prose text-base leading-relaxed text-muted-ink">
          Manage drafts, published stays, and the next action for each listing.
          Booking and payment continue with guests on WhatsApp.
        </p>
      </section>

      {!onboardingComplete && (
        <section className="rounded-card border border-clay bg-rice p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-clay">
            Profile incomplete
          </p>
          <h2 className="mt-2 font-display text-lg text-ink">
            Finish your owner profile
          </h2>
          <p className="mt-1 text-sm text-muted-ink">
            Add your display name and WhatsApp number so travellers can reach
            you when they message a listing.
          </p>
          <Link
            href="/dashboard/onboarding"
            className="mt-3 inline-flex items-center justify-center rounded-control bg-clay px-4 py-2 text-sm font-medium text-paper hover:opacity-90"
          >
            Complete profile
          </Link>
        </section>
      )}

      {listings.length === 0 ? (
        <section className="rounded-card border border-dashed border-stone bg-white p-6 text-center sm:p-10">
          <h2 className="font-display text-xl text-ink">
            No listings yet
          </h2>
          <p className="mt-2 max-w-prose text-sm text-muted-ink mx-auto">
            Create your first listing as a draft. You can publish it once you
            have at least 3 photos and the essentials filled in.
          </p>
          <Link
            href="/dashboard/listings/new"
            className="mt-5 inline-flex items-center justify-center rounded-control bg-leaf px-4 py-2 text-sm font-medium text-paper hover:bg-deep-leaf"
          >
            + Create your first listing
          </Link>
        </section>
      ) : (
        <ul className="space-y-4">
          {listings.map((listing) => (
            <DashboardListingRow key={listing.id} listing={listing} />
          ))}
        </ul>
      )}
    </div>
  );
}
