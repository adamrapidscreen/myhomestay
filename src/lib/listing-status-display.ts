import type { Listing } from "@/types/listings";

/**
 * Display tokens and copy for the listing status badge used across
 * the owner dashboard. Each status maps to a token color from the
 * Kampung Quiet Ledger Hybrid palette and a single owner-facing label.
 */

export interface ListingStatusDisplay {
  label: string;
  /** Tailwind v4 token-form class for the dot. */
  dotClass: string;
  /** Tailwind class for the badge background. */
  bgClass: string;
  /** Tailwind class for the badge foreground. */
  textClass: string;
}

export const LISTING_STATUS_DISPLAY: Record<
  Listing["status"],
  ListingStatusDisplay
> = {
  draft: {
    label: "Draft",
    dotClass: "bg-muted-ink",
    bgClass: "bg-rice",
    textClass: "text-ink",
  },
  published: {
    label: "Published",
    dotClass: "bg-leaf",
    bgClass: "bg-rice",
    textClass: "text-deep-leaf",
  },
  paused: {
    label: "Paused",
    dotClass: "bg-clay",
    bgClass: "bg-rice",
    textClass: "text-clay",
  },
  needs_review: {
    label: "Needs review",
    dotClass: "bg-danger",
    bgClass: "bg-rice",
    textClass: "text-danger",
  },
};
