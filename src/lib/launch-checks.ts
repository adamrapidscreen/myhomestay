import type { Listing } from "@/types/listings";
import type { OwnerProfile } from "@/types/owners";
import { isValidWhatsappNumber } from "@/lib/whatsapp";
import { MIN_PUBLISH_PHOTOS } from "@/lib/listing-completeness";

/**
 * Owner Trust Checklist (Launch Bloom Pack).
 *
 * Computes launch-readiness checks from data the owner already has. Nothing
 * here is stored or manually toggled: every check is derived from the listing,
 * the owner profile, and the local guide item count. Pure and DB-free so it is
 * unit-testable and reusable on client and server.
 *
 * Trust language stays factual. No "verified"/"certified"/"approved" wording.
 */

export type LaunchCheckId =
  | "profile-complete"
  | "whatsapp-reachable"
  | "photos-ready"
  | "photo-spread"
  | "listing-essentials"
  | "house-rules"
  | "audience-details"
  | "local-guide"
  | "published";

export type LaunchCheckTone = "leaf" | "clay" | "river";

export interface LaunchCheck {
  id: LaunchCheckId;
  label: string;
  done: boolean;
  /** Visual tone: complete (leaf), needs work (clay), informational (river). */
  tone: LaunchCheckTone;
  /** Owner action link target relative to the listing, or null when done. */
  actionHref: string | null;
  /** Short hint shown when the check is incomplete. */
  hint?: string;
}

export interface LaunchChecklistInput {
  listing: Listing;
  owner: OwnerProfile;
  /** Count of public guide items the owner has added. */
  publicGuideItemCount: number;
}

export interface LaunchChecklistResult {
  checks: LaunchCheck[];
  completeCount: number;
  totalCount: number;
  /** True when every actionable check is complete. */
  allComplete: boolean;
}

function distinctPhotoCategories(listing: Listing): number {
  return new Set(listing.photos.map((p) => p.category)).size;
}

function listingEssentialsComplete(listing: Listing): boolean {
  return (
    listing.name.trim().length > 0 &&
    listing.summary.trim().length > 0 &&
    listing.description.trim().length > 0 &&
    listing.location.area.trim().length > 0 &&
    listing.capacity >= 1 &&
    listing.bedrooms >= 1 &&
    listing.price.minPerNight > 0 &&
    listing.price.maxPerNight >= listing.price.minPerNight
  );
}

/**
 * Evaluate the launch checklist. `editHref` and `launchHref` keep route
 * knowledge out of the helper so callers control the link base.
 */
export function evaluateLaunchChecklist(
  input: LaunchChecklistInput,
): LaunchChecklistResult {
  const { listing, owner, publicGuideItemCount } = input;
  const editHref = `/dashboard/listings/${listing.id}/edit`;
  const photoHref = `/dashboard/listings/${listing.id}/photos`;
  const launchHref = `/dashboard/listings/${listing.id}/launch`;

  const profileDone =
    owner.onboardingComplete &&
    owner.displayName.trim().length > 0 &&
    isValidWhatsappNumber(owner.whatsappNumber);

  const checks: LaunchCheck[] = [
    {
      id: "profile-complete",
      label: "Owner profile complete",
      done: profileDone,
      tone: profileDone ? "leaf" : "clay",
      actionHref: profileDone ? null : "/dashboard/onboarding",
      hint: profileDone ? undefined : "Finish onboarding with name and WhatsApp.",
    },
    {
      id: "whatsapp-reachable",
      label: "WhatsApp number reachable",
      done: isValidWhatsappNumber(owner.whatsappNumber),
      tone: isValidWhatsappNumber(owner.whatsappNumber) ? "leaf" : "clay",
      actionHref: isValidWhatsappNumber(owner.whatsappNumber)
        ? null
        : "/dashboard/onboarding",
      hint: isValidWhatsappNumber(owner.whatsappNumber)
        ? undefined
        : "Add a valid WhatsApp number guests can reach.",
    },
    {
      id: "photos-ready",
      label: `At least ${MIN_PUBLISH_PHOTOS} photos added`,
      done: listing.photos.length >= MIN_PUBLISH_PHOTOS,
      tone: listing.photos.length >= MIN_PUBLISH_PHOTOS ? "leaf" : "clay",
      actionHref: listing.photos.length >= MIN_PUBLISH_PHOTOS ? null : photoHref,
      hint:
        listing.photos.length >= MIN_PUBLISH_PHOTOS
          ? undefined
          : `Add ${MIN_PUBLISH_PHOTOS - listing.photos.length} more photo(s).`,
    },
    {
      id: "photo-spread",
      label: "Photos cover at least 2 areas",
      done: distinctPhotoCategories(listing) >= 2,
      tone: distinctPhotoCategories(listing) >= 2 ? "leaf" : "river",
      actionHref: distinctPhotoCategories(listing) >= 2 ? null : photoHref,
      hint:
        distinctPhotoCategories(listing) >= 2
          ? undefined
          : "Show different spaces, e.g. bedroom and exterior.",
    },
    {
      id: "listing-essentials",
      label: "Listing essentials filled",
      done: listingEssentialsComplete(listing),
      tone: listingEssentialsComplete(listing) ? "leaf" : "clay",
      actionHref: listingEssentialsComplete(listing) ? null : editHref,
      hint: listingEssentialsComplete(listing)
        ? undefined
        : "Complete name, summary, description, location, capacity, and price.",
    },
    {
      id: "house-rules",
      label: "House rules shared",
      done: listing.houseRules.length > 0,
      tone: listing.houseRules.length > 0 ? "leaf" : "clay",
      actionHref: listing.houseRules.length > 0 ? null : editHref,
      hint: listing.houseRules.length > 0 ? undefined : "Add a few house rules.",
    },
    {
      id: "audience-details",
      label: "Muslim-friendly / family details set",
      done: listing.trust.muslimFriendly || listing.trust.familyFriendly,
      tone:
        listing.trust.muslimFriendly || listing.trust.familyFriendly
          ? "leaf"
          : "river",
      actionHref:
        listing.trust.muslimFriendly || listing.trust.familyFriendly
          ? null
          : editHref,
      hint:
        listing.trust.muslimFriendly || listing.trust.familyFriendly
          ? undefined
          : "Confirm whether the stay is Muslim-friendly or family-friendly.",
    },
    {
      id: "local-guide",
      label: "Local guide started",
      done: publicGuideItemCount > 0,
      tone: publicGuideItemCount > 0 ? "leaf" : "river",
      actionHref: publicGuideItemCount > 0 ? null : launchHref,
      hint:
        publicGuideItemCount > 0
          ? undefined
          : "Add one nearby tip guests usually ask about.",
    },
    {
      id: "published",
      label: "Listing is published",
      done: listing.status === "published",
      tone: listing.status === "published" ? "leaf" : "clay",
      actionHref: listing.status === "published" ? null : editHref,
      hint:
        listing.status === "published"
          ? undefined
          : "Publish so guests can find and message you.",
    },
  ];

  const completeCount = checks.filter((c) => c.done).length;
  return {
    checks,
    completeCount,
    totalCount: checks.length,
    allComplete: completeCount === checks.length,
  };
}
