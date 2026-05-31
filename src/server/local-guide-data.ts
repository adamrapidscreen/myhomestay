import "server-only";

import type {
  GuideItem,
  GuideItemCategory,
  PublicGuideItem,
} from "@/types/launch";
import type { GuideItemDraft } from "@/lib/local-guide";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Supabase-backed local guide data layer.
 *
 * Owner CRUD is RLS-scoped through listing ownership (migration 0012). Public
 * reads go through the get_published_listing_guide_items RPC so anon never
 * touches the table directly, matching the Chapter 4 public-read decision.
 */

interface GuideItemRow {
  id: string;
  listing_id: string;
  category: string;
  title: string;
  note: string;
  distance_label: string | null;
  is_public: boolean;
  sort_order: number;
}

interface PublicGuideItemRow {
  id: string;
  category: string;
  title: string;
  note: string;
  distance_label: string | null;
  sort_order: number;
}

const GUIDE_SELECT =
  "id, listing_id, category, title, note, distance_label, is_public, sort_order";

function mapGuideItem(row: GuideItemRow): GuideItem {
  return {
    id: row.id,
    listingId: row.listing_id,
    category: row.category as GuideItemCategory,
    title: row.title,
    note: row.note,
    distanceLabel: row.distance_label ?? undefined,
    isPublic: row.is_public,
    sortOrder: row.sort_order,
  };
}

export type GuideWriteResult =
  | { ok: true }
  | { ok: false; error: string };

/** All guide items for a listing, owner-scoped via RLS. Ordered for display. */
export async function listGuideItems(listingId: string): Promise<GuideItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("listing_guide_items")
    .select(GUIDE_SELECT)
    .eq("listing_id", listingId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return (data as GuideItemRow[]).map(mapGuideItem);
}

/** Public guide items for a published listing via the column-scoped RPC. */
export async function listPublishedGuideItems(
  listingId: string,
): Promise<PublicGuideItem[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc(
    "get_published_listing_guide_items",
    { p_listing_id: listingId },
  );

  if (error || !data) return [];
  return (data as PublicGuideItemRow[]).map((row) => ({
    id: row.id,
    category: row.category as GuideItemCategory,
    title: row.title,
    note: row.note,
    distanceLabel: row.distance_label ?? undefined,
    sortOrder: row.sort_order,
  }));
}

/** Next sort_order for a listing's guide items (max + 1, or 1 when empty). */
async function nextGuideSortOrder(listingId: string): Promise<number> {
  const items = await listGuideItems(listingId);
  return items.reduce((max, i) => Math.max(max, i.sortOrder), 0) + 1;
}

/** Create a guide item. RLS rejects listings the caller does not own. */
export async function createGuideItem(
  listingId: string,
  draft: GuideItemDraft,
): Promise<GuideWriteResult> {
  const supabase = await createSupabaseServerClient();
  const sortOrder = await nextGuideSortOrder(listingId);
  const { error } = await supabase.from("listing_guide_items").insert({
    listing_id: listingId,
    category: draft.category,
    title: draft.title,
    note: draft.note,
    distance_label: draft.distanceLabel || null,
    is_public: draft.isPublic,
    sort_order: sortOrder,
  });

  if (error) return { ok: false, error: "Could not add the guide item." };
  return { ok: true };
}

/** Update a guide item. RLS scopes to listings the caller owns. */
export async function updateGuideItem(
  itemId: string,
  draft: GuideItemDraft,
): Promise<GuideWriteResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("listing_guide_items")
    .update({
      category: draft.category,
      title: draft.title,
      note: draft.note,
      distance_label: draft.distanceLabel || null,
      is_public: draft.isPublic,
    })
    .eq("id", itemId);

  if (error) return { ok: false, error: "Could not update the guide item." };
  return { ok: true };
}

/** Delete a guide item. RLS scopes to listings the caller owns. */
export async function deleteGuideItem(itemId: string): Promise<GuideWriteResult> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("listing_guide_items")
    .delete()
    .eq("id", itemId);

  if (error) return { ok: false, error: "Could not delete the guide item." };
  return { ok: true };
}
