import "server-only";

import type { Listing, ListingStatus } from "@/types/listings";
import type { ListingPhoto, ListingPhotoCategory } from "@/types/photos";
import type { MalaysianState } from "@/types/locations";
import type { ListingBuilderInput } from "@/lib/listing-builder-validation";
import { buildSlugFromName } from "@/lib/listing-builder-validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Supabase-backed listing data layer.
 *
 * Replaces the Chapter 3 in-memory mock stores. Every read/write goes through
 * the RLS-bound server client, so owner scoping and published-only public
 * reads are enforced by the database, not by app filtering. See
 * _planning/security-gate-chapter-4.md (T2, T3).
 */

interface PhotoRow {
  id: string;
  src: string;
  alt: string;
  category: string;
  sort_order: number;
}

interface MetricsRow {
  views: number;
  whatsapp_clicks: number;
  last_updated_at: string;
}

interface ListingRow {
  id: string;
  slug: string;
  owner_id: string;
  name: string;
  summary: string;
  description: string;
  capacity: number;
  bedrooms: number;
  location_area: string;
  location_town: string | null;
  location_state: string;
  location_postcode: string | null;
  price_currency: string;
  price_min_per_night: number | string;
  price_max_per_night: number | string;
  amenities: string[];
  house_rules: string[];
  muslim_friendly: boolean;
  family_friendly: boolean;
  status: string;
  updated_at: string;
  listing_photos?: PhotoRow[] | null;
  listing_metrics?: MetricsRow | MetricsRow[] | null;
}

const LISTING_SELECT =
  "id, slug, owner_id, name, summary, description, capacity, bedrooms, " +
  "location_area, location_town, location_state, location_postcode, " +
  "price_currency, price_min_per_night, price_max_per_night, amenities, " +
  "house_rules, muslim_friendly, family_friendly, status, updated_at, " +
  "listing_photos(id, src, alt, category, sort_order), " +
  "listing_metrics(views, whatsapp_clicks, last_updated_at)";

function num(v: number | string): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : 0;
}

function mapPhotos(rows: PhotoRow[] | null | undefined): ListingPhoto[] {
  if (!rows) return [];
  return [...rows]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) => ({
      id: p.id,
      src: p.src,
      alt: p.alt,
      category: p.category as ListingPhotoCategory,
      order: p.sort_order,
    }));
}

function mapMetrics(
  m: MetricsRow | MetricsRow[] | null | undefined,
): Listing["metrics"] {
  const row = Array.isArray(m) ? m[0] : m;
  return {
    views: row?.views ?? 0,
    whatsappClicks: row?.whatsapp_clicks ?? 0,
    lastUpdatedAt: row?.last_updated_at ?? new Date(0).toISOString(),
  };
}

/**
 * Map a DB row to the Listing aggregate. `whatsappReady` is supplied by the
 * caller because the owner's WhatsApp number lives on profiles, which has no
 * public read; callers pass the known value (owner self, or RPC for public).
 */
function mapListing(
  row: ListingRow,
  opts: { whatsappReady?: boolean; publicView?: boolean } = {},
): Listing {
  const photos = mapPhotos(row.listing_photos);
  return {
    id: row.id,
    slug: row.slug,
    ownerId: row.owner_id,
    name: row.name,
    summary: row.summary,
    description: row.description,
    capacity: row.capacity,
    bedrooms: row.bedrooms,
    location: {
      id: row.slug,
      area: row.location_area,
      town: row.location_town ?? undefined,
      state: row.location_state as MalaysianState,
      // Postcode is owner-record only; never expose on public reads (T4).
      postcode: opts.publicView ? undefined : row.location_postcode ?? undefined,
    },
    price: {
      currency: "MYR",
      minPerNight: num(row.price_min_per_night),
      maxPerNight: num(row.price_max_per_night),
    },
    photos,
    amenities: row.amenities ?? [],
    houseRules: row.house_rules ?? [],
    trust: {
      muslimFriendly: row.muslim_friendly,
      familyFriendly: row.family_friendly,
      whatsappReady: opts.whatsappReady ?? false,
      houseRulesProvided: (row.house_rules ?? []).length > 0,
    },
    status: row.status as ListingStatus,
    metrics: mapMetrics(row.listing_metrics),
    updatedAt: row.updated_at,
  };
}

