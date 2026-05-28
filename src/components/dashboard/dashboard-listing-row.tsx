import Link from "next/link";
import type { Listing } from "@/types/listings";
import { formatLocationCompact } from "@/lib/locations/my";
import { evaluateListingCompleteness, summarizeCompleteness } from "@/lib/listing-completeness";
import { LISTING_STATUS_DISPLAY } from "@/lib/listing-status-display";

interface DashboardListingRowProps {
  listing: Listing;
}

function decideNextAction(listing: Listing): { label: string; href: string; primary: boolean } {
  const completeness = evaluateListingCompleteness(listing);

  if (listing.status === "draft") {
    if (!completeness.publishable) {
      return {
        label: "Continue draft",
        href: `/dashboard/listings/${listing.id}/edit`,
        primary: true,
      };
    }
    return {
      label: "Publish",
      href: `/dashboard/listings/${listing.id}/edit`,
      primary: true,
    };
  }
  if (listing.status === "needs_review") {
    return {
      label: "Fix and resubmit",
      href: `/dashboard/listings/${listing.id}/edit`,
      primary: true,
    };
  }
  if (listing.status === "paused") {
    return {
      label: "Edit listing",
      href: `/dashboard/listings/${listing.id}/edit`,
      primary: false,
    };
  }
  return {
    label: "View public page",
    href: `/listings/${listing.slug}`,
    primary: false,
  };
}

export function DashboardListingRow({ listing }: DashboardListingRowProps) {
  const status = LISTING_STATUS_DISPLAY[listing.status];
  const completeness = evaluateListingCompleteness(listing);
  const summary = summarizeCompleteness(completeness);
  const next = decideNextAction(listing);
  const lastUpdated = new Date(listing.updatedAt).toLocaleDateString("en-MY", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <li className="rounded-card border border-stone bg-white p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bgClass} ${status.textClass}`}
            >
              <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
              {status.label}
            </span>
            <span className="text-xs text-muted-ink">
              Updated {lastUpdated}
            </span>
          </div>
          <h3 className="mt-2 break-words font-display text-xl text-ink">
            {listing.name}
          </h3>
          <p className="mt-1 text-sm text-muted-ink">
            {formatLocationCompact(listing.location)}
          </p>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-ink">Photos</dt>
              <dd
                className={`mt-0.5 font-medium tabular-nums ${
                  listing.photos.length >= 3 ? "text-ink" : "text-clay"
                }`}
              >
                {listing.photos.length} / 3+
              </dd>
            </div>
            <div>
              <dt className="text-muted-ink">Capacity</dt>
              <dd className="mt-0.5 font-medium tabular-nums text-ink">
                {listing.capacity}
              </dd>
            </div>
            <div>
              <dt className="text-muted-ink">Views</dt>
              <dd className="mt-0.5 font-medium tabular-nums text-ink">
                {listing.metrics.views}
              </dd>
            </div>
            <div>
              <dt className="text-muted-ink">WhatsApp</dt>
              <dd className="mt-0.5 font-medium tabular-nums text-ink">
                {listing.metrics.whatsappClicks}
              </dd>
            </div>
          </dl>

          <p
            className={`mt-3 text-sm ${
              completeness.publishable ? "text-deep-leaf" : "text-clay"
            }`}
          >
            {summary}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <Link
            href={next.href}
            className={`inline-flex w-full items-center justify-center rounded-control px-4 py-2 text-sm font-medium transition-colors sm:w-auto ${
              next.primary
                ? "bg-leaf text-paper hover:bg-deep-leaf"
                : "border border-stone bg-paper text-ink hover:bg-rice"
            }`}
          >
            {next.label}
          </Link>
          {listing.status === "published" && (
            <Link
              href={`/listings/${listing.slug}`}
              className="text-xs text-muted-ink underline-offset-4 hover:text-ink hover:underline"
            >
              View public page
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}
