/**
 * Listing photo metadata shape.
 *
 * Mirrors the future Supabase `listing_photos` table. Storage paths
 * stay opaque so Supabase Storage and the future CDN can change without
 * breaking listing render code.
 */

export type ListingPhotoCategory =
  | "exterior"
  | "bedroom"
  | "bathroom"
  | "kitchen"
  | "living"
  | "surrounding"
  | "other";

export interface ListingPhoto {
  /** Stable id within the listing, e.g. "photo-1". */
  id: string;
  /** Storage path or URL. Treated as opaque outside the data layer. */
  src: string;
  /** Owner-provided alt text. Empty string is allowed but not encouraged. */
  alt: string;
  /** Photo categorization to support gallery ordering and completeness. */
  category: ListingPhotoCategory;
  /** Display order within the listing gallery. Lower number renders first. */
  order: number;
}