// ---------------------------------------------------------------------------
// Owner-scoped reads (RLS returns only the signed-in owner's rows)
// ---------------------------------------------------------------------------

/** Listings owned by a given owner id. RLS enforces owner_id = auth.uid(). */
export async function listListingsByOwner(ownerId: string): Promise<Listing[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("owner_id", ownerId)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];

  // Owner's own WhatsApp readiness is derived from their profile once.
  const { data: profile } = await supabase
    .from("profiles")
    .select("whatsapp_number")
    .eq("id", ownerId)
    .maybeSingle();
  const whatsappReady =
    (profile?.whatsapp_number ?? "").replace(/[^0-9]/g, "").length >= 8;

  return (data as unknown as ListingRow[]).map((row) =>
    mapListing(row, { whatsappReady }),
  );
}

/** Find one listing by id, scoped by RLS to the signed-in owner (or admin). */
export async function findListingById(id: string): Promise<Listing | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  const row = data as unknown as ListingRow;

  const { data: profile } = await supabase
    .from("profiles")
    .select("whatsapp_number")
    .eq("id", row.owner_id)
    .maybeSingle();
  const whatsappReady =
    (profile?.whatsapp_number ?? "").replace(/[^0-9]/g, "").length >= 8;

  return mapListing(row, { whatsappReady });
}

// ---------------------------------------------------------------------------
// Public reads (RLS returns only published rows for anon/auth)
// ---------------------------------------------------------------------------

/** All published listings for the public directory. Reads through the
 * get_published_listings RPC, which omits postcode and needs no anon table
 * access (Sentinel M1). */
export async function listPublishedListings(): Promise<Listing[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_published_listings");

  if (error || !data) return [];
  return (data as unknown as ListingRow[]).map((row) =>
    mapListing(row, { publicView: true }),
  );
}

/** Find one published listing by slug, or null. Reads through the
 * get_published_listing_by_slug RPC (omits postcode, no anon table access). */
export async function findPublishedListingBySlug(
  slug: string,
): Promise<Listing | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_published_listing_by_slug", {
    p_slug: slug,
  });

  if (error || !data) return null;
  return mapListing(data as unknown as ListingRow, { publicView: true });
}

/**
 * Safe public owner contact for a published listing. Uses the
 * get_listing_owner_public RPC so full_name and postcode are never exposed.
 * Returns null when the listing is not published or has no owner.
 */
export async function getPublicListingOwner(listingId: string): Promise<{
  displayName: string;
  whatsappNumber: string;
  regionLabel?: string;
} | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("get_listing_owner_public", {
    p_listing_id: listingId,
  });

  if (error || !data || data.length === 0) return null;
  const row = data[0] as {
    display_name: string;
    whatsapp_number: string;
    region_label: string | null;
  };
  return {
    displayName: row.display_name,
    whatsappNumber: row.whatsapp_number,
    regionLabel: row.region_label ?? undefined,
  };
}

// ---------------------------------------------------------------------------
// Writes (RLS enforces owner_id = auth.uid(); triggers enforce business rules)
// ---------------------------------------------------------------------------

export type ListingWriteResult =
  | { ok: true; listing: Listing }
  | { ok: false; error: string };

