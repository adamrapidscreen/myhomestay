import Link from "next/link";
import type { Listing } from "@/types/listings";
import { formatLocationCompact } from "@/lib/locations/my";

/**
 * Public listing card for the directory.
 *
 * Mock photos are not yet served (paths under /mock/...). Until real
 * Supabase Storage lands in Chapter 4, the photo region is a typed
 * placeholder panel that uses the brand surface.
 */
interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const cover = listing.photos[0];
  const { trust, price, location } = listing;

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-stone bg-white transition-colors hover:border-leaf"
    >
      <div
        aria-hidden
        className="relative flex aspect-[4/3] w-full items-end bg-rice p-3 text-xs text-muted-ink"
      >
        <span className="rounded-full bg-white/85 px-2 py-1">
          {cover ? cover.category : "no photo yet"}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-ink">
            {formatLocationCompact(location)}
          </p>
          <h3 className="mt-1 break-words font-display text-lg leading-snug text-ink group-hover:text-deep-leaf">
            {listing.name}
          </h3>
        </div>

        <p className="text-sm leading-relaxed text-muted-ink line-clamp-2">
          {listing.summary}
        </p>

        <dl className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-ink">
          <div className="flex items-center gap-1">
            <dt className="sr-only">Capacity</dt>
            <dd>
              <span className="font-medium text-ink">
                {listing.capacity}
              </span>{" "}
              guests
            </dd>
          </div>
          <div className="flex items-center gap-1">
            <dt className="sr-only">Bedrooms</dt>
            <dd>
              <span className="font-medium text-ink">
                {listing.bedrooms}
              </span>{" "}
              bedrooms
            </dd>
          </div>
        </dl>

        <ul className="flex flex-wrap gap-1.5 text-[11px]">
          {trust.muslimFriendly && (
            <li className="rounded-full border border-stone bg-rice px-2 py-0.5 text-muted-ink">
              Muslim-friendly
            </li>
          )}
          {trust.familyFriendly && (
            <li className="rounded-full border border-stone bg-rice px-2 py-0.5 text-muted-ink">
              Family-friendly
            </li>
          )}
          {trust.whatsappReady && (
            <li className="rounded-full border border-stone bg-rice px-2 py-0.5 text-muted-ink">
              WhatsApp ready
            </li>
          )}
        </ul>

        <div className="mt-auto flex items-baseline justify-between gap-3 border-t border-stone pt-3">
          <p className="text-sm tabular-nums text-ink">
            <span className="font-medium">
              RM {price.minPerNight} – {price.maxPerNight}
            </span>{" "}
            <span className="text-xs text-muted-ink">/ night</span>
          </p>
          <span className="text-xs font-medium text-leaf group-hover:text-deep-leaf">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
