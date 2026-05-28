import type { Listing } from "@/types/listings";

/**
 * Listing completeness helper.
 *
 * The MVP rule from PRD-Lite and brand spec:
 *   - Drafts may have fewer than 3 photos.
 *   - Published listings must have at least 3 photos.
 *   - Required fields must be filled before publish.
 *
 * The helper returns a structured result so the dashboard can render
 * task language ("Add house rules") instead of raw percentages.
 */

/** Minimum photo count required for a listing to be publishable. */
export const MIN_PUBLISH_PHOTOS = 3;

/** A single missing-field reason, plain enough to display directly. */
export type ListingCompletenessReason =
  | "missing-name"
  | "missing-summary"
  | "missing-description"
  | "missing-capacity"
  | "missing-bedrooms"
  | "missing-location"
  | "missing-price"
  | "missing-photos"
  | "missing-house-rules"
  | "missing-whatsapp";

/** Display copy for each reason. Kept short and scannable. */
export const LISTING_COMPLETENESS_LABELS: Record<
  ListingCompletenessReason,
  string
> = {
  "missing-name": "Add a listing name",
  "missing-summary": "Add a short summary",
  "missing-description": "Add a longer description",
  "missing-capacity": "Set guest capacity",
  "missing-bedrooms": "Set number of bedrooms",
  "missing-location": "Set the location",
  "missing-price": "Set a price range",
  "missing-photos": "Add at least 3 photos",
  "missing-house-rules": "Add house rules",
  "missing-whatsapp": "Confirm WhatsApp number",
};

export interface ListingCompletenessResult {
  /** Whether the listing meets every publish requirement. */
  publishable: boolean;
  /** Outstanding reasons. Empty when publishable. */
  reasons: ListingCompletenessReason[];
  /**
   * Human-friendly task labels matching `reasons`. Useful for
   * directly rendering a missing-fields list.
   */
  missingTasks: string[];
}

function isBlank(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Evaluate whether a listing meets MVP publish requirements.
 *
 * This does not check status. A draft can be evaluated to surface its
 * remaining tasks before the owner attempts to publish.
 */
export function evaluateListingCompleteness(
  listing: Listing,
): ListingCompletenessResult {
  const reasons: ListingCompletenessReason[] = [];

  if (isBlank(listing.name)) reasons.push("missing-name");
  if (isBlank(listing.summary)) reasons.push("missing-summary");
  if (isBlank(listing.description)) reasons.push("missing-description");
  if (!listing.capacity || listing.capacity < 1) reasons.push("missing-capacity");
  if (!listing.bedrooms || listing.bedrooms < 1) reasons.push("missing-bedrooms");
  if (!listing.location || isBlank(listing.location.area)) {
    reasons.push("missing-location");
  }

  const price = listing.price;
  const priceMissing =
    !price ||
    price.minPerNight <= 0 ||
    price.maxPerNight <= 0 ||
    price.maxPerNight < price.minPerNight;
  if (priceMissing) reasons.push("missing-price");

  if (!listing.photos || listing.photos.length < MIN_PUBLISH_PHOTOS) {
    reasons.push("missing-photos");
  }

  if (!listing.houseRules || listing.houseRules.length === 0) {
    reasons.push("missing-house-rules");
  }

  if (!listing.trust?.whatsappReady) reasons.push("missing-whatsapp");

  return {
    publishable: reasons.length === 0,
    reasons,
    missingTasks: reasons.map((r) => LISTING_COMPLETENESS_LABELS[r]),
  };
}

/**
 * Convenience: short summary phrase used by listing rows in the
 * dashboard, e.g. "Ready to publish" or "Needs photos · Needs rules".
 */
export function summarizeCompleteness(
  result: ListingCompletenessResult,
): string {
  if (result.publishable) return "Ready to publish";
  if (result.missingTasks.length === 1) return result.missingTasks[0];
  return result.missingTasks.slice(0, 2).join(" · ");
}
