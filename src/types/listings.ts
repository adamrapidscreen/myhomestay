import type { MalaysiaLocation } from "./locations";
import type { ListingPhoto } from "./photos";

/**
 * Listing status state machine.
 *
 * - `draft`: editable by owner, not publicly visible.
 * - `published`: live on the public directory and listing page.
 * - `paused`: owner or admin temporarily hid the listing.
 * - `needs_review`: admin flagged for fixes before re-publish.
 */
export type ListingStatus =
  | "draft"
  | "published"
  | "paused"
  | "needs_review";

/** Trust details surfaced on listing card and detail page. */
export interface ListingTrust {
  muslimFriendly: boolean;
  familyFriendly: boolean;
  /** True if owner has provided a reachable WhatsApp number. */
  whatsappReady: boolean;
  /** True once the owner has accepted house rules display. */
  houseRulesProvided: boolean;
}

/** Pricing range in Malaysian Ringgit per night. */
export interface ListingPrice {
  currency: "MYR";
  minPerNight: number;
  maxPerNight: number;
}

/** Public traffic and inquiry metrics for owner dashboard. */
export interface ListingMetrics {
  /** All-time public listing views. */
  views: number;
  /** All-time WhatsApp CTA clicks. */
  whatsappClicks: number;
  /** ISO timestamp of last metric update. */
  lastUpdatedAt: string;
}

/**
 * Listing aggregate shape.
 *
 * Mirrors the future Supabase `listings` table joined with related
 * photo, trust, price, location, and metric records.
 */
export interface Listing {
  /** Stable internal id. Maps to future Supabase row id. */
  id: string;

  /** URL slug. Stable across edits unless renamed deliberately. */
  slug: string;

  /** Owner id reference. */
  ownerId: string;

  /** Public listing name shown in display type. */
  name: string;

  /** Short scannable summary for listing card and detail header. */
  summary: string;

  /** Long form description used on detail page only. */
  description: string;

  /** Maximum guest capacity. */
  capacity: number;

  /** Number of bedrooms. Used for trust strip and filtering. */
  bedrooms: number;

  /** Listing location reference. */
  location: MalaysiaLocation;

  /** Pricing range. */
  price: ListingPrice;

  /** Photos in display order. */
  photos: ListingPhoto[];

  /** Amenity slugs, e.g. "wifi", "kitchen", "parking". */
  amenities: string[];

  /** House rules in plain text bullet form. */
  houseRules: string[];

  /** Trust signals shown on listing surfaces. */
  trust: ListingTrust;

  /** Lifecycle status. */
  status: ListingStatus;

  /** Public metrics shown to the owner. */
  metrics: ListingMetrics;

  /** ISO timestamp of last edit. */
  updatedAt: string;
}
