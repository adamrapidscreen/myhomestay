import type { Listing } from "@/types/listings";

/**
 * Share Kit copy helpers (Launch Bloom Pack).
 *
 * Pure functions that build the public listing URL, share captions, and the
 * owner WhatsApp share message. No DB or browser APIs, so they are testable
 * and usable on client and server. Captions are English-first and modest:
 * no "verified"/"certified"/"approved" claims.
 */

/** Build the absolute public listing URL from a site origin and slug. */
export function buildPublicListingUrl(siteUrl: string, slug: string): string {
  const base = siteUrl.replace(/\/$/, "");
  return `${base}/listings/${slug}`;
}

/** Compact area phrase, e.g. "Balik Pulau, Pulau Pinang" or just the area. */
function areaPhrase(listing: Listing): string {
  const town = listing.location.town;
  if (town && town !== listing.location.area) {
    return `${listing.location.area}, ${town}`;
  }
  return listing.location.area;
}

/** Owner-facing WhatsApp share message pointing guests to the listing. */
export function buildOwnerShareMessage(listing: Listing, url: string): string {
  return [
    `Check out my homestay "${listing.name}" in ${areaPhrase(listing)} on MyHomestay:`,
    url,
  ].join("\n");
}

export interface ShareCaptions {
  facebook: string;
  tiktok: string;
  short: string;
}

/** Caption starters for common channels. Owners can edit before posting. */
export function buildShareCaptions(
  listing: Listing,
  url: string,
): ShareCaptions {
  const area = areaPhrase(listing);
  return {
    facebook: [
      `Looking for a stay in ${area}? Our homestay "${listing.name}" is open for bookings.`,
      `Up to ${listing.capacity} guests. Message us on WhatsApp to check dates and price.`,
      url,
    ].join("\n"),
    tiktok: [
      `Stay with us at ${listing.name} 🏡 ${area}`,
      `#homestay #malaysia #cuti`,
      url,
    ].join("\n"),
    short: `${listing.name} · ${area} · book on WhatsApp → ${url}`,
  };
}

/** Suggested QR download file name for a listing. */
export function qrFileName(slug: string, ext: "svg" | "png" = "svg"): string {
  return `myhomestay-${slug}-qr.${ext}`;
}
