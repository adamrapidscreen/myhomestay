import "server-only";
import type { Listing } from "@/types/listings";
import { mockListings } from "@/data/listings";

/**
 * Session-scoped owner data store.
 *
 * The owner workflow ships before Supabase. This module exposes a
 * mutable in-memory mirror of the static mock listings so the
 * dashboard, onboarding, and listing builder feel live within a
 * single dev-server lifetime. Restarting `next start` resets to the
 * static seed.
 *
 * All exports are server-only. Do not import from client components.
 */

let workingListings: Listing[] = mockListings.map((l) => ({
  ...l,
  photos: l.photos.map((p) => ({ ...p })),
  trust: { ...l.trust },
  price: { ...l.price },
  location: { ...l.location },
  metrics: { ...l.metrics },
  amenities: [...l.amenities],
  houseRules: [...l.houseRules],
}));

/** All listings in the working store, regardless of status. */
export function listAllListings(): Listing[] {
  return workingListings;
}

/** Listings owned by a given owner id. */
export function listListingsByOwner(ownerId: string): Listing[] {
  return workingListings.filter((l) => l.ownerId === ownerId);
}

/** Find a working listing by id. */
export function findListingById(id: string): Listing | undefined {
  return workingListings.find((l) => l.id === id);
}

/** Find a working listing by slug. */
export function findListingBySlug(slug: string): Listing | undefined {
  return workingListings.find((l) => l.slug === slug);
}

/** Replace one listing in the working store. */
export function replaceListing(updated: Listing): void {
  workingListings = workingListings.map((l) =>
    l.id === updated.id ? updated : l,
  );
}

/** Insert a new listing into the working store. */
export function insertListing(listing: Listing): void {
  workingListings = [listing, ...workingListings];
}

/** Reset the working store to the static seed. Useful for tests. */
export function resetListingStore(): void {
  workingListings = mockListings.map((l) => ({
    ...l,
    photos: l.photos.map((p) => ({ ...p })),
    trust: { ...l.trust },
    price: { ...l.price },
    location: { ...l.location },
    metrics: { ...l.metrics },
    amenities: [...l.amenities],
    houseRules: [...l.houseRules],
  }));
}
