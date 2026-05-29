/**
 * Owner profile shape.
 *
 * Mirrors the future Supabase `profiles` table. The MVP is mock-first:
 * any free owner may publish up to 3 listings. WhatsApp number is the
 * primary booking channel.
 */

export interface OwnerProfile {
  /** Stable owner id, e.g. "owner-aini". Maps to future Supabase user id. */
  id: string;

  /** Internal owner/admin name used in dashboards. Not always public. */
  fullName: string;

  /** Public display name shown on listing pages. */
  displayName: string;

  /** International WhatsApp number in E.164-like format, e.g. "+60123456789". */
  whatsappNumber: string;

  /** Optional region label shown on owner card, e.g. "Pulau Pinang". */
  regionLabel?: string;

  /** ISO timestamp the owner profile was created. */
  createdAt: string;

  /** Whether this owner has completed onboarding. */
  onboardingComplete: boolean;
}

/**
 * Safe public owner fields for listing pages. Never includes full name or
 * postcode. Sourced from the get_listing_owner_public RPC for published
 * listings only. See _planning/security-gate-chapter-4.md (T4).
 */
export interface PublicListingOwner {
  displayName: string;
  whatsappNumber: string;
  regionLabel?: string;
}