/** Friendly message from a Postgres error raised by our triggers/policies. */
function friendlyDbError(message: string | undefined): string {
  const m = message ?? "";
  if (m.includes("Free tier limit")) return "Free tier limit reached: 3 listings.";
  if (m.startsWith("Cannot publish:")) return m;
  if (m.includes("Illegal listing status transition")) {
    return "That status change is not allowed.";
  }
  if (m.includes("duplicate key") && m.includes("slug")) {
    return "That listing name is already taken. Try a small change.";
  }
  return "Could not save the listing. Please try again.";
}

function inputToRow(ownerId: string, input: ListingBuilderInput) {
  return {
    owner_id: ownerId,
    name: input.name,
    summary: input.summary,
    description: input.description,
    capacity: input.capacity ?? 0,
    bedrooms: input.bedrooms ?? 0,
    location_area: input.area,
    location_town: input.town || null,
    location_state: input.state ?? "selangor",
    location_postcode: input.postcode || null,
    price_currency: "MYR",
    price_min_per_night: input.minPerNight ?? 0,
    price_max_per_night: input.maxPerNight ?? 0,
    amenities: input.amenities,
    house_rules: input.houseRules,
    muslim_friendly: input.muslimFriendly,
    family_friendly: input.familyFriendly,
  };
}

/** Replace the placeholder photo rows for a listing from selected categories. */
async function syncPlaceholderPhotos(
  listingId: string,
  categories: string[],
): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.from("listing_photos").delete().eq("listing_id", listingId);
  if (categories.length === 0) return;
  await supabase.from("listing_photos").insert(
    categories.map((category, index) => ({
      listing_id: listingId,
      src: `/mock/listings/placeholder/${category}.jpg`,
      alt: `${category} placeholder photo`,
      category,
      sort_order: index + 1,
    })),
  );
}

/** Create a new draft listing for the signed-in owner. */
export async function createDraftListing(
  ownerId: string,
  input: ListingBuilderInput,
): Promise<ListingWriteResult> {
  const supabase = await createSupabaseServerClient();
  const slug = buildSlugFromName(input.name, `listing-${Date.now()}`);

  const { data, error } = await supabase
    .from("listings")
    .insert({ ...inputToRow(ownerId, input), slug, status: "draft" })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: friendlyDbError(error?.message) };

  await syncPlaceholderPhotos(data.id, input.photoCategories);
  const listing = await findListingById(data.id);
  if (!listing) return { ok: false, error: "Listing not found after save." };
  return { ok: true, listing };
}

/** Update an existing listing's editable fields. RLS scopes to owner. */
export async function updateListingFields(
  listingId: string,
  input: ListingBuilderInput,
): Promise<ListingWriteResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("listings")
    .update({
      name: input.name,
      summary: input.summary,
      description: input.description,
      capacity: input.capacity ?? 0,
      bedrooms: input.bedrooms ?? 0,
      location_area: input.area,
      location_town: input.town || null,
      location_state: input.state ?? "selangor",
      location_postcode: input.postcode || null,
      price_min_per_night: input.minPerNight ?? 0,
      price_max_per_night: input.maxPerNight ?? 0,
      amenities: input.amenities,
      house_rules: input.houseRules,
      muslim_friendly: input.muslimFriendly,
      family_friendly: input.familyFriendly,
    })
    .eq("id", listingId);

  if (error) return { ok: false, error: friendlyDbError(error.message) };

  if (input.photoCategories.length > 0) {
    await syncPlaceholderPhotos(listingId, input.photoCategories);
  }
  const listing = await findListingById(listingId);
  if (!listing) return { ok: false, error: "Listing not found in this session." };
  return { ok: true, listing };
}

/** Change a listing's status. DB trigger validates the transition + publish gate. */
export async function setListingStatus(
  listingId: string,
  status: ListingStatus,
): Promise<ListingWriteResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("listings")
    .update({ status })
    .eq("id", listingId);

  if (error) return { ok: false, error: friendlyDbError(error.message) };

  const listing = await findListingById(listingId);
  if (!listing) return { ok: false, error: "Listing not found in this session." };
  return { ok: true, listing };
}
