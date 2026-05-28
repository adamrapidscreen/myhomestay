import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMockCurrentOwner } from "@/data/owners";
import { findListingById } from "@/server/owner-store";
import { evaluateListingCompleteness } from "@/lib/listing-completeness";
import { LISTING_STATUS_DISPLAY } from "@/lib/listing-status-display";
import { ListingBuilder } from "../../listing-builder";

interface EditListingPageParams {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: EditListingPageParams): Promise<Metadata> {
  const { id } = await params;
  const listing = findListingById(id);
  return { title: listing ? `Edit · ${listing.name}` : "Edit listing" };
}

export default async function EditListingPage({ params }: EditListingPageParams) {
  const { id } = await params;
  const owner = getMockCurrentOwner();
  const listing = findListingById(id);
  if (!listing || listing.ownerId !== owner.id) notFound();

  const completeness = evaluateListingCompleteness(listing);
  const status = LISTING_STATUS_DISPLAY[listing.status];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-ink">
          Owner workspace
        </p>
        <h1 className="mt-2 break-words font-display text-3xl text-ink sm:text-4xl">
          Edit listing
        </h1>
        <p className="mt-2 text-sm text-muted-ink">
          <span
            className={`mr-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bgClass} ${status.textClass}`}
          >
            <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
            {status.label}
          </span>
          <Link
            href="/dashboard"
            className="text-muted-ink underline-offset-4 hover:text-ink hover:underline"
          >
            ← Back to dashboard
          </Link>
        </p>
      </div>

      {!completeness.publishable && (
        <section className="rounded-card border border-clay bg-rice p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-clay">
            Before you can publish
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-ink">
            {completeness.missingTasks.map((task) => (
              <li key={task}>{task}</li>
            ))}
          </ul>
        </section>
      )}

      <ListingBuilder listing={listing} isNew={false} />
    </div>
  );
}
