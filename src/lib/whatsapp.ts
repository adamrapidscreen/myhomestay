import type { Listing } from "@/types/listings";

/**
 * WhatsApp link helpers.
 *
 * Free MVP routes booking and payment through WhatsApp directly with
 * the owner. The platform never holds payment state. These helpers
 * generate `wa.me` URLs with prefilled inquiry copy and never expose
 * an owner number on the public page itself, only the link.
 *
 * Reference: https://faq.whatsapp.com/5913398998672934
 */

/** Strip non-digit characters and any leading "+" from a phone number. */
export function normalizeWhatsappNumber(raw: string): string {
  const digitsOnly = raw.replace(/[^0-9]/g, "");
  return digitsOnly;
}

/**
 * Validate that a normalized number looks like a plausible international
 * WhatsApp identifier. Rejects empty strings, very short numbers, and
 * numbers longer than the E.164 maximum of 15 digits.
 */
export function isValidWhatsappNumber(raw: string): boolean {
  const normalized = normalizeWhatsappNumber(raw);
  if (normalized.length < 8) return false;
  if (normalized.length > 15) return false;
  return /^[0-9]+$/.test(normalized);
}

interface BuildWhatsappUrlOptions {
  /** Phone number in any common international format. */
  number: string;
  /** Optional prefilled message body. Will be URL-encoded. */
  message?: string;
}

/**
 * Build a `https://wa.me/<number>?text=<msg>` URL.
 *
 * Returns `null` if the number is not valid. This protects buttons in
 * the UI from rendering broken links.
 */
export function buildWhatsappUrl({
  number,
  message,
}: BuildWhatsappUrlOptions): string | null {
  if (!isValidWhatsappNumber(number)) return null;
  const normalized = normalizeWhatsappNumber(number);
  const base = `https://wa.me/${normalized}`;
  if (!message) return base;
  const encoded = encodeURIComponent(message);
  return `${base}?text=${encoded}`;
}

/**
 * Build a default listing inquiry message in plain English. Wording is
 * deliberately neutral and respectful so it works for owners and
 * travellers across regions.
 */
export function buildListingInquiryMessage(listing: Listing): string {
  const lines: string[] = [];
  lines.push(`Hi, I'm interested in your stay "${listing.name}".`);
  lines.push(
    `Area: ${listing.location.area}${
      listing.location.town && listing.location.town !== listing.location.area
        ? `, ${listing.location.town}`
        : ""
    }.`,
  );
  lines.push("Could you share availability and total price?");
  lines.push("Thank you!");
  return lines.join("\n");
}

/**
 * Convenience wrapper: take a listing and an owner WhatsApp number,
 * return a ready-to-render WhatsApp URL with prefilled inquiry copy.
 */
export function buildListingWhatsappUrl(
  listing: Listing,
  ownerWhatsappNumber: string,
): string | null {
  return buildWhatsappUrl({
    number: ownerWhatsappNumber,
    message: buildListingInquiryMessage(listing),
  });
}
