import type { Listing } from "@/types/listings";
import type { MalaysianState } from "@/types/locations";
import { isMalaysianState } from "@/lib/locations/my";

/**
 * Listing directory filter logic.
 *
 * Pure functions only. Designed to be driven by URL search params so
 * the directory works server-side and supports shareable links.
 */

export interface ListingFilterState {
  /** Free text query against name and area. Lowercased. */
  query: string;
  /** Selected Malaysian state slug, or null for all. */
  state: MalaysianState | null;
  /** Minimum guest capacity. */
  minCapacity: number | null;
  /** Maximum nightly price in MYR. */
  maxPrice: number | null;
  /** Require Muslim-friendly trust flag. */
  muslimFriendly: boolean;
  /** Require family-friendly trust flag. */
  familyFriendly: boolean;
}

export const EMPTY_FILTERS: ListingFilterState = {
  query: "",
  state: null,
  minCapacity: null,
  maxPrice: null,
  muslimFriendly: false,
  familyFriendly: false,
};

/** Read filter state from a URLSearchParams-like object. */
export function parseListingFilters(
  params: Record<string, string | string[] | undefined>,
): ListingFilterState {
  const get = (key: string): string | undefined => {
    const v = params[key];
    if (Array.isArray(v)) return v[0];
    return v;
  };

  const query = (get("q") ?? "").trim().toLowerCase();

  const stateRaw = get("state");
  const state =
    stateRaw && isMalaysianState(stateRaw) ? stateRaw : null;

  const parseNum = (raw: string | undefined): number | null => {
    if (!raw) return null;
    const n = Number(raw);
    if (!Number.isFinite(n) || n <= 0) return null;
    return n;
  };

  const minCapacity = parseNum(get("capacity"));
  const maxPrice = parseNum(get("maxPrice"));

  const muslimFriendly = get("muslim") === "1";
  const familyFriendly = get("family") === "1";

  return { query, state, minCapacity, maxPrice, muslimFriendly, familyFriendly };
}

/** Apply filters to a list of listings. Only published listings should be passed. */
export function applyListingFilters(
  listings: Listing[],
  filters: ListingFilterState,
): Listing[] {
  return listings.filter((listing) => {
    if (filters.state && listing.location.state !== filters.state) return false;

    if (filters.minCapacity && listing.capacity < filters.minCapacity) {
      return false;
    }

    if (filters.maxPrice && listing.price.minPerNight > filters.maxPrice) {
      return false;
    }

    if (filters.muslimFriendly && !listing.trust.muslimFriendly) return false;
    if (filters.familyFriendly && !listing.trust.familyFriendly) return false;

    if (filters.query) {
      const haystack = [
        listing.name,
        listing.summary,
        listing.location.area,
        listing.location.town ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(filters.query)) return false;
    }

    return true;
  });
}

/** True when no filters are active. Used to show empty/all state copy. */
export function isFilterStateEmpty(filters: ListingFilterState): boolean {
  return (
    filters.query === "" &&
    filters.state === null &&
    filters.minCapacity === null &&
    filters.maxPrice === null &&
    !filters.muslimFriendly &&
    !filters.familyFriendly
  );
}
